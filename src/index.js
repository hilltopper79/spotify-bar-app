// src/index.js - Game initialization file

async function initializeGame() {
    // Get the Spotify access token
    const accessToken = localStorage.getItem('spotify_access_token');
    
    // Initialize with empty Spotify data
    let spotifyData = {
        user: null,
        topTracks: null,
        topArtists: null
    };
    
    // Try to fetch Spotify data
    try {
        spotifyData.user = await fetchUserProfile(accessToken);
        spotifyData.topTracks = await fetchTopTracks(accessToken);
        spotifyData.topArtists = await fetchTopArtists(accessToken);
        
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
            MainScene,
            GameScene
        ]
    };
    
    // Initialize the game
    const game = new Phaser.Game(config);
    
    // Start with the main scene and pass in Spotify data
    game.scene.start('MainScene', { spotifyData });
    
    return game;
}

// Helper functions to fetch Spotify data

async function fetchUserProfile(accessToken) {
    const response = await fetch(`/api/user-profile?access_token=${accessToken}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    
    return await response.json();
}

async function fetchTopTracks(accessToken) {
    try {
        const response = await fetch(`/api/top-tracks?access_token=${accessToken}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch top tracks');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        // Fallback to mock data if API fails
        return [
            {
                name: "Bohemian Rhapsody",
                artists: [{ name: "Queen" }],
                album: { name: "A Night at the Opera" }
            },
            {
                name: "Billie Jean",
                artists: [{ name: "Michael Jackson" }],
                album: { name: "Thriller" }
            }
        ];
    }
}

async function fetchTopArtists(accessToken) {
    try {
        const response = await fetch(`/api/top-artists?access_token=${accessToken}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch top artists');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching top artists:', error);
        // Fallback to mock data if API fails
        return [
            { name: "Queen", genres: ["rock", "classic rock"] },
            { name: "Michael Jackson", genres: ["pop", "dance pop"] }
        ];
    }
}

// Export the function (for when we set up a build system)
// For now, we'll call this from main.js
window.initializeGame = initializeGame;