<template>
  <div id="app">
    <header class="app-header">
      <h1>🎮 Retro Jump Arcade</h1>
    </header>

    <main class="game-layout">
      <!-- Changed from <Jump /> to <JumpGame /> -->
      <JumpGame />
      <LeaderboardComponent />
    </main>
  </div>
</template>

<script>
import Jump from './jump.vue';
import LeaderboardComponent from './components/LeaderboardComponent.vue';

export default {
  name: 'App',
  components: {
    // Giving it a multi-word alias name tells ESLint it is safe to use
    JumpGame: Jump,
    LeaderboardComponent
  }
}
</script>

<style>
/* Base layout styles to look structured and centered */
body {
  background-color: #2c3e50;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
  padding: 20px;
}

.app-header h1 {
  margin-bottom: 30px;
  color: #42b983;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.game-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
