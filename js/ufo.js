// Space Invaders - UFO Module
import { CANVAS, UFO, SPRITES, COLORS } from './constants.js';

export class MysteryUFO {
    constructor() {
        this.reset();
        this.shotCount = 0; // Track player shots for scoring
    }

    reset() {
        this.x = 0;
        this.y = UFO.Y_POSITION;
        this.width = UFO.WIDTH;
        this.height = UFO.HEIGHT;
        this.isActive = false;
        this.direction = 1;
        this.spawnTimer = 0;
        this.nextSpawnTime = this.getRandomSpawnTime();
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionDuration = 500;
        this.scoreDisplay = null;
        this.scoreDisplayTimer = 0;
        this.sound = null;
    }

    getRandomSpawnTime() {
        return UFO.MIN_INTERVAL + Math.random() * (UFO.MAX_INTERVAL - UFO.MIN_INTERVAL);
    }

    incrementShotCount() {
        this.shotCount++;
    }

    calculateScore() {
        // Special scoring: 23rd shot and every 15th after = 300 points
        if (this.shotCount === 23 || (this.shotCount > 23 && (this.shotCount - 23) % 15 === 0)) {
            return 300;
        }
        // Otherwise random 50, 100, or 150
        const scores = [50, 100, 150];
        return scores[Math.floor(Math.random() * scores.length)];
    }

    spawn() {
        if (this.isActive) return;

        // Randomly spawn from left or right
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.x = this.direction === 1 ? -this.width : CANVAS.WIDTH;
        this.isActive = true;
        this.isExploding = false;
    }

    update(deltaTime, audioManager) {
        // Handle score display
        if (this.scoreDisplay !== null) {
            this.scoreDisplayTimer += deltaTime;
            if (this.scoreDisplayTimer >= 1000) {
                this.scoreDisplay = null;
                this.scoreDisplayTimer = 0;
            }
        }

        if (this.isExploding) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionDuration) {
                this.isExploding = false;
                this.isActive = false;
            }
            return;
        }

        if (!this.isActive) {
            // Check if time to spawn
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.nextSpawnTime) {
                this.spawn();
                this.spawnTimer = 0;
                this.nextSpawnTime = this.getRandomSpawnTime();

                // Start UFO sound
                if (audioManager) {
                    this.sound = audioManager.playUFO();
                }
            }
            return;
        }

        // Move UFO
        this.x += UFO.SPEED * this.direction;

        // Check if off screen
        if ((this.direction === 1 && this.x > CANVAS.WIDTH) ||
            (this.direction === -1 && this.x + this.width < 0)) {
            this.isActive = false;
            this.stopSound(audioManager);
        }
    }

    hit(audioManager) {
        if (!this.isActive || this.isExploding) return 0;

        this.isExploding = true;
        this.explosionTimer = 0;

        // Calculate and display score
        const score = this.calculateScore();
        this.scoreDisplay = score;
        this.scoreDisplayTimer = 0;

        this.stopSound(audioManager);

        return score;
    }

    stopSound(audioManager) {
        if (this.sound && audioManager) {
            audioManager.stopUFO(this.sound);
            this.sound = null;
        }
    }

    draw(ctx) {
        // Draw score display
        if (this.scoreDisplay !== null) {
            ctx.fillStyle = COLORS.UFO;
            ctx.font = '18px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(this.scoreDisplay.toString(), this.x + this.width / 2, this.y + this.height / 2 + 6);
        }

        if (!this.isActive) return;

        if (this.isExploding) {
            this.drawExplosion(ctx);
            return;
        }

        // Draw UFO sprite
        const sprite = SPRITES.UFO;
        const pixelSize = 3;

        ctx.fillStyle = COLORS.UFO;

        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                if (sprite[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize,
                        this.y + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }

    drawExplosion(ctx) {
        const sprite = SPRITES.EXPLOSION;
        const pixelSize = 3;
        const flicker = Math.floor(this.explosionTimer / 100) % 2;

        ctx.fillStyle = flicker ? COLORS.UFO : '#FFFFFF';

        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                if (sprite[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize,
                        this.y + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }

    getBounds() {
        if (!this.isActive || this.isExploding) return null;
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
