import gameTypes from 'app/config/gameTypes.js';

export default [
  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'easy',
    config: {
      mainPass: 'gamePass',
      overlay: 'none',
      gameType: gameTypes[0],
      reset: false
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'medium',
    config: {
      mainPass: 'gamePass',
      overlay: 'none',
      gameType: gameTypes[1],
      reset: false
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'hard',
    config: {
      mainPass: 'gamePass',
      overlay: 'none',
      gameType: gameTypes[2],
      reset: false
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'impossible',
    config: {
      mainPass: 'gamePass',
      overlay: 'none',
      gameType: gameTypes[3],
      reset: false
    }

  },

  {
    type: 'separator',
    label: ''
  },

  {
    type: 'other',
    label: 'how to play',
    func: 'newInstructions'
  },

  {
    type: 'other',
    label: 'high scores',
    func: 'newHighScores'
  }

];
