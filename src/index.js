// src/index.js
async function initializeGame() {
    // Get the Spotify access token
    const accessToken = localStorage.getItem('spotify_access_token');
    
    // Initialize with empty Spotify data
    let spotifyData = {
        user: null,
        topTracks: null,
        topArtists: null,
        recommendations: null
    };
    
    // Try to fetch Spotify data
    try {
        spotifyData.user = await fetchUserProfile(accessToken);
        spotifyData.topTracks = await fetchTopTracks(accessToken);
        spotifyData.topArtists = await fetchTopArtists(accessToken);
        // We'll fetch recommendations in the Bar2Scene to keep the initial load faster
        
        console.log('Spotify data loaded:', spotifyData);
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
    }
    
    // Configuration for our Phaser game
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
        scene: [
            BootScene,
            PreloadScene,
            MainMenuScene,
            StreetScene,
            Bar1Scene,
            Bar2Scene,
            LoadingScene
        ]
    };
    
    // Initialize the game
    const game = new Phaser.Game(config);
    
    // Pass data to the boot scene
    game.registry.set('spotifyData', spotifyData);
    
    return game;
}