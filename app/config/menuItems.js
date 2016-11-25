import gameTypes from 'app/config/gameTypes.js';

export default [
  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'easy',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'gamePass'
      },
      overlayPass: {
        change: true,
        delay: false,
        value: 'scoreOverlay'
      },
      gameType: gameTypes[0]
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'medium',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'gamePass'
      },
      overlayPass: {
        change: true,
        delay: false,
        value: 'scoreOverlay'
      },
      gameType: gameTypes[1]
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'hard',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'gamePass'
      },
      overlayPass: {
        change: true,
        delay: false,
        value: 'scoreOverlay'
      },
      gameType: gameTypes[2]
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'impossible',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'gamePass'
      },
      overlayPass: {
        change: true,
        delay: false,
        value: 'scoreOverlay'
      },
      gameType: gameTypes[3]
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
