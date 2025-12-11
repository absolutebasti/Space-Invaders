// Space Invaders - Player Module
import { CANVAS, PLAYER, SPRITES, COLORS } from './constants.js';

export class Player {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = PLAYER.START_X - PLAYER.WIDTH / 2;
        this.y = PLAYER.Y_POSITION;
        this.width = PLAYER.WIDTH;
        this.height = PLAYER.HEIGHT;
        this.speed = PLAYER.SPEED;
        this.isAlive = true;
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionDuration = 1000; // 1 second explosion animation
        this.respawnTimer = 0;
        this.movingLeft = false;
        this.movingRight = false;
    }

    update(deltaTime) {
        if (this.isExploding) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionDuration) {
                this.isExploding = false;
                this.explosionTimer = 0;
                return 'exploded'; // Signal that explosion finished
            }
            return 'exploding';
        }

        if (!this.isAlive) {
            this.respawnTimer += deltaTime;
            if (this.respawnTimer >= PLAYER.RESPAWN_DELAY) {
                this.isAlive = true;
                this.respawnTimer = 0;
                this.x = PLAYER.START_X - PLAYER.WIDTH / 2;
            }
            return 'dead';
        }

        // Handle movement
        if (this.movingLeft && this.x > 10) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < CANVAS.WIDTH - this.width - 10) {
            this.x += this.speed;
        }

        return 'alive';
    }

    die() {
        if (this.isAlive && !this.isExploding) {
            this.isAlive = false;
            this.isExploding = true;
            this.explosionTimer = 0;
            return true;
        }
        return false;
    }

    respawn() {
        this.isAlive = true;
        this.isExploding = false;
        this.explosionTimer = 0;
        this.respawnTimer = 0;
        this.x = PLAYER.START_X - PLAYER.WIDTH / 2;
    }

    draw(ctx) {
        if (this.isExploding) {
            // Draw explosion
            this.drawExplosion(ctx);
        } else if (this.isAlive) {
            // Draw player cannon
            this.drawSprite(ctx);
        }
    }

    drawSprite(ctx) {
        const sprite = SPRITES.PLAYER;
        const pixelSize = 3; // Scale factor

        ctx.fillStyle = COLORS.PLAYER;

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

        // Flicker effect during explosion
        const flicker = Math.floor(this.explosionTimer / 100) % 2;
        ctx.fillStyle = flicker ? COLORS.PLAYER : '#FFFFFF';

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
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    setMoving(direction, isMoving) {
        if (direction === 'left') {
            this.movingLeft = isMoving;
        } else if (direction === 'right') {
            this.movingRight = isMoving;
        }
    }

    canShoot() {
        return this.isAlive && !this.isExploding;
    }
}
