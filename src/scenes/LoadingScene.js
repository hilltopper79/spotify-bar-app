class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }
    
    init(data) {
        this.nextScene = data.nextScene;
        this.spotifyData = data.spotifyData;
        this.playerPosition = data.playerPosition;
    }
    
    create() {
        // Display a loading message
        const loadingText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'Opening door...', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5);
        
        // Create a loading animation
        this.tweens.add({
            targets: loadingText,
            alpha: 0.2,
            duration: 500,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                // Move to the next scene
                this.scene.start(this.nextScene, {
                    spotifyData: this.spotifyData,
                    playerPosition: this.playerPosition
                });
            }
        });
    }
}