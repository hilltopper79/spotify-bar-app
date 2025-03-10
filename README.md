# Spotify Phaser Game

A web application that combines Phaser.js for game development with Spotify API integration.

## Features

- Spotify authentication using OAuth 2.0
- Integration with Spotify Web API to fetch user data
- Side-scrolling game built with Phaser.js
- Personalized game experience based on user's music preferences

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Spotify Developer account

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd spotify-phaser-app-og
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:8000/callback
   PORT=8000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8000`

### Spotify Developer Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Set the Redirect URI to `http://localhost:8000/callback`
4. Copy your Client ID and Client Secret to the `.env` file

## Project Structure

- `/public` - Static assets and compiled code served to the browser
- `/src` - Source code for the game
  - `/scenes` - Phaser game scenes
  - `/assets` - Game assets (images, sounds, etc.)
- `/server` - Backend Express server code

## Development

To start the development server with hot reloading:

```
npm run dev
```

## Deployment

For production deployment, build the project and start the server:

```
npm start
```

## Technologies Used

- [Phaser.js](https://phaser.io/) - HTML5 game framework
- [Express](https://expressjs.com/) - Web server framework
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Spotify API integration
- [OAuth 2.0](https://oauth.net/2/) - Authentication protocol

## License

ISC