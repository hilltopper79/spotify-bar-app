class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Load all game assets
        // Street assets
        this.load.image('street-bg', 'assets/street/background.png');
        this.load.image('street-fg', 'assets/street/foreground.png');
        this.load.image('bar1-entrance', 'assets/street/bar1-entrance.png');
        this.load.image('bar2-entrance', 'assets/street/bar2-entrance.png');
        
        // Bar assets
        this.load.image('bar1-bg', 'assets/bar1/background.png');
        this.load.image('bar2-bg', 'assets/bar2/background.png');
        
        // Player assets
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        
        // UI assets
        this.load.image('enter-sign', 'assets/ui/enter-sign.png');
        this.load.image('exit-button', 'assets/ui/exit-button.png');
    }

    create() {
        // Create animations
        this.createAnimations();
        
        // Go to main menu or authentication
        const accessToken = localStorage.getItem('spotify_access_token');
        if (accessToken) {
            this.scene.start('MainMenuScene');
        } else {
            // If no token, show login screen instead of starting game
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        }
    }
    
    createLoadingBar() {
        // Create a loading bar using Phaser's built-in loading events
    }
    
    createAnimations() {
        // Player walk animations
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });
    }
}