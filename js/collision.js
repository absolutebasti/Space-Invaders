// Space Invaders - Collision Detection
export class CollisionDetector {
    // Simple AABB (Axis-Aligned Bounding Box) collision
    static checkAABB(a, b) {
        if (!a || !b) return false;
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // Check player bullet vs aliens
    static checkPlayerBulletVsAliens(bullet, alienFormation) {
        if (!bullet) return null;

        const bulletBounds = bullet.getBounds();
        const aliens = alienFormation.getReallyAliveAliens();

        for (const alien of aliens) {
            if (this.checkAABB(bulletBounds, alien.getBounds())) {
                return alien;
            }
        }

        return null;
    }

    // Check player bullet vs UFO
    static checkPlayerBulletVsUFO(bullet, ufo) {
        if (!bullet) return false;

        const ufoBounds = ufo.getBounds();
        if (!ufoBounds) return false;

        return this.checkAABB(bullet.getBounds(), ufoBounds);
    }

    // Check player bullet vs shields
    static checkPlayerBulletVsShields(bullet, shieldManager) {
        if (!bullet) return false;
        return shieldManager.checkBulletCollision(bullet);
    }

    // Check alien bullets vs player
    static checkAlienBulletsVsPlayer(alienBullets, player) {
        if (!player.isAlive || player.isExploding) return null;

        const playerBounds = player.getBounds();

        for (const bullet of alienBullets) {
            if (this.checkAABB(bullet.getBounds(), playerBounds)) {
                return bullet;
            }
        }

        return null;
    }

    // Check alien bullets vs shields
    static checkAlienBulletsVsShields(alienBullets, shieldManager) {
        const hitBullets = [];

        for (const bullet of alienBullets) {
            if (shieldManager.checkBulletCollision(bullet)) {
                hitBullets.push(bullet);
            }
        }

        return hitBullets;
    }

    // Check aliens vs shields (when aliens descend)
    static checkAliensVsShields(alienFormation, shieldManager) {
        const aliens = alienFormation.getReallyAliveAliens();

        for (const alien of aliens) {
            shieldManager.checkAlienCollision(alien.getBounds());
        }
    }

    // Check if aliens reached the player line
    static checkAliensReachedBottom(alienFormation, playerY) {
        const aliens = alienFormation.getReallyAliveAliens();

        for (const alien of aliens) {
            if (alien.y + alien.height >= playerY) {
                return true;
            }
        }

        return false;
    }
}
