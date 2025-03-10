// src/scenes/MainScene.js
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.spotifyData = null;
    }

    init(data) {
        // Data passed from other scenes or game initialization
        this.spotifyData = data.spotifyData || null;
    }

    preload() {
        // Load assets needed for main menu
        this.load.image('logo', 'assets/logo.png');
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Add background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x1DB954).setOrigin(0);
        
        // Add title
        this.add.text(this.cameras.main.centerX, 100, 'Spotify Music Runner', {
            font: '36px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add profile info if we have Spotify data
        if (this.spotifyData && this.spotifyData.user) {
            const user = this.spotifyData.user;
            this.add.text(this.cameras.main.centerX, 170, `Welcome, ${user.display_name}!`, {
                font: '24px Arial',
                fill: '#ffffff'
            }).setOrigin(0.5);

            // Display profile image if available
            if (user.images && user.images.length > 0) {
                // In a real implementation, you'd load this image in the preload phase
                console.log('User has profile image:', user.images[0].url);
            }
        }

        // Create start game button
        const startButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'button')
            .setScale(2)
            .setInteractive({ useHandCursor: true });
            
        this.add.text(startButton.x, startButton.y, 'Start Game', {
            font: '24px Arial',
            fill: '#000000'
        }).setOrigin(0.5);

        // Button interactions
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene', { spotifyData: this.spotifyData });
        });

        startButton.on('pointerover', () => {
            startButton.setTint(0xdddddd);
        });

        startButton.on('pointerout', () => {
            startButton.clearTint();
        });

        // Add some text about Spotify integration
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, 
            'Your game experience will be customized based on your Spotify preferences!', {
            font: '16px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
    }
}

// Add to the global scope for now (this would be properly handled by a module bundler later)
window.MainScene = MainScene;