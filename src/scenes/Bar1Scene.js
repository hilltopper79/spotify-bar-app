class Bar1Scene extends Phaser.Scene {
    constructor() {
        super('Bar1Scene');
    }
    
    init(data) {
        this.spotifyData = data.spotifyData || null;
        this.playerPosition = data.playerPosition || { x: 400, y: 500 };
    }
    
    create() {
        // Create bar background
        this.add.image(400, 300, 'bar1-bg');
        
        // Title for this bar
        this.add.text(400, 50, "YOUR TOP TRACKS", {
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Exit button
        const exitButton = this.add.image(750, 50, 'exit-button')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.exitBar());
            
        // Display Spotify data
        this.displayTopTracks();
    }
    
    displayTopTracks() {
        if (!this.spotifyData || !this.spotifyData.topTracks) {
            this.add.text(400, 300, "No track data available", {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);
            return;
        }
        
        const tracks = this.spotifyData.topTracks;
        
        // Create a container for layout
        const startY = 120;
        const spacing = 80;
        
        tracks.slice(0, 5).forEach((track, index) => {
            const y = startY + (index * spacing);
            
            // Track container (like a poster)
            const poster = this.add.rectangle(400, y, 700, 70, 0x000000, 0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => poster.setFillStyle(0x333333, 0.7))
                .on('pointerout', () => poster.setFillStyle(0x000000, 0.5));
                
            // Track number
            this.add.text(100, y, `#${index + 1}`, {
                fontSize: '24px',
                fill: '#1DB954',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Track name
            this.add.text(400, y - 15, track.name, {
                fontSize: '18px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Artist name
            const artistNames = track.artists.map(artist => artist.name).join(', ');
            this.add.text(400, y + 15, artistNames, {
                fontSize: '14px',
                fill: '#ccc'
            }).setOrigin(0.5);
        });
    }
    
    exitBar() {
        // Transition back to street scene
        this.scene.start('StreetScene', {
            spotifyData: this.spotifyData,
            playerPosition: this.playerPosition
        });
    }
}