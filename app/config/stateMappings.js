// Main Passes
import GamePass from 'app/views/GamePass.js';
import TitlePass from 'app/views/TitlePass.js';

// Overlay Passes
import MenuOverlay from 'app/views/MenuOverlay.js';
import GameOverOverlay from 'app/views/GameOverOverlay.js';
import ScoreOverlay from 'app/views/ScoreOverlay.js';

export default {

  mainPasses: {
    'gamePass': GamePass,
    'titlePass': TitlePass
  },

  overlays: {
    'menuOverlay': MenuOverlay,
    'gameOverOverlay': GameOverOverlay,
    'scoreOverlay': ScoreOverlay,
    'none': null
  }

};
