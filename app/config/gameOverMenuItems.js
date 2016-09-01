import gameTypes from 'app/config/gameTypes.js';

export default [
  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'retry',
    config: {
      mainPass: 'gamePass',
      overlay: null,
      reset: false
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'main menu',
    config: {
      mainPass: 'titlePass',
      overlay: 'menuOverlay',
      gameType: gameTypes[0],
      reset: true
    }
  },

  {
    type: 'separator',
    label: ''
  },

  {
    type: 'other',
    label: 'high scores',
    func: 'newHighScores'
  }

];
