// Local, in-memory high scores array to simulate a database offline
let localScores = [
  { id: 1, playerName: 'SpeedRunner99', score: 1420 },
  { id: 2, playerName: 'PixelKing', score: 1150 },
  { id: 3, playerName: 'ShadowJump', score: 980 }
];

export const gameService = {
  // Simulate POST request locally
  async submitHighScore(playerName, score) {
    try {
      console.log('Axios POST (Simulated): Sending score data to server...');
      
      const newEntry = {
        id: localScores.length + 1,
        playerName: playerName,
        score: score
      };
      
      // Save it to our local array state
      localScores.unshift(newEntry); 
      
      console.log('Score saved locally:', newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error submitting high score:', error);
      throw error;
    }
  },

  // Simulate GET request locally
  async fetchHighScores() {
    try {
      console.log('Axios GET (Simulated): Fetching leaderboard array...');
      
      // Return the top 5 scores from our local memory bank
      return localScores.slice(0, 5);
    } catch (error) {
      console.error('Error fetching high scores:', error);
      throw error;
    }
  }
};
