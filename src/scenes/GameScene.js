// src/scenes/GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player = null;
        this.platforms = null;
        this.cursors = null;
        this.stars = null;
        this.score = 0;
        this.scoreText = null;
        this.spotifyData = null;
        
        // Music and playlist related properties
        this.currentTrack = null;
        this.trackInfo = null;
    }

    init(data) {
        // Data passed from MainScene
        this.spotifyData = data.spotifyData || null;
    }

    preload() {
        // Load game assets
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { 
            frameWidth: 32, 
            frameHeight: 48 
        });
        
        // If we have Spotify data, we might want to load custom assets
        // based on the user's favorite genres or artists
        if (this.spotifyData && this.spotifyData.topArtists) {
            // Example: You could change game assets based on music genre
            console.log('User likes these artists:', this.spotifyData.topArtists);
        }
    }

    create() {
        // Add game background
        this.add.image(400, 300, 'sky');
        
        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        
        // Create player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // Player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Set up colliders
        this.physics.add.collider(this.player, this.platforms);
        
        // Cursors for movement
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add some stars to collect
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        
        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#000' 
        });
        
        // Display Spotify info if available
        if (this.spotifyData && this.spotifyData.user) {
            this.displaySpotifyInfo();
        }
        
        // Back button
        const backButton = this.add.text(this.cameras.main.width - 20, 20, 'Back to Menu', {
            font: '16px Arial',
            fill: '#fff',
            backgroundColor: '#000000',
            padding: {
                x: 10,
                y: 5
            }
        })
        .setOrigin(1, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MainScene', { spotifyData: this.spotifyData });
        });
    }

    update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
        
        // Update Spotify track info if playing
        if (this.trackInfo) {
            // In a real implementation, you'd update track progress, etc.
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        
        // Update score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // If all stars are collected, reset them
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }

    displaySpotifyInfo() {
        // Add a container for Spotify info
        const infoBox = this.add.rectangle(this.cameras.main.width - 150, 100, 250, 150, 0x000000, 0.7)
            .setOrigin(1, 0);
            
        this.add.text(infoBox.x - 125, infoBox.y + 10, 'Spotify Profile', {
            font: '18px Arial',
            fill: '#1DB954'
        });
        
        this.add.text(infoBox.x - 125, infoBox.y + 40, `User: ${this.spotifyData.user.display_name}`, {
            font: '14px Arial',
            fill: '#ffffff'
        });
        
        // If we have top tracks, display one
        if (this.spotifyData.topTracks && this.spotifyData.topTracks.length > 0) {
            const track = this.spotifyData.topTracks[0];
            this.add.text(infoBox.x - 125, infoBox.y + 70, 'Top Track:', {
                font: '14px Arial',
                fill: '#ffffff'
            });
            
            this.add.text(infoBox.x - 125, infoBox.y + 90, track.name, {
                font: '14px Arial',
                fill: '#1DB954'
            });
            
            this.add.text(infoBox.x - 125, infoBox.y + 110, track.artists[0].name, {
                font: '12px Arial',
                fill: '#ffffff'
            });
        }
    }
}

// Add to the global scope for now (this would be properly handled by a module bundler later)
window.GameScene = GameScene;