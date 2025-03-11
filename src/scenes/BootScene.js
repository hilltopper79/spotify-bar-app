class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load minimal assets needed for loading screen
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('loading-bar', 'assets/ui/loading-bar.png');
    }

    create() {
        this.scene.start('PreloadScene');
    }
}