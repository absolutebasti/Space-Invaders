// Space Invaders - Main Entry Point
import { CANVAS, KEYS, STATES } from './constants.js';
import { GameState } from './game.js';
import { Renderer } from './renderer.js';
import { audioManager } from './audio.js';

class SpaceInvaders {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = null;
        this.renderer = null;
        this.lastTime = 0;
        this.isRunning = false;
    }

    init() {
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }

        this.canvas.width = CANVAS.WIDTH;
        this.canvas.height = CANVAS.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        // Initialize game state and renderer
        this.gameState = new GameState();
        this.gameState.init();
        this.renderer = new Renderer(this.ctx);

        // Set up input handlers
        this.setupInput();

        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));

        console.log('Space Invaders initialized!');
    }

    setupInput() {
        // Keyboard down
        document.addEventListener('keydown', (e) => {
            // Handle movement
            if (KEYS.LEFT.includes(e.code)) {
                e.preventDefault();
                this.gameState.player.setMoving('left', true);
            }
            if (KEYS.RIGHT.includes(e.code)) {
                e.preventDefault();
                this.gameState.player.setMoving('right', true);
            }

            // Handle fire
            if (KEYS.FIRE.includes(e.code)) {
                e.preventDefault();
                if (this.gameState.state === STATES.MENU ||
                    this.gameState.state === STATES.GAME_OVER) {
                    this.gameState.handleStartInput();
                } else {
                    this.gameState.firePlayerBullet();
                }
            }

            // Handle pause
            if (KEYS.PAUSE.includes(e.code)) {
                e.preventDefault();
                this.gameState.togglePause();
            }

            // Handle start
            if (KEYS.START.includes(e.code) && !KEYS.FIRE.includes(e.code)) {
                e.preventDefault();
                this.gameState.handleStartInput();
            }
        });

        // Keyboard up
        document.addEventListener('keyup', (e) => {
            if (KEYS.LEFT.includes(e.code)) {
                this.gameState.player.setMoving('left', false);
            }
            if (KEYS.RIGHT.includes(e.code)) {
                this.gameState.player.setMoving('right', false);
            }
        });

        // Initialize audio on first interaction
        document.addEventListener('click', () => {
            audioManager.init();
            audioManager.resume();
        }, { once: true });

        document.addEventListener('keydown', () => {
            audioManager.init();
            audioManager.resume();
        }, { once: true });
    }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time (capped at 100ms to prevent huge jumps)
        const deltaTime = Math.min(currentTime - this.lastTime, 100);
        this.lastTime = currentTime;

        // Update game state
        this.gameState.update(deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    render() {
        switch (this.gameState.state) {
            case STATES.MENU:
                this.renderer.drawMenu(this.gameState.highScore);
                break;

            case STATES.PLAYING:
                this.renderer.drawGame(this.gameState);
                break;

            case STATES.PAUSED:
                this.renderer.drawGame(this.gameState);
                this.renderer.drawPaused();
                break;

            case STATES.LEVEL_COMPLETE:
                this.renderer.drawGame(this.gameState);
                this.renderer.drawLevelComplete(this.gameState.level);
                break;

            case STATES.GAME_OVER:
                this.renderer.drawGame(this.gameState);
                this.renderer.drawGameOver(
                    this.gameState.score,
                    this.gameState.highScore,
                    this.gameState.isNewHighScore
                );
                break;
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new SpaceInvaders();
    game.init();
});
