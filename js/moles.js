// Mole Manager for Corporate Whack
// Handles mole spawning, animation, and hit detection

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { PROBLEMS, CULTURE, GAME_CONFIG } from './levels.js';
import { soundManager } from './sounds.js';

export class MoleManager {
    constructor(scene) {
        this.scene = scene;
        this.moles = []; // Active mole objects
        this.holes = []; // Hole positions and states
        this.moleGeometry = null;
        this.moleMaterials = {};
        
        this.initGeometry();
        this.initHoles();
    }

    initGeometry() {
        // Create mole body geometry (cylinder with rounded top)
        this.moleGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 16);
        
        // Create materials for each mole type
        [...PROBLEMS, ...CULTURE].forEach(moleType => {
            this.moleMaterials[moleType.id] = new THREE.MeshStandardMaterial({
                color: moleType.color,
                roughness: 0.7,
                metalness: 0.1
            });
        });

        // Special material for culture moles (shinier, more "corporate")
        CULTURE.forEach(moleType => {
            this.moleMaterials[moleType.id] = new THREE.MeshStandardMaterial({
                color: moleType.color,
                roughness: 0.3,
                metalness: 0.5,
                emissive: moleType.color,
                emissiveIntensity: 0.2
            });
        });
    }

    initHoles() {
        // Initialize hole states
        GAME_CONFIG.holePositions.forEach((pos, index) => {
            this.holes.push({
                index: index,
                x: pos.x * 2, // Scale to world units
                z: pos.z * 2,
                occupied: false,
                mole: null
            });
        });
    }

    // Get a random unoccupied hole
    getAvailableHole() {
        const available = this.holes.filter(h => !h.occupied);
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    // Get a random mole type based on problem ratio
    getMoleType(problemRatio) {
        const isProblem = Math.random() < problemRatio;
        const pool = isProblem ? PROBLEMS : CULTURE;
        const moleData = pool[Math.floor(Math.random() * pool.length)];
        return {
            ...moleData,
            isProblem: isProblem
        };
    }

    // Spawn a new mole
    spawnMole(problemRatio, visibleTime) {
        const hole = this.getAvailableHole();
        if (!hole) return null;

        const moleType = this.getMoleType(problemRatio);
        
        // Create mole mesh
        const mesh = new THREE.Mesh(
            this.moleGeometry,
            this.moleMaterials[moleType.id]
        );

        // Position below the surface initially
        mesh.position.set(hole.x, -0.8, hole.z);
        
        // Create emoji sprite for the mole face
        const sprite = this.createEmojiSprite(moleType.emoji);
        sprite.position.set(0, 0.2, 0.36);
        sprite.scale.set(0.5, 0.5, 1);
        mesh.add(sprite);

        // Create label sprite
        const label = this.createLabelSprite(moleType.label);
        label.position.set(0, 0.6, 0);
        label.scale.set(1.5, 0.4, 1);
        mesh.add(label);

        this.scene.add(mesh);

        // Create mole object
        const mole = {
            mesh: mesh,
            hole: hole,
            type: moleType,
            state: 'rising', // rising, visible, falling, hit
            spawnTime: Date.now(),
            visibleTime: visibleTime,
            targetY: 0.3, // Final raised position
            startY: -0.8
        };

        // Mark hole as occupied
        hole.occupied = true;
        hole.mole = mole;
        
        this.moles.push(mole);
        
        // Play popup sound
        soundManager.playPopup();

        return mole;
    }

    // Create emoji sprite
    createEmojiSprite(emoji) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        return new THREE.Sprite(material);
    }

    // Create label sprite
    createLabelSprite(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.roundRect(0, 0, 256, 64, 8);
        ctx.fill();
        
        // Text
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        return new THREE.Sprite(material);
    }

    // Update all moles
    update(deltaTime) {
        const now = Date.now();
        const molesToRemove = [];

        this.moles.forEach(mole => {
            const elapsed = now - mole.spawnTime;
            
            switch (mole.state) {
                case 'rising':
                    // Animate rising from hole
                    const riseProgress = Math.min(elapsed / 200, 1);
                    mole.mesh.position.y = THREE.MathUtils.lerp(
                        mole.startY,
                        mole.targetY,
                        this.easeOutBack(riseProgress)
                    );
                    
                    if (riseProgress >= 1) {
                        mole.state = 'visible';
                        mole.visibleStartTime = now;
                    }
                    break;

                case 'visible':
                    // Slight bobbing animation
                    const bob = Math.sin((now - mole.visibleStartTime) / 100) * 0.05;
                    mole.mesh.position.y = mole.targetY + bob;
                    
                    // Check if should start falling
                    if (now - mole.visibleStartTime > mole.visibleTime) {
                        mole.state = 'falling';
                        mole.fallStartTime = now;
                        
                        // If this was a problem mole, it escaped (missed)
                        if (mole.type.isProblem) {
                            mole.escaped = true;
                        }
                    }
                    break;

                case 'falling':
                    // Animate falling back into hole
                    const fallProgress = Math.min((now - mole.fallStartTime) / 150, 1);
                    mole.mesh.position.y = THREE.MathUtils.lerp(
                        mole.targetY,
                        mole.startY,
                        this.easeInQuad(fallProgress)
                    );
                    
                    if (fallProgress >= 1) {
                        molesToRemove.push(mole);
                    }
                    break;

                case 'hit':
                    // Quick squash animation
                    const hitProgress = Math.min((now - mole.hitTime) / 200, 1);
                    mole.mesh.scale.y = 1 - (hitProgress * 0.8);
                    mole.mesh.position.y -= deltaTime * 2;
                    
                    if (hitProgress >= 1) {
                        molesToRemove.push(mole);
                    }
                    break;
            }
        });

        // Remove finished moles
        molesToRemove.forEach(mole => this.removeMole(mole));

        return molesToRemove;
    }

    // Check if a point hits any mole
    checkHit(point, camera) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(point, camera);

        // Only check moles that are visible
        const visibleMoles = this.moles.filter(m => 
            m.state === 'visible' || m.state === 'rising'
        );

        for (const mole of visibleMoles) {
            const intersects = raycaster.intersectObject(mole.mesh, true);
            if (intersects.length > 0) {
                return this.hitMole(mole);
            }
        }

        return null;
    }

    // Handle mole being hit
    hitMole(mole) {
        if (mole.state === 'hit') return null;

        mole.state = 'hit';
        mole.hitTime = Date.now();

        // Flash effect based on type
        if (mole.type.isProblem) {
            // Good hit - green flash
            mole.mesh.material = new THREE.MeshStandardMaterial({
                color: 0x2ecc71,
                emissive: 0x2ecc71,
                emissiveIntensity: 0.5
            });
        } else {
            // Bad hit - red flash
            mole.mesh.material = new THREE.MeshStandardMaterial({
                color: 0xe74c3c,
                emissive: 0xe74c3c,
                emissiveIntensity: 0.8
            });
        }

        return {
            isProblem: mole.type.isProblem,
            label: mole.type.label,
            mole: mole
        };
    }

    // Remove mole from scene
    removeMole(mole) {
        // Free up the hole
        mole.hole.occupied = false;
        mole.hole.mole = null;

        // Remove from scene
        this.scene.remove(mole.mesh);
        
        // Dispose of geometries and materials
        mole.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });

        // Remove from array
        const index = this.moles.indexOf(mole);
        if (index > -1) {
            this.moles.splice(index, 1);
        }
    }

    // Clear all moles
    clearAll() {
        [...this.moles].forEach(mole => this.removeMole(mole));
    }

    // Get count of escaped problem moles
    getEscapedCount() {
        return this.moles.filter(m => m.escaped).length;
    }

    // Easing functions
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    easeInQuad(t) {
        return t * t;
    }
}
