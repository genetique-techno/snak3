import EventEmitter from 'events';
import _ from 'underscore';
import GameBoard from 'app/classes/GameBoard';

import games from 'app/config/games.js';

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.selectionIndex = 0;
    console.log( games[ this.selectionIndex ].difficulty, 'selected' );

    window.addEventListener( 'keydown', this.keyListener.bind( this ) );
  }


  keyListener(e) {

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

  decrementSelection() {
    this.selectionIndex = this.selectionIndex === 0 ? games.length - 1 : this.selectionIndex - 1;
    console.log(games[this.selectionIndex].difficulty, 'selected');
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === games.length - 1 ? 0 : this.selectionIndex + 1;
    console.log(games[this.selectionIndex].difficulty, 'selected');
  }

  acceptSelection() {
    this.emit( 'acceptSelection', new GameBoard( games[ this.selectionIndex ] ) );
  }
}

// menu options
/*

  Easy
  Medium
  Hard
  Impossible


  returns a gameBoard object
*/
