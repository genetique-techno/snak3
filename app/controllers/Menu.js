import EventEmitter from 'events';
import _ from 'underscore';
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

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.menuItems = [
      "easy",
      "medium",
      "hard",
      "impossible",
      "separator",
      "how to play",
      "high scores"
    ];

    this.selectionIndex = 0;
    this.logSelection;
    this.keyListener = keyListener.bind( this );

    window.addEventListener( 'keydown', this.keyListener );
  }


  decrementSelection() {
    this.selectionIndex = this.selectionIndex === 0 ? 0 : this.selectionIndex - 1;
    if ( this.menuItems[ this.selectionIndex ] === 'separator' ) {
      this.selectionIndex--;
    }
    this.emit( 'changeSelection', this.selectionIndex );
    audioEngine.trigger( "MenuChange" );
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === this.menuItems.length - 1 ? this.menuItems.length - 1 : this.selectionIndex + 1;
    if ( this.menuItems[ this.selectionIndex ] === 'separator' ) {
      this.selectionIndex++;
    }
    this.emit( 'changeSelection', this.selectionIndex );
    audioEngine.trigger( "MenuChange" );
  }

  acceptSelection() {
    let item = this.menuItems[ this.selectionIndex ];

    let gameState = {
      mainPass: "gamePass",
      name: "",
      score: 0
    };

    switch (item) {

      case "easy":
        this.emit( "acceptSelection", _.defaults({
          difficulty: 0
        }, gameState ));
        break;

      case "medium":
        this.emit( "acceptSelection", _.defaults({
          difficulty: 1
        }, gameState ));
        break;

      case "hard":
        this.emit( "acceptSelection", _.defaults({
          difficulty: 2
        }, gameState ));
        break;

      case "impossible":
        this.emit( "acceptSelection", _.defaults({
          difficulty: 3
        }, gameState ));
        break;

      case "how to play":
        this.emit( "acceptSelection", _.defaults({
          mainPass: "howToPlayPass"
        }, gameState ));

        break;

      case "high scores":
        console.log("high scores: Not Implemented");
        break;

      default:

    }

    audioEngine.trigger( "MenuAccept" );
    window.removeEventListener( 'keydown', this.keyListener );

  }
}
