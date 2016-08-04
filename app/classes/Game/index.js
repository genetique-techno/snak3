import _ from 'underscore';
import EventEmitter from 'events';

import GameBoard from 'app/classes/GameBoard';
import Snake from 'app/classes/Snake';
import util from 'app/util';

class Game extends EventEmitter {

  constructor( boardArr ) {
    super();

    if (!(boardArr instanceof Array) && length === 3) {
      return console.log('Invalid board game dimensions');
    }

    this.gameBoard = new GameBoard( boardArr );
    this.snake = new Snake( this._getStartingHead( this.gameBoard.levelUpPosition ) );
    this.status = true;
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
  }

  changeDirection(dir) {
    if ( !this.status ) { return null; }
    this.snake._changeDirection(dir);
  }

  // getState() {
  //   console.log('----');
  //   console.log('nodes: ');
  //   this.snake.nodes.forEach((node) => ( console.log(node) ));
  //   console.log('levelup: ', this.gameBoard.levelUpPosition);
  //   // console.log('direction: ', this.direction);
  //   console.log('status: ', this.status ? 'OK' : 'OVER');
  //   console.log('----');
  //   if ( !this.status ) { console.log('XXXX Crashed! Game is over.'); }
  // }
} 

export default Game;
