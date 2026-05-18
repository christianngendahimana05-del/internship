<!-- eslint-disable -->
<template>
  <div class="game-wrapper">
    <div class="score-board">
      <p>Score: {{ score }} | Difficulty: {{ difficulty }}</p>
    </div>

    <!-- The Active Game Window Container -->
    <div class="game-container" ref="gameArea">
      <div class="player" :style="{ bottom: playerBottom + 'px' }"></div>
      <div class="obstacle" :style="{ left: obstacleLeft + 'px' }"></div>

      <!-- Overlay Panel that shows up when player loses -->
      <div v-if="isGameOver" class="game-over-screen">
        <h1>GAME OVER</h1>
        <p>Final Score: {{ score }}</p>
        <button @click="restartGame">Play Again</button>
      </div>
    </div>

    <!-- Action Bar Controls -->
    <div class="controls">
      <button @click="handleJump" class="btn-jump">🚀 JUMP (or Press Space)</button>
      <button @click="triggerGameOver" class="btn-quit">Simulate Game Over</button>
    </div>
  </div>
</template>

<script setup>
import { gameService } from './services/gameService';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const score = computed(() => store.getters.currentScore);
const difficulty = computed(() => store.getters.currentDifficulty);

// Game Engine State Variables
const isGameOver = ref(false);
const playerBottom = ref(0);
const obstacleLeft = ref(580);
const isJumping = ref(false);

let gameLoopInterval = null;

// 🎵 Audio Reference Instance State Holder
const backgroundMusic = ref(null);

// 🎵 Sound FX Player Function matching your exact folder and double-extension setup
const playSound = (soundName) => {
  try {
    let audioFile = '';
    if (soundName === 'jump') {
      audioFile = new URL('./assets/sounds/jump.mp3.mp3', import.meta.url).href;
    } else if (soundName === 'score') {
      audioFile = new URL('./assets/sounds/score.mp3.mp3', import.meta.url).href;
    } else {
      return;
    }
    const fx = new Audio(audioFile);
    fx.volume = 0.4;
    fx.play().catch(() => console.log("Audio play blocked by browser context. Click to unlock."));
  } catch (e) {
    console.warn("Audio asset could not be loaded:", e);
  }
};

// 🎵 Ambient Loop Music Function matching your exact folder and double-extension setup
const playMusic = () => {
  try {
    const musicPath = new URL('./assets/sounds/music.mp3.mp3', import.meta.url).href;
    backgroundMusic.value = new Audio(musicPath);
    backgroundMusic.value.loop = true;
    backgroundMusic.value.volume = 0.25;
    backgroundMusic.value.play().catch(() => {
      console.log("Autoplay protection active. Sound starts when you click or jump.");
    });
  } catch (e) {
    console.warn("Background music track missing:", e);
  }
};


// Handle Player Jump Mechanics
const handleJump = () => {
  if (isJumping.value || isGameOver.value) return;
  
  isJumping.value = true;
  let jumpHeight = 0;
  
  // 🎵 Trigger the jump sound effect right when taking off
  playSound('jump');
  
  // Smoothly move upward
  const upLoop = setInterval(() => {
    if (jumpHeight >= 120) {
      clearInterval(upLoop);
      // Smoothly fall back down
      const downLoop = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(downLoop);
          isJumping.value = false;
          playerBottom.value = 0;
        } else {
          jumpHeight -= 6;
          playerBottom.value = jumpHeight;
        }
      }, 12);
    } else {
      jumpHeight += 8;
      playerBottom.value = jumpHeight;
    }
  }, 12);
};

// Listen for Spacebar controls
const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleJump();
  }
};

// Core Game Loop: Handles obstacle movement and real-time collision checks
const startGameEngine = () => {
  // Clear any existing loops
  clearInterval(gameLoopInterval);
  obstacleLeft.value = 580;
  
  gameLoopInterval = setInterval(() => {
    if (isGameOver.value) return;

    // Move obstacle to the left based on difficulty level speed multiplier
    obstacleLeft.value -= (5 + difficulty.value);

    // If obstacle passes the left edge, loop it back and add a point
    if (obstacleLeft.value <= -30) {
      obstacleLeft.value = 600;
      store.dispatch('addScore', 1);
      
      // 🎵 Trigger score audio notification
      playSound('score');
      
      // Gradually escalate difficulty automatically every 3 points
      if (score.value % 3 === 0) {
        store.dispatch('changeDifficulty', difficulty.value + 1);
      }
    }

    // 💥 Real-Time Box Collision Detection Logic
    if (obstacleLeft.value > 40 && obstacleLeft.value < 80 && playerBottom.value < 40) {
      triggerGameOver();
    }
  }, 20);
};

// Handle Axios Submission Pipeline on Game End
const triggerGameOver = async () => {
  if (isGameOver.value) return;
  isGameOver.value = true;
  clearInterval(gameLoopInterval);

  // 🎵 Stop background music tracking upon game over state changes
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }

  setTimeout(async () => {
    const playerName = prompt('Game Over! Enter your name for the leaderboard:');
    if (playerName) {
      try {
        await gameService.submitHighScore(playerName, score.value);
        alert('High score saved!');
      } catch (error) {
        console.error(error);
      }
    }
  }, 100);
};

// eslint-disable-next-line no-unused-vars
const restartGame = () => {
  isGameOver.value = false;
  store.commit('SET_DIFFICULTY', 1);
  
  // 🎵 Reset background music parameters if initialized
  if (backgroundMusic.value) {
    backgroundMusic.value.currentTime = 0;
    backgroundMusic.value.play().catch(e => console.log(e));
  }
  
  startGameEngine();
};

// Mount Key Listeners and Boot Loop
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  startGameEngine();
  
  // 🎵 Trigger standard background track instantiation on load
  playMusic();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  clearInterval(gameLoopInterval);
  
  if (backgroundMusic.value) {
    backgroundMusic.value.pause();
  }
});
</script>

<style scoped>
.game-wrapper {
  text-align: center;
  margin: 10px auto;
}

.game-container {
  position: relative;
  width: 600px;
  height: 200px;
  background-color: #f0f0f0;
  border: 3px solid #34495e;
  overflow: hidden;
  margin: 10px auto;
  border-radius: 6px;
}

.score-board {
  font-size: 18px;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 5px;
}

.player {
  position: absolute;
  left: 50px;
  bottom: 0;
  width: 35px;
  height: 45px;
  background-color: #3498db;
  border-radius: 4px;
  transition: bottom 0.02s linear;
}

.obstacle {
  position: absolute;
  bottom: 0;
  width: 25px;
  height: 40px;
  background-color: #e74c3c;
  border-radius: 4px;
}

.controls {
  margin-top: 10px;
}

.btn-jump {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-quit {
  padding: 10px 15px;
  font-size: 14px;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.game-over-screen button {
  padding: 8px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
</style>
