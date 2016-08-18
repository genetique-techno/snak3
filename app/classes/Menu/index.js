import EventEmitter from 'events';
import _ from 'underscore';
import GameBoard from 'app/classes/GameBoard';

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.selectionIndex = 0;

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
    console.log('decrementSelection');

  }

  incrementSelection() {

    console.log('incrementSelection');
  }

  acceptSelection() {
    let gameBoard = new GameBoard( [10, 10, 3] );
    console.log(gameBoard);
    this.emit( 'acceptSelection', new GameBoard( [10, 10, 3] ) );

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
