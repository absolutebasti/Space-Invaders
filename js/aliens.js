// Space Invaders - Aliens Module
import { CANVAS, ALIENS, ALIEN_TYPES, SPRITES, COLORS } from './constants.js';

class Alien {
    constructor(x, y, type, row, col) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.row = row;
        this.col = col;
        this.isAlive = true;
        this.animationFrame = 0;
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionDuration = 200;

        // Set dimensions and points based on type
        switch (type) {
            case 'squid':
                this.width = ALIEN_TYPES.SQUID.width;
                this.height = ALIEN_TYPES.SQUID.height;
                this.points = ALIEN_TYPES.SQUID.points;
                this.sprite = SPRITES.SQUID;
                break;
            case 'crab':
                this.width = ALIEN_TYPES.CRAB.width;
                this.height = ALIEN_TYPES.CRAB.height;
                this.points = ALIEN_TYPES.CRAB.points;
                this.sprite = SPRITES.CRAB;
                break;
            case 'octopus':
                this.width = ALIEN_TYPES.OCTOPUS.width;
                this.height = ALIEN_TYPES.OCTOPUS.height;
                this.points = ALIEN_TYPES.OCTOPUS.points;
                this.sprite = SPRITES.OCTOPUS;
                break;
        }
    }

    update(deltaTime) {
        if (this.isExploding) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionDuration) {
                this.isExploding = false;
                this.isAlive = false;
            }
        }
    }

    die() {
        this.isExploding = true;
        this.explosionTimer = 0;
    }

    draw(ctx) {
        if (!this.isAlive && !this.isExploding) return;

        if (this.isExploding) {
            this.drawExplosion(ctx);
            return;
        }

        const sprite = this.sprite[this.animationFrame];
        const pixelSize = 3;

        ctx.fillStyle = COLORS.ALIENS;

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

        ctx.fillStyle = COLORS.ALIENS;

        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                if (sprite[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize - 3,
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

    toggleAnimation() {
        this.animationFrame = this.animationFrame === 0 ? 1 : 0;
    }
}

export class AlienFormation {
    constructor() {
        this.aliens = [];
        this.direction = 1; // 1 = right, -1 = left
        this.speed = ALIENS.BASE_SPEED;
        this.moveTimer = 0;
        this.moveInterval = 1000; // Initial move interval in ms
        this.shootTimer = 0;
        this.shootInterval = ALIENS.SHOOT_INTERVAL;
        this.needsDescent = false;
        this.descendAmount = 0;
        this.totalAliens = ALIENS.ROWS * ALIENS.COLUMNS;
        this.initialAlienCount = this.totalAliens;
    }

    init() {
        this.aliens = [];
        this.direction = 1;
        this.speed = ALIENS.BASE_SPEED;
        this.moveTimer = 0;
        this.moveInterval = 1000;
        this.shootTimer = 0;
        this.shootInterval = ALIENS.SHOOT_INTERVAL;
        this.needsDescent = false;

        for (let row = 0; row < ALIENS.ROWS; row++) {
            for (let col = 0; col < ALIENS.COLUMNS; col++) {
                let type;
                if (row === 0) {
                    type = 'squid';
                } else if (row <= 2) {
                    type = 'crab';
                } else {
                    type = 'octopus';
                }

                const x = ALIENS.START_X + col * ALIENS.PADDING_X;
                const y = ALIENS.START_Y + row * ALIENS.PADDING_Y;

                this.aliens.push(new Alien(x, y, type, row, col));
            }
        }

        this.totalAliens = this.aliens.length;
        this.initialAlienCount = this.totalAliens;
    }

    reset() {
        this.init();
    }

    update(deltaTime, projectileManager) {
        // Update individual aliens (for explosions)
        this.aliens.forEach(alien => alien.update(deltaTime));

        // Remove dead aliens (after explosion animation)
        const aliveAliens = this.getAliveAliens();

        // Update speed based on remaining aliens
        this.updateSpeed();

        // Movement timing
        this.moveTimer += deltaTime;
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            this.move();
        }

        // Shooting
        this.shootTimer += deltaTime;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            this.shoot(projectileManager);
        }

        return this.checkBottomReached();
    }

    move() {
        const aliveAliens = this.getAliveAliens();
        if (aliveAliens.length === 0) return;

        // Check if we need to descend
        if (this.needsDescent) {
            aliveAliens.forEach(alien => {
                alien.y += ALIENS.DESCENT_AMOUNT;
            });
            this.direction *= -1;
            this.needsDescent = false;
        } else {
            // Move horizontally
            let hitEdge = false;
            const moveAmount = this.speed * this.direction * 10;

            aliveAliens.forEach(alien => {
                alien.x += moveAmount;

                // Check boundaries
                if (alien.x <= 10 || alien.x + alien.width >= CANVAS.WIDTH - 10) {
                    hitEdge = true;
                }
            });

            if (hitEdge) {
                this.needsDescent = true;
            }
        }

        // Toggle animation frames
        aliveAliens.forEach(alien => alien.toggleAnimation());
    }

    updateSpeed() {
        const aliveCount = this.getAliveAliens().length;
        if (aliveCount === 0) return;

        // Speed increases as aliens are destroyed
        const speedMultiplier = this.initialAlienCount / aliveCount;
        this.speed = Math.min(ALIENS.BASE_SPEED * speedMultiplier, ALIENS.MAX_SPEED);

        // Also decrease move interval
        this.moveInterval = Math.max(100, 1000 / speedMultiplier);

        // Increase shooting rate
        this.shootInterval = Math.max(
            ALIENS.MIN_SHOOT_INTERVAL,
            ALIENS.SHOOT_INTERVAL / (speedMultiplier * 0.5)
        );
    }

    shoot(projectileManager) {
        const aliveAliens = this.getAliveAliens();
        if (aliveAliens.length === 0) return;

        // Find bottom aliens in each column
        const bottomAliens = this.getBottomAliens();
        if (bottomAliens.length === 0) return;

        // Random alien shoots
        const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
        projectileManager.fireAlienBullet(
            shooter.x + shooter.width / 2,
            shooter.y + shooter.height
        );
    }

    getBottomAliens() {
        const aliveAliens = this.getAliveAliens();
        const columns = {};

        // Find the bottommost alien in each column
        aliveAliens.forEach(alien => {
            if (!columns[alien.col] || alien.row > columns[alien.col].row) {
                columns[alien.col] = alien;
            }
        });

        return Object.values(columns);
    }

    checkBottomReached() {
        const aliveAliens = this.getAliveAliens();
        for (const alien of aliveAliens) {
            if (alien.y + alien.height >= 620) { // Shield line
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        this.aliens.forEach(alien => alien.draw(ctx));
    }

    getAliveAliens() {
        return this.aliens.filter(a => a.isAlive || a.isExploding);
    }

    getReallyAliveAliens() {
        return this.aliens.filter(a => a.isAlive && !a.isExploding);
    }

    getAlienCount() {
        return this.getReallyAliveAliens().length;
    }

    isDefeated() {
        return this.getReallyAliveAliens().length === 0;
    }

    getMarchInterval() {
        return this.moveInterval;
    }

    killAlien(alien) {
        alien.die();
        return alien.points;
    }
}
