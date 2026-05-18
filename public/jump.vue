<template>
  <div class="game-container">
    
    <div class="score-board">Score: {{ score }}</div>

  
    <div v-if="gameOver" class="game-over-screen">
      <h1>GAME OVER</h1>
      <p>Final Score: {{ score }}</p>
      <button @click="resetGame">Play Again</button>
    </div>

   
    <div 
      class="player" 
      :class="{ 'is-jumping': isJumping }"
      :style="{ bottom: playerY + 'px' }"
    ></div>

    
    <div 
      class="obstacle" 
      :style="{ left: obstacleX + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'JumpGame',
  data() {
    return {
      
      score: 0,
      gameOver: false,
      animationFrameId: null,

      playerY: 0, 
      isJumping: false,
      jumpVelocity: 0,
      gravity: 0.6,

      obstacleX: 500,
      obstacleSpeed: 5,
      hasPassedObstacle: false,

      playerWidth: 40,
      playerHeight: 50,
      obstacleWidth: 30,
      obstacleHeight: 40
    };
  },
  mounted() {
    
    this.startGame();
   
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
   
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    startGame() {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },
    gameLoop() {
      if (this.gameOver) return;

      this.moveObstacle();
      this.applyGravity();
      this.checkCollision();

      if (!this.gameOver) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      }
    },
    handleKeyDown(event) {
      if (event.code === 'Space') {
        this.jump();
      }
    },
    jump() {
  
      if (!this.isJumping) {
        this.isJumping = true;
        this.jumpVelocity = 12; // Initial upward force
      }
    },
    applyGravity() {
      if (this.isJumping) {
        this.playerY += this.jumpVelocity;
        this.jumpVelocity -= this.gravity; // Pull downward

       
        if (this.playerY <= 0) {
          this.playerY = 0;
          this.isJumping = false;
          this.jumpVelocity = 0;
        }
      }
    },
    moveObstacle() {
      this.obstacleX -= this.obstacleSpeed;

      // Track score increment threshold when passing the player
      if (!this.hasPassedObstacle && this.obstacleX < (50 - this.obstacleWidth)) {
        this.incrementScore();
        this.hasPassedObstacle = true;
      }

      // Reset obstacle position once it goes entirely off-screen
      if (this.obstacleX < -this.obstacleWidth) {
        this.obstacleX = 600; // Reset to right edge of container
        this.hasPassedObstacle = false; // Reset score trigger flag
        this.obstacleSpeed += 0.2; // Optional: progressive difficulty scaling
      }
    },
    checkCollision() {
      // Player static X position is 50px (defined in CSS)
      const playerX = 50; 
      
      // Check 2D bounding box overlap
      const holdingXOverlap = (playerX < this.obstacleX + this.obstacleWidth) && 
                              (playerX + this.playerWidth > this.obstacleX);
                              
      const holdingYOverlap = (this.playerY < this.obstacleHeight); // ground is 0

      if (holdingXOverlap && holdingYOverlap) {
        this.triggerGameOver();
      }
    },
    incrementScore() {
      this.score += 1;
    },
    triggerGameOver() {
      this.gameOver = true;
      cancelAnimationFrame(this.animationFrameId);
    },
    resetGame() {
      // Re-initialize all base data properties
      this.score = 0;
      this.gameOver = false;
      this.playerY = 0;
      this.isJumping = false;
      this.jumpVelocity = 0;
      this.obstacleX = 500;
      this.obstacleSpeed = 5;
      this.hasPassedObstacle = false;
      
      // Restart loop
      this.startGame();
    }
  }
};
</script>

<style scoped>
.game-container {
  position: relative;
  width: 600px;
  height: 200px;
  background-color: #f0f0f0;
  border: 2px solid #333;
  overflow: hidden;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

.score-board {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  font-weight: bold;
  z-index: 10;
}

.player {
  position: absolute;
  left: 50px; /* Fixed X position */
  width: 40px;
  height: 50px;
  background-color: #3498db;
  border-radius: 4px;
}

.obstacle {
  position: absolute;
  bottom: 0;
  width: 30px;
  height: 40px;
  background-color: #e74c3c;
  border-radius: 4px;
}

.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.game-over-screen h1 {
  margin: 0 0 10px 0;
  color: #e74c3c;
}

.game-over-screen button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  background-color: #2ecc71;
  border: none;
  color: white;
  border-radius: 4px;
}

.game-over-screen button:hover {
  background-color: #27ae60;
}
</style>
