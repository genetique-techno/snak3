import EventEmitter from 'events';
import _ from 'underscore';
import stateManager from 'app/controllers/stateManager.js';
import audioEngine from 'app/controllers/audioEngine.js';

function keyListener(e) {

  let keyCode = _.result({
    // '37': 'left',
    '38': 'up',
    // '39': 'right',
    '40': 'down',
    // '16': 'in',
    // '17': 'out',
    '13': 'return'
  }, e.keyCode, null);

  switch ( keyCode ) {
    case 'up':
      this.decrementSelection();
      break;
    case 'down':
      this.incrementSelection();
      break;
    case 'return':
      this.acceptSelection();
      break;
  }
}

export default class GameOver extends EventEmitter {

  constructor() {
    super();

    this.gameOverMenuItems = [
      "retry",
      "main menu",
      "separator",
      "high scores"
    ];

    this.selectionIndex = 0;
    this.logSelection;
    this.keyListener = keyListener.bind( this );

    window.addEventListener( 'keydown', this.keyListener );
  }


  decrementSelection() {
    this.selectionIndex = this.selectionIndex === 0 ? 0 : this.selectionIndex - 1;
    if ( this.gameOverMenuItems[ this.selectionIndex ] === 'separator' ) {
      this.selectionIndex--;
    }
    this.emit( 'changeSelection', this.selectionIndex );
    audioEngine.trigger( 'MenuChange' );
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === this.gameOverMenuItems.length - 1 ? this.gameOverMenuItems.length - 1 : this.selectionIndex + 1;
    if ( this.gameOverMenuItems[ this.selectionIndex ] === 'separator' ) {
      this.selectionIndex++;
    }
    this.emit( 'changeSelection', this.selectionIndex );
    audioEngine.trigger( 'MenuChange' );
  }

  acceptSelection() {
    let item = this.gameOverMenuItems[ this.selectionIndex ];

    audioEngine.trigger( 'MenuAccept' );
    window.removeEventListener( 'keydown', this.keyListener );

    switch (item) {

      case "retry":
        this.emit( "acceptSelection", { mainPass: "gamePass" });
        break;

      case "main menu":
        this.emit( "acceptSelection", { mainPass: "titlePass" });
        break;

      case "high scores":
        console.log("high scores: Not implemented" );
        break;

      default:

    }

  }
}
