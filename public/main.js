// Create the main.js file in the public folder
// public/main.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const loginContainer = document.getElementById('login-container');
    const gameContainer = document.getElementById('game-container');
    
    // Check if we have tokens in the URL (from redirect)
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    
    // If we have tokens, save them and clear the URL
    if (accessToken && refreshToken) {
        // Save tokens to localStorage
        saveTokens(accessToken, refreshToken, expiresIn);
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
        
        // Show game, hide login
        handleSuccessfulLogin();
    } else {
        // Check if we have tokens in localStorage
        const savedToken = localStorage.getItem('spotify_access_token');
        const tokenExpiration = localStorage.getItem('spotify_token_expiration');
        
        if (savedToken && tokenExpiration && new Date().getTime() < parseInt(tokenExpiration)) {
            // Token exists and is not expired
            handleSuccessfulLogin();
        } else if (localStorage.getItem('spotify_refresh_token')) {
            // We have a refresh token, try to get new access token
            refreshAccessToken();
        } else {
            // No tokens, show login
            showLoginScreen();
        }
    }
    
    // Login button event listener
    loginButton.addEventListener('click', () => {
        window.location.href = '/login';
    });
    
    // Functions
    
    function saveTokens(accessToken, refreshToken, expiresIn) {
        const expirationTime = new Date().getTime() + (expiresIn * 1000);
        
        localStorage.setItem('spotify_access_token', accessToken);
        localStorage.setItem('spotify_refresh_token', refreshToken);
        localStorage.setItem('spotify_token_expiration', expirationTime);
    }
    
    function handleSuccessfulLogin() {
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        
        // Load the game after successful login
        loadGame();
        
        // Fetch and display user profile as an example
        fetchUserProfile();
    }
    
    function showLoginScreen() {
        loginContainer.style.display = 'block';
        gameContainer.style.display = 'none';
    }
    
    async function refreshAccessToken() {
        try {
            const refreshToken = localStorage.getItem('spotify_refresh_token');
            
            const response = await fetch('/refresh_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            
            const data = await response.json();
            
            // Update stored token and expiration
            const expirationTime = new Date().getTime() + (data.expires_in * 1000);
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_token_expiration', expirationTime);
            
            // Show game now that we have a valid token
            handleSuccessfulLogin();
            
        } catch (error) {
            console.error('Error refreshing token:', error);
            // If refresh fails, go back to login screen
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_expiration');
            showLoginScreen();
        }
    }
    
    async function fetchUserProfile() {
        try {
            const accessToken = localStorage.getItem('spotify_access_token');
            const response = await fetch(`/api/user-profile?access_token=${accessToken}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            
            const userData = await response.json();
            console.log('User Profile:', userData);
            
            // You can use this data to personalize the game
            // For example, display user name or profile image
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
    
    function loadGame() {
        // Initialize the Phaser game
        console.log('Loading game...');
        
        // Call the initialization function from src/index.js
        if (typeof window.initializeGame === 'function') {
            window.initializeGame()
                .then(game => {
                    console.log('Game initialized successfully');
                })
                .catch(error => {
                    console.error('Error initializing game:', error);
                });
        } else {
            console.error('Game initialization function not found!');
        }
    }
});