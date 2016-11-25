
import EventEmitter from 'events';
import gameTypes from 'app/config/gameTypes.js';
import _ from 'underscore';

class StateManager extends EventEmitter {

  constructor() {
    super();

    this._state = {
      mainPass: "titlePass",
      difficulty: 0,
      name: "",
      score: 0
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
}

export default new StateManager();
