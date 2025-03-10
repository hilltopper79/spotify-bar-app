const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Login route - redirect to Spotify auth
app.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read'
  ];
  
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Callback route after Spotify auth
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];
    
    // Redirect to frontend with tokens in URL params
    res.redirect(`/?access_token=${accessToken}&refresh_token=${refreshToken}&expires_in=${expiresIn}`);
    
  } catch (err) {
    console.error('Error getting tokens:', err);
    res.redirect('/?error=auth_failed');
  }
});

// Refresh token route
app.post('/refresh_token', async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  
  // Set the refresh token
  spotifyApi.setRefreshToken(refresh_token);
  
  try {
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body['access_token'];
    const expiresIn = data.body['expires_in'];
    
    res.json({
      access_token: accessToken,
      expires_in: expiresIn
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// User profile route - example of protected route
app.get('/api/user-profile', async (req, res) => {
  const { access_token } = req.query;
  
  if (!access_token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  // Set the access token
  spotifyApi.setAccessToken(access_token);
  
  try {
    const data = await spotifyApi.getMe();
    res.json(data.body);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user's top tracks
app.get('/api/top-tracks', async (req, res) => {
  const { access_token } = req.query;
  
  if (!access_token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  // Set the access token
  spotifyApi.setAccessToken(access_token);
  
  try {
    const data = await spotifyApi.getMyTopTracks({
      limit: 10,
      time_range: 'medium_term' // medium_term = approximately last 6 months
    });
    res.json(data.body.items);
  } catch (err) {
    console.error('Error fetching top tracks:', err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// Get user's top artists
app.get('/api/top-artists', async (req, res) => {
  const { access_token } = req.query;
  
  if (!access_token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  // Set the access token
  spotifyApi.setAccessToken(access_token);
  
  try {
    const data = await spotifyApi.getMyTopArtists({
      limit: 10,
      time_range: 'medium_term'
    });
    res.json(data.body.items);
  } catch (err) {
    console.error('Error fetching top artists:', err);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});