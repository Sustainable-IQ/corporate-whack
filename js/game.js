// Game State Manager for Corporate Whack
// Handles game flow, scoring, level progression

import { LEVELS, GAME_CONFIG, PROMOTION_MESSAGES, GAMEOVER_MESSAGES } from './levels.js';
import { soundManager } from './sounds.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.currentLevelIndex = 0;
        this.score = 0; // Problems hit this level
        this.totalScore = 0; // Total problems hit all game
        this.totalMissed = 0; // Total problems missed all game
        this.strikes = 0; // Culture items hit
        this.timeRemaining = 60;
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.victory = false;
        this.molesSpawned = 0;
        this.lastSpawnTime = 0;
    }

    get currentLevel() {
        return LEVELS[this.currentLevelIndex];
    }

    get levelName() {
        return this.currentLevel.name;
    }

    get targetHits() {
        return this.currentLevel.targetHits;
    }

    get maxStrikes() {
        return GAME_CONFIG.maxStrikes;
    }

    get strikesRemaining() {
        return this.maxStrikes - this.strikes;
    }

    // Start a new game
    startGame() {
        this.reset();
        this.isPlaying = true;
        this.timeRemaining = this.currentLevel.timeLimit;
        soundManager.init();
        soundManager.resume();
    }

    // Handle problem mole hit
    hitProblem() {
        this.score++;
        this.totalScore++;
        soundManager.playWhack();
        
        return {
            success: true,
            message: '+1',
            score: this.score,
            target: this.targetHits
        };
    }

    // Handle culture mole hit (bad!)
    hitCulture() {
        this.strikes++;
        soundManager.playBuzz();
        
        if (this.strikes >= this.maxStrikes) {
            return this.endGame('fired');
        }
        
        return {
            success: false,
            message: 'HR WARNING!',
            strikes: this.strikes,
            maxStrikes: this.maxStrikes
        };
    }

    // Handle missed problem mole
    missProblem() {
        this.totalMissed++;
        soundManager.playMiss();
    }

    // Update game timer
    updateTimer(deltaTime) {
        if (!this.isPlaying || this.isPaused) return null;

        this.timeRemaining -= deltaTime;
        
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            return this.checkLevelEnd();
        }
        
        return null;
    }

    // Check if level should end
    checkLevelEnd() {
        // Check if target reached
        if (this.score >= this.targetHits) {
            return this.advanceLevel();
        }
        
        // Time's up - check success rate
        const successRate = this.score / this.targetHits;
        
        if (successRate >= GAME_CONFIG.minSuccessRate) {
            // Passed with minimum success
            return this.advanceLevel();
        } else {
            // Failed the level
            return this.demoteOrEnd();
        }
    }

    // Advance to next level
    advanceLevel() {
        if (this.currentLevelIndex >= LEVELS.length - 1) {
            // Beat the final level!
            return this.endGame('victory');
        }
        
        this.currentLevelIndex++;
        soundManager.playLevelUp();
        
        return {
            type: 'levelup',
            newLevel: this.currentLevel,
            message: PROMOTION_MESSAGES[this.currentLevelIndex + 1] || 'You\'ve been promoted!'
        };
    }

    // Demote to previous level or end game
    demoteOrEnd() {
        if (this.currentLevelIndex <= 0) {
            // Can't demote from Junior Staff
            return this.endGame('performance');
        }
        
        this.currentLevelIndex--;
        
        return {
            type: 'demote',
            newLevel: this.currentLevel,
            message: 'Performance concerns. You\'ve been demoted.'
        };
    }

    // Start new level (after promotion/demotion)
    startLevel() {
        this.score = 0;
        this.timeRemaining = this.currentLevel.timeLimit;
        this.lastSpawnTime = 0;
        this.molesSpawned = 0;
    }

    // End the game
    endGame(reason) {
        this.isPlaying = false;
        this.gameOver = true;
        
        if (reason === 'victory') {
            this.victory = true;
            soundManager.playVictory();
            
            return {
                type: 'victory',
                stats: this.getStats()
            };
        }
        
        soundManager.playGameOver();
        
        const messages = reason === 'fired' ? 
            GAMEOVER_MESSAGES.fired : 
            GAMEOVER_MESSAGES.performance;
        
        return {
            type: 'gameover',
            reason: reason,
            message: messages[Math.floor(Math.random() * messages.length)],
            stats: this.getStats()
        };
    }

    // Get game statistics
    getStats() {
        return {
            finalLevel: this.levelName,
            levelIndex: this.currentLevelIndex + 1,
            totalLevels: LEVELS.length,
            problemsSolved: this.totalScore,
            problemsMissed: this.totalMissed,
            cultureViolations: this.strikes,
            successRate: this.totalScore > 0 ? 
                Math.round((this.totalScore / (this.totalScore + this.totalMissed)) * 100) : 0
        };
    }

    // Check if should spawn new mole
    shouldSpawn(currentTime) {
        if (!this.isPlaying || this.isPaused) return false;
        
        const timeSinceSpawn = currentTime - this.lastSpawnTime;
        return timeSinceSpawn >= this.currentLevel.spawnInterval;
    }

    // Record spawn
    recordSpawn(currentTime) {
        this.lastSpawnTime = currentTime;
        this.molesSpawned++;
    }

    // Get current level config
    getLevelConfig() {
        return {
            problemRatio: this.currentLevel.problemRatio,
            visibleTime: this.currentLevel.moleVisibleTime,
            maxActive: this.currentLevel.maxActiveMoles,
            spawnInterval: this.currentLevel.spawnInterval
        };
    }

    // Pause/unpause
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }
}
