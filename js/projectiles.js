// Space Invaders - Projectile System
import { CANVAS, PLAYER, ALIEN_BULLETS, COLORS } from './constants.js';

export class Projectile {
    constructor(x, y, speed, width, height, isPlayerBullet = false, type = 'straight') {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.isPlayerBullet = isPlayerBullet;
        this.type = type; // straight, squiggly
        this.isActive = true;
        this.squigglyOffset = 0;
        this.squigglyPhase = 0;
    }

    update() {
        if (!this.isActive) return;

        if (this.isPlayerBullet) {
            this.y -= this.speed;
        } else {
            this.y += this.speed;

            // Squiggly movement for special alien bullets
            if (this.type === 'squiggly') {
                this.squigglyPhase += 0.3;
                this.squigglyOffset = Math.sin(this.squigglyPhase) * 3;
            }
        }

        // Check if out of bounds
        if (this.y < 0 || this.y > CANVAS.HEIGHT) {
            this.isActive = false;
        }
    }

    draw(ctx) {
        if (!this.isActive) return;

        ctx.fillStyle = this.isPlayerBullet ? COLORS.PLAYER_BULLET : COLORS.ALIEN_BULLET;

        if (this.type === 'squiggly') {
            // Draw squiggly bullet pattern
            const drawX = this.x + this.squigglyOffset;
            for (let i = 0; i < 3; i++) {
                const offset = Math.sin(this.squigglyPhase + i * 1.5) * 2;
                ctx.fillRect(drawX + offset, this.y + i * 7, 3, 6);
            }
        } else {
            // Draw straight bullet
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    getBounds() {
        return {
            x: this.x + (this.type === 'squiggly' ? this.squigglyOffset : 0),
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    destroy() {
        this.isActive = false;
    }
}

export class ProjectileManager {
    constructor() {
        this.playerBullet = null;
        this.alienBullets = [];
        this.maxAlienBullets = 3;
    }

    reset() {
        this.playerBullet = null;
        this.alienBullets = [];
    }

    canPlayerShoot() {
        return this.playerBullet === null || !this.playerBullet.isActive;
    }

    firePlayerBullet(x, y) {
        if (!this.canPlayerShoot()) return false;

        this.playerBullet = new Projectile(
            x - PLAYER.BULLET_WIDTH / 2,
            y,
            PLAYER.BULLET_SPEED,
            PLAYER.BULLET_WIDTH,
            PLAYER.BULLET_HEIGHT,
            true,
            'straight'
        );
        return true;
    }

    fireAlienBullet(x, y) {
        // Clean up inactive bullets
        this.alienBullets = this.alienBullets.filter(b => b.isActive);

        if (this.alienBullets.length >= this.maxAlienBullets) return false;

        // Randomly choose bullet type
        const types = ['straightSlow', 'straightFast', 'squiggly'];
        const type = types[Math.floor(Math.random() * types.length)];

        let bulletConfig;
        let bulletType = 'straight';

        switch (type) {
            case 'straightSlow':
                bulletConfig = ALIEN_BULLETS.STRAIGHT_SLOW;
                break;
            case 'straightFast':
                bulletConfig = ALIEN_BULLETS.STRAIGHT_FAST;
                break;
            case 'squiggly':
                bulletConfig = ALIEN_BULLETS.SQUIGGLY;
                bulletType = 'squiggly';
                break;
            default:
                bulletConfig = ALIEN_BULLETS.STRAIGHT_SLOW;
        }

        const bullet = new Projectile(
            x - bulletConfig.width / 2,
            y,
            bulletConfig.speed,
            bulletConfig.width,
            bulletConfig.height,
            false,
            bulletType
        );

        this.alienBullets.push(bullet);
        return true;
    }

    update() {
        // Update player bullet
        if (this.playerBullet && this.playerBullet.isActive) {
            this.playerBullet.update();
        } else {
            this.playerBullet = null;
        }

        // Update alien bullets
        this.alienBullets.forEach(bullet => bullet.update());
        this.alienBullets = this.alienBullets.filter(b => b.isActive);
    }

    draw(ctx) {
        // Draw player bullet
        if (this.playerBullet && this.playerBullet.isActive) {
            this.playerBullet.draw(ctx);
        }

        // Draw alien bullets
        this.alienBullets.forEach(bullet => bullet.draw(ctx));
    }

    getPlayerBullet() {
        return this.playerBullet && this.playerBullet.isActive ? this.playerBullet : null;
    }

    getAlienBullets() {
        return this.alienBullets.filter(b => b.isActive);
    }

    destroyPlayerBullet() {
        if (this.playerBullet) {
            this.playerBullet.destroy();
            this.playerBullet = null;
        }
    }
}
