// Space Invaders - Renderer
import { CANVAS, COLORS, GAME } from './constants.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    }

    drawGame(gameState) {
        this.clear();

        // Draw color region lines (like original arcade overlay)
        this.drawColorRegions();

        // Draw game entities
        gameState.shieldManager.draw(this.ctx);
        gameState.alienFormation.draw(this.ctx);
        gameState.ufo.draw(this.ctx);
        gameState.player.draw(this.ctx);
        gameState.projectileManager.draw(this.ctx);

        // Draw UI
        this.drawUI(gameState);
    }

    drawColorRegions() {
        // Draw subtle separator lines like original colored overlays
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;

        // Top red region line
        this.ctx.beginPath();
        this.ctx.moveTo(0, 70);
        this.ctx.lineTo(CANVAS.WIDTH, 70);
        this.ctx.stroke();

        // Bottom green region line
        this.ctx.beginPath();
        this.ctx.moveTo(0, 680);
        this.ctx.lineTo(CANVAS.WIDTH, 680);
        this.ctx.stroke();
    }

    drawUI(gameState) {
        this.ctx.font = '24px "Courier New", monospace';

        // Score (top left)
        this.ctx.fillStyle = COLORS.SCORE;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SCORE`, 20, 30);
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.fillText(`${gameState.score.toString().padStart(4, '0')}`, 20, 55);

        // High Score (top center)
        this.ctx.fillStyle = COLORS.SCORE;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`HI-SCORE`, CANVAS.WIDTH / 2, 30);
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.fillText(`${gameState.highScore.toString().padStart(4, '0')}`, CANVAS.WIDTH / 2, 55);

        // Lives (bottom left)
        this.ctx.fillStyle = COLORS.PLAYER;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${gameState.lives}`, 20, CANVAS.HEIGHT - 20);

        // Draw life icons
        this.drawLivesIcons(gameState.lives);

        // Level indicator (bottom right)
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`LEVEL ${gameState.level}`, CANVAS.WIDTH - 20, CANVAS.HEIGHT - 20);
    }

    drawLivesIcons(lives) {
        const iconWidth = 30;
        const iconHeight = 18;
        const startX = 50;
        const y = CANVAS.HEIGHT - 32;

        this.ctx.fillStyle = COLORS.PLAYER;

        for (let i = 0; i < lives - 1 && i < 5; i++) {
            // Simplified player icon
            const x = startX + i * (iconWidth + 10);

            // Draw small cannon shape
            this.ctx.fillRect(x + 12, y, 6, 6);
            this.ctx.fillRect(x + 3, y + 6, 24, 6);
            this.ctx.fillRect(x, y + 12, 30, 6);
        }
    }

    drawMenu(highScore) {
        this.clear();

        // Title
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPACE INVADERS', CANVAS.WIDTH / 2, 200);

        // Subtitle
        this.ctx.font = '18px "Courier New", monospace';
        this.ctx.fillStyle = COLORS.PLAYER;
        this.ctx.fillText('A 1:1 CLONE OF THE 1978 CLASSIC', CANVAS.WIDTH / 2, 240);

        // Score table
        this.ctx.font = '20px "Courier New", monospace';
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.fillText('* SCORE ADVANCE TABLE *', CANVAS.WIDTH / 2, 320);

        this.ctx.textAlign = 'left';
        const tableX = CANVAS.WIDTH / 2 - 100;

        this.ctx.fillStyle = COLORS.UFO;
        this.ctx.fillText('=?= MYSTERY', tableX, 360);

        this.ctx.fillStyle = COLORS.ALIENS;
        this.ctx.fillText('👾  = 30 POINTS', tableX, 400);
        this.ctx.fillText('🦀 = 20 POINTS', tableX, 440);
        this.ctx.fillText('🐙 = 10 POINTS', tableX, 480);

        // High score
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = COLORS.SCORE;
        this.ctx.fillText(`HI-SCORE: ${highScore}`, CANVAS.WIDTH / 2, 540);

        // Start instruction
        this.ctx.fillStyle = COLORS.PLAYER;
        this.ctx.font = '24px "Courier New", monospace';

        // Blinking effect
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            this.ctx.fillText('PRESS ENTER OR SPACE TO START', CANVAS.WIDTH / 2, 620);
        }

        // Controls
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.fillText('← → or A D to move | SPACE to fire | P to pause', CANVAS.WIDTH / 2, 700);
    }

    drawPaused() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);

        this.ctx.font = '24px "Courier New", monospace';
        this.ctx.fillText('Press P to resume', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 50);
    }

    drawGameOver(score, highScore, isNewHighScore) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

        this.ctx.fillStyle = COLORS.UFO;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 - 60);

        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '28px "Courier New", monospace';
        this.ctx.fillText(`FINAL SCORE: ${score}`, CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);

        if (isNewHighScore) {
            this.ctx.fillStyle = COLORS.PLAYER;
            this.ctx.fillText('NEW HIGH SCORE!', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 40);
        }

        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '20px "Courier New", monospace';

        // Blinking effect
        if (Math.floor(Date.now() / 500) % 2 === 0) {
            this.ctx.fillText('PRESS ENTER TO PLAY AGAIN', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 100);
        }
    }

    drawLevelComplete(level) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

        this.ctx.fillStyle = COLORS.PLAYER;
        this.ctx.font = '48px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`LEVEL ${level} COMPLETE!`, CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);

        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = '24px "Courier New", monospace';
        this.ctx.fillText('Get ready for the next wave...', CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2 + 50);
    }
}
