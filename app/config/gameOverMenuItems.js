import gameTypes from 'app/config/gameTypes.js';

export default [
  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'retry',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'gamePass'        
      },
      overlayPass: {
        change: true,
        delay: false,
        value: 'none'
      }
    }
  },

  {
    type: 'function',
    value: 'setNewApplicationState',
    label: 'main menu',
    config: {
      mainPass: {
        change: true,
        delay: false,
        value: 'titlePass'        
      },
      overlayPass: {
        change: true,
        delay: 7000,
        value: 'menuOverlay'
      }
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
