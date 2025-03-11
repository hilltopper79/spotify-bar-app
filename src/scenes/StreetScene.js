class StreetScene extends Phaser.Scene {
    constructor() {
        super('StreetScene');
        this.player = null;
        this.cursors = null;
        this.bar1EntranceZone = null;
        this.bar2EntranceZone = null;
    }
    
    init(data) {
        this.spotifyData = data.spotifyData || null;
        this.playerPosition = data.playerPosition || { x: 400, y: 500 };
    }

    create() {
        // Create parallax background
        this.createBackground();
        
        // Create player
        this.player = this.physics.add.sprite(
            this.playerPosition.x, 
            this.playerPosition.y, 
            'player'
        );
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        
        // Create ground
        this.createGround();
        
        // Create bar entrances
        this.createBarEntrances();
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Setup camera to follow player
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        // Add UI elements for instructions
        this.createUI();
    }
    
    update() {
        // Player movement
        this.handlePlayerMovement();
        
        // Check for bar entrance proximity
        this.checkBarProximity();
    }
    
    createBackground() {
        // Create parallax backgrounds for street scene
    }
    
    createGround() {
        // Create ground platform for player to walk on
    }
    
    createBarEntrances() {
        // Create bar entrance zones and visuals
        // Bar 1 entrance (Top Tracks)
        this.bar1EntranceZone = {
            x: 400,
            y: 500,
            width: 100,
            isPlayerInside: false,
            entranceSign: this.add.image(400, 450, 'enter-sign').setAlpha(0.3)
        };
        
        // Bar 2 entrance (Recommended Artists)
        this.bar2EntranceZone = {
            x: 1200,
            y: 500,
            width: 100,
            isPlayerInside: false,
            entranceSign: this.add.image(1200, 450, 'enter-sign').setAlpha(0.3)
        };
    }
    
    handlePlayerMovement() {
        // Handle left/right movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('walk-right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
        }
        
        // Allow jumping
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
    
    checkBarProximity() {
        // Check if player is near bar 1
        const isNearBar1 = Math.abs(this.player.x - this.bar1EntranceZone.x) < this.bar1EntranceZone.width/2;
        if (isNearBar1 && !this.bar1EntranceZone.isPlayerInside) {
            this.bar1EntranceZone.isPlayerInside = true;
            this.bar1EntranceZone.entranceSign.setAlpha(1);
            this.showEnterPrompt("Press ENTER to visit Top Tracks Bar");
            
            // Listen for enter key
            this.input.keyboard.once('keydown-ENTER', () => {
                this.enterBar('Bar1Scene');
            });
        } else if (!isNearBar1 && this.bar1EntranceZone.isPlayerInside) {
            this.bar1EntranceZone.isPlayerInside = false;
            this.bar1EntranceZone.entranceSign.setAlpha(0.3);
            this.hideEnterPrompt();
        }
        
        // Check if player is near bar 2
        const isNearBar2 = Math.abs(this.player.x - this.bar2EntranceZone.x) < this.bar2EntranceZone.width/2;
        if (isNearBar2 && !this.bar2EntranceZone.isPlayerInside) {
            this.bar2EntranceZone.isPlayerInside = true;
            this.bar2EntranceZone.entranceSign.setAlpha(1);
            this.showEnterPrompt("Press ENTER to visit Artist Recommendations");
            
            // Listen for enter key
            this.input.keyboard.once('keydown-ENTER', () => {
                this.enterBar('Bar2Scene');
            });
        } else if (!isNearBar2 && this.bar2EntranceZone.isPlayerInside) {
            this.bar2EntranceZone.isPlayerInside = false;
            this.bar2EntranceZone.entranceSign.setAlpha(0.3);
            this.hideEnterPrompt();
        }
    }
    
    showEnterPrompt(text) {
        // Show the enter prompt with given text
        this.enterPrompt = this.add.text(this.player.x, this.player.y - 50, text, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }
    
    hideEnterPrompt() {
        // Hide the enter prompt
        if (this.enterPrompt) {
            this.enterPrompt.destroy();
        }
    }
    
    enterBar(barScene) {
        // Store player position for when they exit the bar
        const playerPosition = { x: this.player.x, y: this.player.y };
        
        // Transition to the bar scene
        this.scene.start('LoadingScene', { 
            nextScene: barScene,
            spotifyData: this.spotifyData,
            playerPosition: playerPosition
        });
    }
}