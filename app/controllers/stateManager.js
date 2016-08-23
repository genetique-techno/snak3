
import EventEmitter from 'events';
import gameTypes from 'app/config/gameTypes.js';

class StateManager extends EventEmitter {

  constructor() {
    super();

    this._state = {
      mainPass: 'gamePass',
      overlay: 'menu',
      gameType: gameTypes[0]
    };
  }

  setNewApplicationState( obj ) {
    if ( !( obj instanceof Object ) && typeof obj['mainPass'] === 'undefined' ) {
      return console.log( `Invalid State Transition: new MainPass requested with ${obj}` );
    }

    this._state = obj;
    this.emit( 'newApplicationState', this._state );
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

  emitCurrentState() {

    this.emit( 'newApplicationState', this._state );
  }
}

export default new StateManager();
