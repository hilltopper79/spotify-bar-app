// src/services/spotifyService.js
async function fetchRecommendedArtists(accessToken) {
    try {
        // First get top artists to use as seeds
        const topArtistsResponse = await fetch(`/api/top-artists?access_token=${accessToken}`);
        
        if (!topArtistsResponse.ok) {
            throw new Error('Failed to fetch top artists');
        }
        
        const topArtists = await topArtistsResponse.json();
        
        // Get the IDs of top 3 artists to use as seeds
        const seedArtists = topArtists.slice(0, 3).map(artist => artist.id).join(',');
        
        // Now fetch recommendations based on these seeds
        const recommendationsResponse = await fetch(
            `/api/recommendations?seed_artists=${seedArtists}&access_token=${accessToken}`
        );
        
        if (!recommendationsResponse.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        
        return await recommendationsResponse.json();
    } catch (error) {
        console.error('Error fetching artist recommendations:', error);
        return [];
    }
}

// Export all the Spotify API methods
export default {
    fetchUserProfile,
    fetchTopTracks,
    fetchTopArtists,
    fetchRecommendedArtists
};