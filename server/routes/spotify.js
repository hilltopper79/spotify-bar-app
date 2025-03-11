// server/routes/spotify.js
// Get recommendations based on user's top artists
app.get('/api/recommendations', async (req, res) => {
    const { access_token, seed_artists } = req.query;
    
    if (!access_token) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    if (!seed_artists) {
      return res.status(400).json({ error: 'Seed artists are required' });
    }
    
    // Set the access token
    spotifyApi.setAccessToken(access_token);
    
    try {
      const data = await spotifyApi.getRecommendations({
        seed_artists: seed_artists.split(','),
        limit: 10
      });
      res.json(data.body.tracks);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });