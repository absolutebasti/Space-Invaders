// Space Invaders - Game Constants
// All game configuration values in one place

export const CANVAS = {
    WIDTH: 672,           // 224 * 3 (scaled from original)
    HEIGHT: 768,          // 256 * 3 (scaled from original)
    SCALE: 3              // Scale factor from original resolution
};

export const COLORS = {
    BACKGROUND: '#000000',
    PLAYER: '#00FF00',           // Green for player area
    ALIENS: '#FFFFFF',           // White for aliens
    UFO: '#FF0000',              // Red for UFO
    SHIELD: '#00FF00',           // Green shields
    PLAYER_BULLET: '#FFFFFF',
    ALIEN_BULLET: '#FFFFFF',
    TEXT: '#FFFFFF',
    SCORE: '#FF0000'             // Red score area
};

export const PLAYER = {
    WIDTH: 39,            // 13 * 3
    HEIGHT: 24,           // 8 * 3
    SPEED: 4,
    Y_POSITION: 700,      // Fixed Y position near bottom
    START_X: 336,         // Center of screen
    BULLET_SPEED: 10,
    BULLET_WIDTH: 3,
    BULLET_HEIGHT: 12,
    RESPAWN_DELAY: 2000   // 2 seconds after death
};

export const ALIENS = {
    ROWS: 5,
    COLUMNS: 11,
    WIDTH: 36,            // 12 * 3
    HEIGHT: 24,           // 8 * 3
    PADDING_X: 48,        // Horizontal space between aliens
    PADDING_Y: 42,        // Vertical space between aliens
    START_X: 60,          // Starting X position
    START_Y: 150,         // Starting Y position
    DESCENT_AMOUNT: 24,   // Pixels to move down when hitting edge
    BASE_SPEED: 0.5,      // Base horizontal movement speed
    MAX_SPEED: 8,         // Maximum speed when few aliens remain
    ANIMATION_FRAMES: 2,  // Number of animation frames
    SHOOT_INTERVAL: 1000, // Base interval between alien shots (ms)
    MIN_SHOOT_INTERVAL: 300
};

export const ALIEN_TYPES = {
    SQUID: {
        row: 0,
        points: 30,
        width: 24,        // 8 * 3
        height: 24
    },
    CRAB: {
        rows: [1, 2],
        points: 20,
        width: 33,        // 11 * 3
        height: 24
    },
    OCTOPUS: {
        rows: [3, 4],
        points: 10,
        width: 36,        // 12 * 3
        height: 24
    }
};

export const ALIEN_BULLETS = {
    STRAIGHT_SLOW: { speed: 3, width: 3, height: 12 },
    STRAIGHT_FAST: { speed: 6, width: 3, height: 12 },
    SQUIGGLY: { speed: 4, width: 9, height: 21 }
};

export const UFO = {
    WIDTH: 48,            // 16 * 3
    HEIGHT: 21,           // 7 * 3
    SPEED: 2,
    Y_POSITION: 90,
    MIN_INTERVAL: 15000,  // Minimum time between UFO appearances
    MAX_INTERVAL: 30000,  // Maximum time between UFO appearances
    SCORES: [50, 100, 150, 300]
};

export const SHIELDS = {
    COUNT: 4,
    WIDTH: 66,            // 22 * 3
    HEIGHT: 48,           // 16 * 3
    Y_POSITION: 620,
    SPACING: 144          // Space between shields
};

export const GAME = {
    INITIAL_LIVES: 3,
    EXTRA_LIFE_SCORE: 1500,
    GAME_OVER_DELAY: 3000
};

export const KEYS = {
    LEFT: ['ArrowLeft', 'KeyA'],
    RIGHT: ['ArrowRight', 'KeyD'],
    FIRE: ['Space', 'ArrowUp', 'KeyW'],
    PAUSE: ['KeyP', 'Escape'],
    START: ['Enter', 'Space']
};

export const STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    LEVEL_COMPLETE: 'levelComplete'
};

// Sprite pixel data for rendering (each number represents pixel state: 0=empty, 1=filled)
export const SPRITES = {
    PLAYER: [
        [0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    SQUID: [
        // Frame 1
        [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,1,1,0,1,1],
            [1,1,1,1,1,1,1,1],
            [0,0,1,0,0,1,0,0],
            [0,1,0,1,1,0,1,0],
            [1,0,1,0,0,1,0,1]
        ],
        // Frame 2
        [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,1,1,0,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,0,1,1,0,1,0],
            [1,0,0,0,0,0,0,1],
            [0,1,0,0,0,0,1,0]
        ]
    ],
    CRAB: [
        // Frame 1
        [
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [0,0,0,1,1,0,1,1,0,0,0]
        ],
        // Frame 2
        [
            [0,0,1,0,0,0,0,0,1,0,0],
            [1,0,0,1,0,0,0,1,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,1,1,1,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,1,0,0,0,0,0,0,0,1,0]
        ]
    ],
    OCTOPUS: [
        // Frame 1
        [
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,1,1,0,0,1,1,0,0,0],
            [0,0,1,1,0,1,1,0,1,1,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,1]
        ],
        // Frame 2
        [
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,0,1,1,0,1,1,0,0],
            [0,1,1,0,0,0,0,0,0,1,1,0],
            [0,0,1,1,0,0,0,0,1,1,0,0]
        ]
    ],
    UFO: [
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0]
    ],
    EXPLOSION: [
        [0,0,1,0,0,0,1,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,0,0,1,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [1,0,0,0,1,1,1,1,1,0,0,0,1],
        [0,0,0,0,0,1,1,1,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,1,0,0,0,0,0,1,0,0,0],
        [0,0,1,0,0,0,1,0,0,0,1,0,0]
    ],
    SHIELD: [
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1]
    ]
};
