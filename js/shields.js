// Space Invaders - Shield System
import { CANVAS, SHIELDS, SPRITES, COLORS } from './constants.js';

class Shield {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = SHIELDS.WIDTH;
        this.height = SHIELDS.HEIGHT;
        this.pixelSize = 3;

        // Create pixel grid from sprite (true = solid, false = destroyed)
        this.pixels = this.initPixels();
    }

    initPixels() {
        const sprite = SPRITES.SHIELD;
        const pixels = [];

        for (let row = 0; row < sprite.length; row++) {
            pixels[row] = [];
            for (let col = 0; col < sprite[row].length; col++) {
                pixels[row][col] = sprite[row][col] === 1;
            }
        }

        return pixels;
    }

    reset() {
        this.pixels = this.initPixels();
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.SHIELD;

        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                if (this.pixels[row][col]) {
                    ctx.fillRect(
                        this.x + col * this.pixelSize,
                        this.y + row * this.pixelSize,
                        this.pixelSize,
                        this.pixelSize
                    );
                }
            }
        }
    }

    // Check if a point hits the shield and damage it
    checkHit(bulletX, bulletY, bulletWidth, bulletHeight, isPlayerBullet) {
        // Convert bullet position to local shield coordinates
        const localX = Math.floor((bulletX - this.x) / this.pixelSize);
        const localY = Math.floor((bulletY - this.y) / this.pixelSize);
        const localWidth = Math.ceil(bulletWidth / this.pixelSize);
        const localHeight = Math.ceil(bulletHeight / this.pixelSize);

        let hit = false;

        // Check if any part of bullet overlaps with shield pixels
        for (let row = localY; row < localY + localHeight; row++) {
            for (let col = localX; col < localX + localWidth; col++) {
                if (row >= 0 && row < this.pixels.length &&
                    col >= 0 && col < this.pixels[0].length &&
                    this.pixels[row][col]) {
                    hit = true;
                    break;
                }
            }
            if (hit) break;
        }

        if (hit) {
            this.damage(localX, localY, isPlayerBullet);
        }

        return hit;
    }

    // Damage shield pixels in an explosion pattern
    damage(centerX, centerY, fromBelow) {
        const radius = 2;
        const startY = fromBelow ? centerY - radius : centerY;
        const endY = fromBelow ? centerY + 1 : centerY + radius + 1;

        for (let row = startY; row < endY; row++) {
            for (let col = centerX - radius; col <= centerX + radius; col++) {
                if (row >= 0 && row < this.pixels.length &&
                    col >= 0 && col < this.pixels[0].length) {
                    // Random destruction pattern
                    if (Math.random() < 0.7) {
                        this.pixels[row][col] = false;
                    }
                }
            }
        }
    }

    // Check if alien body overlaps with shield
    checkAlienCollision(alienBounds) {
        const localX = Math.floor((alienBounds.x - this.x) / this.pixelSize);
        const localY = Math.floor((alienBounds.y - this.y) / this.pixelSize);
        const localWidth = Math.ceil(alienBounds.width / this.pixelSize);
        const localHeight = Math.ceil(alienBounds.height / this.pixelSize);

        let hasOverlap = false;

        // Check and destroy overlapping pixels
        for (let row = localY; row < localY + localHeight; row++) {
            for (let col = localX; col < localX + localWidth; col++) {
                if (row >= 0 && row < this.pixels.length &&
                    col >= 0 && col < this.pixels[0].length &&
                    this.pixels[row][col]) {
                    this.pixels[row][col] = false;
                    hasOverlap = true;
                }
            }
        }

        return hasOverlap;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isDestroyed() {
        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                if (this.pixels[row][col]) return false;
            }
        }
        return true;
    }
}

export class ShieldManager {
    constructor() {
        this.shields = [];
    }

    init() {
        this.shields = [];

        // Calculate shield positions to be evenly spaced
        const totalWidth = CANVAS.WIDTH;
        const shieldWidth = SHIELDS.WIDTH;
        const numShields = SHIELDS.COUNT;
        const totalShieldsWidth = numShields * shieldWidth;
        const spacing = (totalWidth - totalShieldsWidth) / (numShields + 1);

        for (let i = 0; i < numShields; i++) {
            const x = spacing + i * (shieldWidth + spacing);
            this.shields.push(new Shield(x, SHIELDS.Y_POSITION));
        }
    }

    reset() {
        this.shields.forEach(shield => shield.reset());
    }

    draw(ctx) {
        this.shields.forEach(shield => shield.draw(ctx));
    }

    checkBulletCollision(bullet) {
        const bounds = bullet.getBounds();

        for (const shield of this.shields) {
            // Quick bounding box check first
            const shieldBounds = shield.getBounds();
            if (bounds.x < shieldBounds.x + shieldBounds.width &&
                bounds.x + bounds.width > shieldBounds.x &&
                bounds.y < shieldBounds.y + shieldBounds.height &&
                bounds.y + bounds.height > shieldBounds.y) {

                // Detailed pixel check
                if (shield.checkHit(bounds.x, bounds.y, bounds.width, bounds.height, bullet.isPlayerBullet)) {
                    return true;
                }
            }
        }

        return false;
    }

    checkAlienCollision(alienBounds) {
        for (const shield of this.shields) {
            const shieldBounds = shield.getBounds();
            if (alienBounds.x < shieldBounds.x + shieldBounds.width &&
                alienBounds.x + alienBounds.width > shieldBounds.x &&
                alienBounds.y < shieldBounds.y + shieldBounds.height &&
                alienBounds.y + alienBounds.height > shieldBounds.y) {

                shield.checkAlienCollision(alienBounds);
            }
        }
    }
}
