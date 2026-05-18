<template>
  <div class="leaderboard-container">
    <h2>🏆 Top High Scores</h2>
    <p v-if="loading">Loading leaderboard...</p>
    <ul v-else>
      <li v-for="entry in scores" :key="entry.id">
        <strong>{{ entry.playerName }}</strong>: {{ entry.score }} pts
      </li>
    </ul>
  </div>
</template>

<script>
import { gameService } from '../services/gameService';

export default {
  name: 'LeaderboardComponent',
  data() {
    return {
      scores: [],
      loading: true
    };
  },
  async created() {
    try {
      this.scores = await gameService.fetchHighScores();
    } catch (error) {
      console.error('Could not load leaderboard');
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.leaderboard-container {
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 20px;
}
</style>
