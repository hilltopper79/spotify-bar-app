class Bar2Scene extends Phaser.Scene {
    constructor() {
        super('Bar2Scene');
    }
    
    init(data) {
        this.spotifyData = data.spotifyData || null;
        this.playerPosition = data.playerPosition || { x: 400, y: 500 };
    }
    
    create() {
        // Create bar background
        this.add.image(400, 300, 'bar2-bg');
        
        // Title for this bar
        this.add.text(400, 50, "ARTIST RECOMMENDATIONS", {
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Exit button
        const exitButton = this.add.image(750, 50, 'exit-button')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.exitBar());
            
        // In a real implementation, you'd fetch recommendations
        // based on the user's top artists
        this.displayArtistRecommendations();
    }
    
    displayArtistRecommendations() {
        // For the prototype, we'll just display top artists
        // In a real implementation, you'd call the Spotify API
        if (!this.spotifyData || !this.spotifyData.topArtists) {
            this.add.text(400, 300, "No artist data available", {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);
            return;
        }
        
        const artists = this.spotifyData.topArtists;
        
        // Create a grid layout for artists like record covers
        const startX = 150;
        const startY = 150;
        const spacing = 150;
        const itemsPerRow = 3;
        
        artists.slice(0, 6).forEach((artist, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            
            const x = startX + (col * spacing);
            const y = startY + (row * spacing);
            
            // Artist "record" container
            const record = this.add.circle(x, y, 60, 0x000000)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => record.setFillStyle(0x333333))
                .on('pointerout', () => record.setFillStyle(0x000000));
                
            // Inner record circle
            this.add.circle(x, y, 20, 0x1DB954);
            
            // Artist name below record
            this.add.text(x, y + 70, artist.name, {
                fontSize: '16px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Genres
            if (artist.genres && artist.genres.length > 0) {
                this.add.text(x, y + 90, artist.genres.slice(0, 2).join(', '), {
                    fontSize: '12px',
                    fill: '#ccc'
                }).setOrigin(0.5);
            }
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