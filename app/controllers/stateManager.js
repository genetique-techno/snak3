
import EventEmitter from 'events';
import gameTypes from 'app/config/gameTypes.js';
import _ from 'underscore';

class StateManager extends EventEmitter {

  constructor() {
    super();

    //new state def
    /*
    let newStateDef = {
      changeMainPass: bool,
      mainPass: '',
      changeOverlay: bool,
      overlay: '',
      gameType: ''
    }

    examples:
      initial state: {
        mainPass: {
          change: bool,
          value: '',
          delay: bool
        },
        overlay: {
          change: bool,
          value: '',
          delay: bool
        },
        gameType: null
      }

      game selected: {
        changeMainPass: true,
        mainPass: 'gamePass',
        changeOverlay: true,
        overlay: 'none',
        gameType: a gameType
      }

      gameover: {
        changeMainPass: false,
        mainPass: 'gamePass',
        changeOverlay: true,
        overlay: 'gameOverOverlay',
        gameType: unchanged
      }

      retry: {
        changeMainPass: true,
        mainPass: 'gamePass',
        changeOverlay: true,
        overlay: 'none',
        gameType: unchanged
      }

      back to main menu: {
        changeMainPass: true,
        mainPass: 'titlePass',
        changeOverlay: true,
        overlay: 'menuOverlay',
        gameType: unchanged
      }

      Notes: gameType should persist, maybe need immutable?
      - `change` values are set by each state entry point
      - Application can then just look at the change values to tell if it needs to operate on views

    */

    this._state = {
      mainPass: {
        change: true,
        delay: false,
        value: 'titlePass'
      },
      overlayPass: {
        change: true,
        delay: 5000,
        value: 'menuOverlay'
      },
      gameType: gameTypes[0]
    };


    // score in the state

    this._score = {
      value: 0,
      difficulty: null,
      name: null
    };


  }

  setNewApplicationState( obj ) {
    if ( !( obj instanceof Object ) && typeof obj['mainPass'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new MainPass requested with ${obj}` );
    }

    this._state = _.extend( {}, this._state, obj );
    this.emitCurrentState();
  }

  emitCurrentState() {
    this.emit( 'newApplicationState', this._state );
  }

  setNewScore( obj ) {
    if ( !( obj instanceof Object ) && typeof obj['score'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new Score updated with no score: ${obj}`);
    }

    this._score = _.extend( {}, this._score, obj );
    this.emitCurrentScore();
  }

  emitCurrentScore() {
    this.emit( 'newScoreState', this._score );
    // console.log(this._score.value);
  }

}

export default new StateManager();
