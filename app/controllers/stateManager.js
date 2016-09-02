
import EventEmitter from 'events';
import gameTypes from 'app/config/gameTypes.js';
import _ from 'underscore';

class StateManager extends EventEmitter {

  constructor() {
    super();

    this._state = {
      mainPass: null,
      overlay: null,
      gameType: null,
      reset: null
    };

    this._oldState = {
      mainPass: null,
      overlay: null,
      gameType: null,
      reset: null
    };
  }

  emitInitialState() {
    this.emit( 'newApplicationState', {
      mainPass: 'titlePass',
      overlay: 'menuOverlay',
      gameType: gameTypes[0],
      reset: true
    });
  }

  setNewApplicationState( obj ) {
    this._oldState = this._state;

    if ( !( obj instanceof Object ) && typeof obj['mainPass'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new MainPass requested with ${obj}` );
    }

    this._state['reset'] = true;
    this._state = obj;
    this.emitCurrentState();
    this._state['reset'] = false;
  }

  setNewGameTypeState( obj ) {
    if ( !( obj instanceof Object ) && typeof obj['gameType'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new GameType requested with ${obj}` );
    }

    this._state['gameType'] = obj['gameType'];
    this.emit( 'newGameTypeState', this._state );
  }

  setNewOverlayState( obj ) {
    if ( !( obj instanceof Object ) && typeof obj['overlay'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new Overlay requested with ${obj}` );
    }

    this._state['overlay'] = obj['overlay'];

    this.emit( 'newOverlayState', this._state );
  }

  getState() {
    return this._state;
  }

  getOldState() {
    return this._oldState;
  }

  emitCurrentState() {


    this.emit( 'newApplicationState', this._state );
  }
}

export default new StateManager();
