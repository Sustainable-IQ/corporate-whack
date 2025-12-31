// Main entry point for Corporate Whack
// Sets up Three.js scene, handles input, runs game loop

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { MoleManager } from './moles.js';
import { GameState } from './game.js';
import { soundManager } from './sounds.js';
import { GAME_CONFIG } from './levels.js';

class CorporateWhack {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.moleManager = null;
        this.gameState = null;
        this.clock = new THREE.Clock();
        this.mousePosition = new THREE.Vector2();
        this.malletElement = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLighting();
        this.setupOfficeEnvironment();
        this.setupMallet();
        this.setupEventListeners();
        
        this.moleManager = new MoleManager(this.scene);
        this.gameState = new GameState();
        
        this.animate();
    }

    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2c3e50);

        // Create camera with perspective for 3D-ish feel
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // Angled view looking down at the desk
        this.camera.position.set(0, 5, 4);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('game-container').appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // Main overhead light (like office fluorescent)
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(0, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x8ecae6, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Rim light for drama
        const rimLight = new THREE.DirectionalLight(0xf39c12, 0.2);
        rimLight.position.set(5, 3, -5);
        this.scene.add(rimLight);
    }

    setupOfficeEnvironment() {
        // Desk surface (main game board)
        const deskGeometry = new THREE.BoxGeometry(6, 0.2, 6);
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355, // Wood brown
            roughness: 0.8,
            metalness: 0.1
        });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = -0.5;
        desk.receiveShadow = true;
        this.scene.add(desk);

        // Desk edge trim
        const trimGeometry = new THREE.BoxGeometry(6.2, 0.3, 6.2);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: 0x5d4e37,
            roughness: 0.7
        });
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.y = -0.65;
        this.scene.add(trim);

        // Create holes in desk
        this.createHoles();

        // Add office decorations
        this.addOfficeDecorations();

        // Back wall
        const wallGeometry = new THREE.PlaneGeometry(10, 6);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x95a5a6,
            roughness: 0.9
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, 2, -4);
        wall.receiveShadow = true;
        this.scene.add(wall);

        // Motivational poster frames
        this.addMotivationalPosters();
    }

    createHoles() {
        GAME_CONFIG.holePositions.forEach((pos, index) => {
            // Hole rim
            const rimGeometry = new THREE.RingGeometry(0.35, 0.45, 32);
            const rimMaterial = new THREE.MeshStandardMaterial({
                color: 0x34495e,
                side: THREE.DoubleSide
            });
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.x = -Math.PI / 2;
            rim.position.set(pos.x * 2, -0.38, pos.z * 2);
            this.scene.add(rim);

            // Dark hole interior
            const holeGeometry = new THREE.CircleGeometry(0.35, 32);
            const holeMaterial = new THREE.MeshBasicMaterial({
                color: 0x0a0a0a
            });
            const hole = new THREE.Mesh(holeGeometry, holeMaterial);
            hole.rotation.x = -Math.PI / 2;
            hole.position.set(pos.x * 2, -0.39, pos.z * 2);
            this.scene.add(hole);
        });
    }

    addOfficeDecorations() {
        // Coffee mug
        const mugGeometry = new THREE.CylinderGeometry(0.15, 0.13, 0.3, 16);
        const mugMaterial = new THREE.MeshStandardMaterial({ color: 0xecf0f1 });
        const mug = new THREE.Mesh(mugGeometry, mugMaterial);
        mug.position.set(2.5, -0.25, 2);
        mug.castShadow = true;
        this.scene.add(mug);

        // Coffee inside
        const coffeeGeometry = new THREE.CircleGeometry(0.13, 16);
        const coffeeMaterial = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
        const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.set(2.5, -0.09, 2);
        this.scene.add(coffee);

        // Sad potted plant
        const potGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.25, 16);
        const potMaterial = new THREE.MeshStandardMaterial({ color: 0xb7410e });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.set(-2.5, -0.28, -2);
        pot.castShadow = true;
        this.scene.add(pot);

        // Wilting plant
        const plantGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
        const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x556b2f });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.set(-2.5, 0.05, -2);
        plant.rotation.z = 0.3; // Wilting
        this.scene.add(plant);

        // Stack of papers
        for (let i = 0; i < 5; i++) {
            const paperGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.5);
            const paperMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xfafafa 
            });
            const paper = new THREE.Mesh(paperGeometry, paperMaterial);
            paper.position.set(2.3, -0.35 + (i * 0.02), -2);
            paper.rotation.y = (Math.random() - 0.5) * 0.2;
            this.scene.add(paper);
        }

        // Post-it notes
        const postItColors = [0xffeb3b, 0xff69b4, 0x87ceeb];
        postItColors.forEach((color, i) => {
            const noteGeometry = new THREE.PlaneGeometry(0.3, 0.3);
            const noteMaterial = new THREE.MeshStandardMaterial({ 
                color: color,
                side: THREE.DoubleSide
            });
            const note = new THREE.Mesh(noteGeometry, noteMaterial);
            note.rotation.x = -Math.PI / 2;
            note.position.set(-2 + (i * 0.4), -0.38, 2.5);
            note.rotation.z = (Math.random() - 0.5) * 0.5;
            this.scene.add(note);
        });
    }

    addMotivationalPosters() {
        const posterTexts = ['SYNERGY', 'TEAMWORK', 'HUSTLE'];
        const posterColors = [0x3498db, 0x2ecc71, 0xe74c3c];

        posterTexts.forEach((text, i) => {
            // Frame
            const frameGeometry = new THREE.BoxGeometry(1.5, 1, 0.1);
            const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(-2.5 + (i * 2.5), 2, -3.9);
            this.scene.add(frame);

            // Poster
            const posterGeometry = new THREE.PlaneGeometry(1.3, 0.8);
            const posterCanvas = this.createPosterTexture(text, posterColors[i]);
            const posterMaterial = new THREE.MeshBasicMaterial({ 
                map: posterCanvas 
            });
            const poster = new THREE.Mesh(posterGeometry, posterMaterial);
            poster.position.set(-2.5 + (i * 2.5), 2, -3.84);
            this.scene.add(poster);
        });
    }

    createPosterTexture(text, bgColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#' + bgColor.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, 256, 160);

        // Text
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, 128, 80);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    setupMallet() {
        // Create custom cursor mallet
        this.malletElement = document.createElement('div');
        this.malletElement.className = 'mallet-cursor';
        this.malletElement.innerHTML = `
            <svg class="mallet-svg" viewBox="0 0 60 100">
                <!-- Handle -->
                <rect x="25" y="35" width="10" height="60" fill="#8b4513" rx="2"/>
                <rect x="26" y="35" width="3" height="60" fill="#a0522d"/>
                
                <!-- Head -->
                <ellipse cx="30" cy="20" rx="25" ry="18" fill="#696969"/>
                <ellipse cx="30" cy="20" rx="22" ry="15" fill="#808080"/>
                <ellipse cx="30" cy="15" rx="18" ry="8" fill="#a9a9a9"/>
                
                <!-- Shine -->
                <ellipse cx="22" cy="12" rx="5" ry="3" fill="#c0c0c0" opacity="0.5"/>
            </svg>
        `;
        document.body.appendChild(this.malletElement);
    }

    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Update mallet position
            if (this.malletElement) {
                this.malletElement.style.left = e.clientX + 'px';
                this.malletElement.style.top = e.clientY + 'px';
            }
        });

        // Mouse click - whack!
        document.addEventListener('mousedown', (e) => {
            if (!this.gameState.isPlaying) return;
            
            // Animate mallet swing
            this.malletElement.classList.add('swinging');
            setTimeout(() => {
                this.malletElement.classList.remove('swinging');
            }, 100);

            // Check for hit
            const hitResult = this.moleManager.checkHit(this.mousePosition, this.camera);
            this.handleHit(hitResult);
        });

        // Touch support for mobile
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            
            this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            // Update mallet position
            if (this.malletElement) {
                this.malletElement.style.left = touch.clientX + 'px';
                this.malletElement.style.top = touch.clientY + 'px';
            }
            
            // Only prevent default and handle hits during gameplay
            if (!this.gameState.isPlaying) return;
            
            e.preventDefault();
            
            // Animate mallet swing
            this.malletElement.classList.add('swinging');
            setTimeout(() => {
                this.malletElement.classList.remove('swinging');
            }, 100);

            // Check for hit
            const hitResult = this.moleManager.checkHit(this.mousePosition, this.camera);
            this.handleHit(hitResult);
        }, { passive: false });

        // Touch move - update mallet position
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            
            this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            if (this.malletElement) {
                this.malletElement.style.left = touch.clientX + 'px';
                this.malletElement.style.top = touch.clientY + 'px';
            }
        }, { passive: true });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Start button
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', () => {
            this.startGame();
        });
        startBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.startGame();
        });

        // Continue button (after level up)
        const continueBtn = document.getElementById('continue-btn');
        continueBtn.addEventListener('click', () => {
            this.continueGame();
        });
        continueBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.continueGame();
        });

        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        restartBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.restartGame();
        });

        // Replay button (after victory)
        const replayBtn = document.getElementById('replay-btn');
        replayBtn.addEventListener('click', () => {
            this.restartGame();
        });
        replayBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.restartGame();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                const startScreen = document.getElementById('start-screen');
                const levelUpScreen = document.getElementById('levelup-screen');
                const gameOverScreen = document.getElementById('gameover-screen');
                const winScreen = document.getElementById('win-screen');
                
                if (!startScreen.classList.contains('hidden')) {
                    this.startGame();
                } else if (!levelUpScreen.classList.contains('hidden')) {
                    this.continueGame();
                } else if (!gameOverScreen.classList.contains('hidden') || 
                           !winScreen.classList.contains('hidden')) {
                    this.restartGame();
                }
            }
            
            if (e.code === 'KeyP' && this.gameState.isPlaying) {
                this.gameState.togglePause();
            }
        });
    }

    handleHit(hitResult) {
        if (!hitResult) return;

        if (hitResult.isProblem) {
            // Good hit!
            const result = this.gameState.hitProblem();
            this.showHitFeedback('+1', 'good');
            this.updateHUD();
            this.shakeScreen(false);
            
            // Check for level completion
            if (this.gameState.score >= this.gameState.targetHits) {
                this.handleLevelComplete();
            }
        } else {
            // Bad hit - culture item
            const result = this.gameState.hitCulture();
            this.showHitFeedback('HR WARNING!', 'bad');
            this.showRedHalo();
            this.updateHUD();
            this.shakeScreen(true);
            
            if (result.type === 'gameover') {
                this.handleGameOver(result);
            }
        }
    }

    showHitFeedback(text, type) {
        const feedback = document.getElementById('hit-feedback');
        feedback.textContent = text;
        feedback.className = type;
        
        // Reset animation
        feedback.style.animation = 'none';
        feedback.offsetHeight; // Trigger reflow
        feedback.style.animation = '';
        
        setTimeout(() => {
            feedback.className = 'hidden';
        }, 500);
    }

    showRedHalo() {
        const halo = document.createElement('div');
        halo.className = 'red-halo';
        document.body.appendChild(halo);
        
        setTimeout(() => {
            halo.remove();
        }, 500);
    }

    shakeScreen(intense) {
        const container = document.getElementById('game-container');
        container.classList.add('shake');
        
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
    }

    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        this.gameState.startGame();
        this.updateHUD();
    }

    continueGame() {
        document.getElementById('levelup-screen').classList.add('hidden');
        this.gameState.isPaused = false;
        this.gameState.startLevel();
        this.moleManager.clearAll();
        this.updateHUD();
    }

    restartGame() {
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.add('hidden');
        this.moleManager.clearAll();
        this.gameState.startGame();
        this.updateHUD();
    }

    handleLevelComplete() {
        const result = this.gameState.checkLevelEnd();
        
        if (result.type === 'victory') {
            this.handleVictory(result);
        } else if (result.type === 'levelup') {
            this.showLevelUp(result);
        }
    }

    showLevelUp(result) {
        this.gameState.isPaused = true;
        
        document.getElementById('promotion-text').textContent = 
            `You've been promoted to ${result.newLevel.name}!`;
        document.querySelector('.promotion-warning').textContent = result.message;
        document.getElementById('levelup-screen').classList.remove('hidden');
    }

    handleGameOver(result) {
        this.gameState.isPlaying = false;
        
        document.getElementById('gameover-title').textContent = 
            result.reason === 'fired' ? 'YOU\'RE FIRED!' : 'PERFORMANCE REVIEW';
        document.getElementById('gameover-text').textContent = result.message;
        document.getElementById('final-stats').innerHTML = this.formatStats(result.stats);
        document.getElementById('gameover-screen').classList.remove('hidden');
    }

    handleVictory(result) {
        this.gameState.isPlaying = false;
        
        document.getElementById('win-stats').innerHTML = this.formatStats(result.stats);
        document.getElementById('win-screen').classList.remove('hidden');
    }

    formatStats(stats) {
        return `
            <div>Final Position: <strong>${stats.finalLevel}</strong></div>
            <div>Problems Solved: <strong>${stats.problemsSolved}</strong></div>
            <div>Problems Missed: <strong>${stats.problemsMissed}</strong></div>
            <div>Culture Violations: <strong>${stats.cultureViolations}</strong></div>
            <div>Success Rate: <strong>${stats.successRate}%</strong></div>
        `;
    }

    updateHUD() {
        document.getElementById('level-name').textContent = this.gameState.levelName;
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('target').textContent = this.gameState.targetHits;
        document.getElementById('timer').textContent = Math.ceil(this.gameState.timeRemaining);
        
        // Update strikes display
        const strikesEl = document.getElementById('strikes');
        let strikesHTML = '';
        for (let i = 0; i < this.gameState.maxStrikes; i++) {
            if (i < this.gameState.strikesRemaining) {
                strikesHTML += '●';
            } else {
                strikesHTML += '<span class="used">●</span>';
            }
        }
        strikesEl.innerHTML = strikesHTML;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        if (this.gameState.isPlaying && !this.gameState.isPaused) {
            // Update timer
            const timerResult = this.gameState.updateTimer(deltaTime);
            if (timerResult) {
                if (timerResult.type === 'victory') {
                    this.handleVictory(timerResult);
                } else if (timerResult.type === 'levelup') {
                    this.showLevelUp(timerResult);
                } else if (timerResult.type === 'gameover') {
                    this.handleGameOver(timerResult);
                } else if (timerResult.type === 'demote') {
                    // Handle demotion (simplified - just restart level)
                    this.gameState.startLevel();
                    this.moleManager.clearAll();
                }
            }
            
            // Spawn moles
            const now = Date.now();
            const config = this.gameState.getLevelConfig();
            
            if (this.gameState.shouldSpawn(now) && 
                this.moleManager.moles.length < config.maxActive) {
                this.moleManager.spawnMole(config.problemRatio, config.visibleTime);
                this.gameState.recordSpawn(now);
            }
            
            // Update moles
            const removedMoles = this.moleManager.update(deltaTime);
            
            // Check for escaped problems
            removedMoles.forEach(mole => {
                if (mole.escaped && mole.type.isProblem) {
                    this.gameState.missProblem();
                }
            });
            
            // Update HUD
            this.updateHUD();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CorporateWhack();
});