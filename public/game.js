// MainScene - Title Screen
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.spotifyData = null;
    }

    init(data) {
        // Receive any data passed from other scenes
        this.spotifyData = data.spotifyData || null;
    }

    preload() {
        // Placeholder for assets - in a real game, you would create these files
        this.load.image('logo', 'https://placehold.co/200x100/1DB954/FFFFFF/png?text=Music+Game');
        this.load.image('button', 'https://placehold.co/200x50/1DB954/FFFFFF/png?text=Button');
    }

    create() {
        // Create a title screen with Spotify green background
        this.add.rectangle(0, 0, 800, 600, 0x1DB954).setOrigin(0);
        
        // Title text
        this.add.text(400, 100, 'Spotify Music Adventure', {
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // If we have Spotify data, show user info
        if (this.spotifyData) {
            this.add.text(
                400, 
                180, 
                `Welcome, ${this.spotifyData.display_name}!`, 
                { fontSize: '24px', color: '#FFFFFF' }
            ).setOrigin(0.5);
        }

        // Start game button
        const startButton = this.add.text(
            400,
            300,
            'Start Game',
            { fontSize: '24px', color: '#FFFFFF', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Click event for the button
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene', { spotifyData: this.spotifyData });
        });

        // Load Spotify data if not already loaded
        if (!this.spotifyData) {
            this.loadSpotifyData();
        }
    }

    async loadSpotifyData() {
        try {
            const accessToken = localStorage.getItem('spotify_access_token');
            const response = await fetch(`/api/user-profile?access_token=${accessToken}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            
            this.spotifyData = await response.json();
            
            // Update the welcome text
            this.add.text(
                400, 
                180, 
                `Welcome, ${this.spotifyData.display_name}!`, 
                { fontSize: '24px', color: '#FFFFFF' }
            ).setOrigin(0.5);
            
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
            this.add.text(
                400, 
                180, 
                'Error loading Spotify data', 
                { fontSize: '24px', color: '#FF0000' }
            ).setOrigin(0.5);
        }
    }
}

// GameScene - Main Gameplay
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.platforms = null;
        this.cursors = null;
        this.stars = null;
        this.score = 0;
        this.scoreText = null;
        this.spotifyData = null;
    }

    init(data) {
        // Receive the Spotify data from the main scene
        this.spotifyData = data.spotifyData || null;
    }

    preload() {
        // Load placeholder assets until you create your own
        this.load.image('sky', 'https://placehold.co/800x600/87CEEB/FFFFFF/png?text=Sky');
        this.load.image('ground', 'https://placehold.co/400x32/654321/FFFFFF/png?text=Platform');
        this.load.image('star', 'https://placehold.co/24x24/FFD700/FFFFFF/png?text=★');
        
        // Temporary player spritesheet (in a real game, you would create this)
        // For now, we'll just use a placeholder
        this.load.image('dude', 'https://placehold.co/32x48/FF0000/FFFFFF/png?text=Player');
    }

    create() {
        // Add sky background
        this.add.image(400, 300, 'sky');

        // Create platforms group (static physics)
        this.platforms = this.physics.add.staticGroup();
        
        // Create the ground
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        // Create some platforms
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // Create player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // Player animations simplified (since we're using a placeholder)
        // In a real game, you would use spritesheet animations
        
        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create stars to collect
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        
        // Overlap check for collecting stars
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        
        // Display Spotify info
        if (this.spotifyData) {
            this.add.text(16, 60, `Playing as: ${this.spotifyData.display_name}`, { 
                fontSize: '18px',
                fill: '#000'
            });
        }
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }
        
        // Jump when up arrow is pressed and player is on ground
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        
        // Update score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // When all stars are collected, create more
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
}

// Game initialization
function initializeGame() {
    // Game configuration
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: [MainScene, GameScene]
    };

    // Create the game instance
    const game = new Phaser.Game(config);
}

// Make the function available globally
window.initializeGame = initializeGame;