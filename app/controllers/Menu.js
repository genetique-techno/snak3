import EventEmitter from 'events';
import _ from 'underscore';

import menuItems from 'app/config/menuItems.js';

export default class Menu extends EventEmitter {

  constructor() {
    super();

    this.selectionIndex = 0;
    this.logSelection;

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
    this.selectionIndex = this.selectionIndex === 0 ? 0 : this.selectionIndex - 1;
    if ( menuItems[ this.selectionIndex ].type === 'separator' ) {
      this.selectionIndex--;
    }
    this.emit( 'changeSelection', this.selectionIndex );
  }

  incrementSelection() {
    this.selectionIndex = this.selectionIndex === menuItems.length - 1 ? menuItems.length - 1 : this.selectionIndex + 1;
    if ( menuItems[ this.selectionIndex ].type === 'separator' ) {
      this.selectionIndex++;
    }
    this.emit( 'changeSelection', this.selectionIndex );
  }

  acceptSelection() {
    this.emit( 'acceptSelection', menuItems[ this.selectionIndex ] );
  }
}
