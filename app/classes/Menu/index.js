import EventEmitter from 'events';
import _ from 'underscore';
import GameBoard from 'app/classes/GameBoard';

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.selectionIndex = 1;
    this.menuItems = [
      {
        difficulty: 'easy',
        limits: [10, 10, 1],
        interval: 500
      },
      {
        difficulty: 'medium',
        limits: [10, 10, 3],
        interval: 500
      },
      {
        difficulty: 'hard',
        limits: [15, 15, 6],
        interval: 350
      },
      {
        difficulty: 'impossible',
        limits: [25, 25, 10],
        interval: 200
      }
    ];

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
    this.selectionIndex = this.selectionIndex === 0 ? this.menuItems.length - 1 : this.selectionIndex - 1;
    console.log(this.menuItems[this.selectionIndex].difficulty, 'selected');
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === this.menuItems.length - 1 ? 0 : this.selectionIndex + 1;
    console.log(this.menuItems[this.selectionIndex].difficulty, 'selected');
  }

  acceptSelection() {
    this.emit( 'acceptSelection', new GameBoard( this.menuItems[ this.selectionIndex ] ) );
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
