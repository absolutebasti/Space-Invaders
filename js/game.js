// Space Invaders - Game State Manager
import { STATES, GAME, PLAYER } from './constants.js';
import { Player } from './player.js';
import { AlienFormation } from './aliens.js';
import { MysteryUFO } from './ufo.js';
import { ShieldManager } from './shields.js';
import { ProjectileManager } from './projectiles.js';
import { CollisionDetector } from './collision.js';
import { audioManager } from './audio.js';

export class GameState {
    constructor() {
        this.state = STATES.MENU;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.lives = GAME.INITIAL_LIVES;
        this.level = 1;
        this.isNewHighScore = false;
        this.extraLifeAwarded = false;
        this.levelCompleteTimer = 0;
        this.gameOverTimer = 0;

        // Game entities
        this.player = new Player();
        this.alienFormation = new AlienFormation();
        this.ufo = new MysteryUFO();
        this.shieldManager = new ShieldManager();
        this.projectileManager = new ProjectileManager();
    }

    init() {
        this.alienFormation.init();
        this.shieldManager.init();
    }

    reset() {
        this.score = 0;
        this.lives = GAME.INITIAL_LIVES;
        this.level = 1;
        this.isNewHighScore = false;
        this.extraLifeAwarded = false;
        this.levelCompleteTimer = 0;
        this.gameOverTimer = 0;

        this.player.reset();
        this.alienFormation.init();
        this.ufo.reset();
        this.ufo.shotCount = 0;
        this.shieldManager.init();
        this.projectileManager.reset();
    }

    startGame() {
        audioManager.init();
        audioManager.resume();
        this.reset();
        this.state = STATES.PLAYING;
        this.updateMarchSound();
    }

    update(deltaTime) {
        switch (this.state) {
            case STATES.MENU:
                // Menu animations handled in renderer
                break;

            case STATES.PLAYING:
                this.updatePlaying(deltaTime);
                break;

            case STATES.PAUSED:
                // Nothing to update
                break;

            case STATES.LEVEL_COMPLETE:
                this.levelCompleteTimer += deltaTime;
                if (this.levelCompleteTimer >= 2000) {
                    this.nextLevel();
                }
                break;

            case STATES.GAME_OVER:
                this.gameOverTimer += deltaTime;
                // Allow restart after a short delay
                break;
        }
    }

    updatePlaying(deltaTime) {
        // Update player
        const playerStatus = this.player.update(deltaTime);

        if (playerStatus === 'exploded') {
            this.handlePlayerDeath();
        }

        // Update aliens
        const aliensReachedBottom = this.alienFormation.update(deltaTime, this.projectileManager);
        if (aliensReachedBottom) {
            this.gameOver();
            return;
        }

        // Update UFO
        this.ufo.update(deltaTime, audioManager);

        // Update projectiles
        this.projectileManager.update();

        // Check collisions
        this.checkCollisions();

        // Check for level complete
        if (this.alienFormation.isDefeated()) {
            this.state = STATES.LEVEL_COMPLETE;
            this.levelCompleteTimer = 0;
            audioManager.stopMarch();
        }

        // Check aliens vs shields
        CollisionDetector.checkAliensVsShields(this.alienFormation, this.shieldManager);

        // Update march sound speed
        this.updateMarchSound();

        // Check for extra life
        this.checkExtraLife();
    }

    checkCollisions() {
        const playerBullet = this.projectileManager.getPlayerBullet();
        const alienBullets = this.projectileManager.getAlienBullets();

        // Player bullet vs aliens
        if (playerBullet) {
            const hitAlien = CollisionDetector.checkPlayerBulletVsAliens(
                playerBullet,
                this.alienFormation
            );

            if (hitAlien) {
                const points = this.alienFormation.killAlien(hitAlien);
                this.addScore(points);
                this.projectileManager.destroyPlayerBullet();
                audioManager.playAlienExplosion();
            }

            // Player bullet vs UFO
            if (!hitAlien && CollisionDetector.checkPlayerBulletVsUFO(playerBullet, this.ufo)) {
                const points = this.ufo.hit(audioManager);
                this.addScore(points);
                this.projectileManager.destroyPlayerBullet();
                audioManager.playAlienExplosion();
            }

            // Player bullet vs shields
            if (!hitAlien && CollisionDetector.checkPlayerBulletVsShields(
                playerBullet,
                this.shieldManager
            )) {
                this.projectileManager.destroyPlayerBullet();
            }
        }

        // Alien bullets vs player
        const hitBullet = CollisionDetector.checkAlienBulletsVsPlayer(
            alienBullets,
            this.player
        );

        if (hitBullet) {
            hitBullet.destroy();
            if (this.player.die()) {
                audioManager.playPlayerExplosion();
            }
        }

        // Alien bullets vs shields
        const shieldHitBullets = CollisionDetector.checkAlienBulletsVsShields(
            alienBullets,
            this.shieldManager
        );

        shieldHitBullets.forEach(bullet => bullet.destroy());
    }

    handlePlayerDeath() {
        this.lives--;

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.player.respawn();
        }
    }

    addScore(points) {
        this.score += points;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.isNewHighScore = true;
            this.saveHighScore();
        }
    }

    checkExtraLife() {
        if (!this.extraLifeAwarded && this.score >= GAME.EXTRA_LIFE_SCORE) {
            this.lives++;
            this.extraLifeAwarded = true;
            audioManager.playExtraLife();
        }
    }

    nextLevel() {
        this.level++;
        this.alienFormation.init();
        this.shieldManager.reset();
        this.projectileManager.reset();
        this.player.reset();
        this.ufo.reset();
        this.state = STATES.PLAYING;
        this.updateMarchSound();
    }

    gameOver() {
        this.state = STATES.GAME_OVER;
        this.gameOverTimer = 0;
        audioManager.stopMarch();
        audioManager.playGameOver();
        this.saveHighScore();
    }

    togglePause() {
        if (this.state === STATES.PLAYING) {
            this.state = STATES.PAUSED;
            audioManager.stopMarch();
        } else if (this.state === STATES.PAUSED) {
            this.state = STATES.PLAYING;
            this.updateMarchSound();
        }
    }

    updateMarchSound() {
        if (this.state === STATES.PLAYING && this.alienFormation.getAlienCount() > 0) {
            const interval = this.alienFormation.getMarchInterval();
            audioManager.updateMarchSpeed(Math.max(100, interval));
        }
    }

    firePlayerBullet() {
        if (this.state !== STATES.PLAYING) return;
        if (!this.player.canShoot()) return;
        if (!this.projectileManager.canPlayerShoot()) return;

        const fired = this.projectileManager.firePlayerBullet(
            this.player.x + this.player.width / 2,
            this.player.y
        );

        if (fired) {
            this.ufo.incrementShotCount();
            audioManager.playShoot();
        }
    }

    handleStartInput() {
        if (this.state === STATES.MENU) {
            this.startGame();
        } else if (this.state === STATES.GAME_OVER && this.gameOverTimer >= 1000) {
            this.startGame();
        }
    }

    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('spaceInvadersHighScore')) || 0;
        } catch (e) {
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
        } catch (e) {
            // localStorage not available
        }
    }
}
