import _ from 'underscore';
import EventEmitter from 'events';

import Snake from 'app/classes/Snake';
import util from 'app/util';

class Game extends EventEmitter {

  constructor( gameBoard ) {
    super();

    this.gameBoard = gameBoard;
    this.snake = new Snake( this._getStartingHead( this.gameBoard.levelUpPosition ) );
    this.status = 'ready';

    this.ticker = null;
    window.addEventListener( 'keydown', this.keyListener.bind( this ) );

    this.on( 'gameOver', () => {
      window.removeEventListener( 'keyDown', this.keyListener.bind( this ) );
      window.clearInterval( this.ticker );
    });

  }

  keyListener(e) {

    switch ( this.status ) {
      case 'ready':
        this.ticker = this.ticker || window.setInterval( this.tick.bind( this ), 500 );
      case true:
        let keyCode = _.result({
          '37': 'left',
          '38': 'up',
          '39': 'right',
          '40': 'down',
          '16': 'in',
          '17': 'out'
        }, e.keyCode, null);
        
        if (keyCode) {
          this.changeDirection(keyCode);
        }
        break;
      case false:
        console.log(e);        
    }
  }

  _didSnakeCrash() {

    var head = this.snake.nodes[ this.snake.nodes.length - 1 ];
    
    if ( util.isNodeIncluded( this.snake.head, this.snake.nodes.slice(0, this.snake.nodes.length - 2 ) ) ) {
      console.log('crashed into your own snake');
      this.emit( 'gameOver' );
      return true;
    }

    return (
      (head[0] < 0 || head[0] > this.gameBoard.limits[0] - 1) ||
      (head[1] < 0 || head[1] > this.gameBoard.limits[1] - 1) ||
      (head[2] < 0 || head[2] > this.gameBoard.limits[2] - 1)
    );
  }

  _getStartingHead( avoid ) {

    avoid = avoid.join('$');
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * (this.gameBoard.limits[0] - 1) ),
        Math.floor( Math.random() * (this.gameBoard.limits[1] - 1) ),
        Math.floor( Math.random() * (this.gameBoard.limits[2] - 1) )
      ];
    } while ( rnd.join('$') === avoid )

    return rnd;
  }

  tick() {
    if ( !this.status ) { 
      this.emit( 'gameOver' );
      return console.log('XXXX Crashed! Game is over.'); 
    }

    console.log('----> tick');
    this.snake._tick();
    this.status = !this._didSnakeCrash();
    if (this.snake.head.join('$') === this.gameBoard.levelUpPosition.join('$')) {
      this.gameBoard.levelUp(this.snake.nodes);
      this.snake.setExtensionTicks( this.gameBoard.level );
    }

    this.emit( 'tick', {
      nodes: this.snake.nodes,
      head: this.snake.head,
      levelUpPosition: this.gameBoard.levelUpPosition
    });
  }

  changeDirection(dir) {
    if ( !this.status ) { return null; }
    this.snake._changeDirection(dir);
  }
} 

export default Game;
