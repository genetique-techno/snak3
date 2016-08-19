import EventEmitter from 'events';
import _ from 'underscore';
import GameBoard from 'app/classes/GameBoard';

import menuItems from 'app/config/menuItems.js';

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.selectionIndex = 0;
    this.logSelection;

    window.addEventListener( 'keydown', this.keyListener.bind( this ) );
  }

  logSelection() {
    let item = menuItems[ this.selectionIndex ];

    switch ( item.type ) {
      case 'game':
        console.log( item.difficulty, 'selected' );
        break;
      case 'instructions':
        console.log( item.label, 'selected' );
        break;
      case 'highscores':
        console.log( item.label, 'selected' );
        break;
    }
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
    this.selectionIndex = this.selectionIndex === 0 ? 0 : this.selectionIndex - 1;
    if ( menuItems[ this.selectionIndex ].type === 'separator' ) {
      this.selectionIndex--;
    }
    this.logSelection();
    this.emit( 'changeSelection', this.selectionIndex );
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === menuItems.length - 1 ? menuItems.length - 1 : this.selectionIndex + 1;
    if ( menuItems[ this.selectionIndex ].type === 'separator' ) {
      this.selectionIndex++;
    }
    this.logSelection();
    this.emit( 'changeSelection', this.selectionIndex );
  }

  acceptSelection() {
    this.emit( 'acceptSelection', new GameBoard( menuItems[ this.selectionIndex ] ) );
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
