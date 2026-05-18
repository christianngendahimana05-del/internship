import { createStore } from 'vuex';

export default createStore({
  state: {
    gameScore: 0, 
    difficultyLevel: 1 
  },
  getters: {
    currentScore(state) {
      return state.gameScore;
    },
    currentDifficulty(state) {
      return state.difficultyLevel;
    }
  },
  mutations: {
    INCREMENT_SCORE(state, points = 1) {
      state.gameScore += points;
    },
    SET_DIFFICULTY(state, level) {
      state.difficultyLevel = level;
    }
  },
  actions: {
    addScore({ commit }, points) {
      commit('INCREMENT_SCORE', points);
    },
    changeDifficulty({ commit }, level) {
      commit('SET_DIFFICULTY', level);
    }
  }
});
