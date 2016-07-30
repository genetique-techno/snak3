import _ from 'underscore';

import GameBoard from 'app/classes/GameBoard';
import Snake from 'app/classes/Snake';
import util from 'app/util';

class Game {

  constructor( boardArr ) {
    if (!(boardArr instanceof Array) && length === 3) {
      return console.log('Invalid board game dimensions');
    }

    this.gameBoard = new GameBoard( boardArr );
    this.snake = new Snake( this._getStartingHead( this.gameBoard.levelUpPosition ) );
    this.status = true;
  }

  // only checks for an edge crash currently
  _didSnakeCrash() {

    var head = this.snake.nodes[ this.snake.nodes.length -1 ];
    
    if ( util.isNodeIncluded( this.snake.head, this.snake.nodes.slice(0, this.snake.nodes.length - 2 ) ) ) {
      console.log('crashed into your own snake');
      return true;
    }

    return (
      (head[0] < 0 || head[0] > this.gameBoard.limits[0]) ||
      (head[1] < 0 || head[1] > this.gameBoard.limits[1]) ||
      (head[2] < 0 || head[2] > this.gameBoard.limits[2])
    );
  }

  _getStartingHead( avoid ) {

    avoid = avoid.join('');
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * this.gameBoard.limits[0] ),
        Math.floor( Math.random() * this.gameBoard.limits[1] ),
        Math.floor( Math.random() * this.gameBoard.limits[2] )
      ];
    } while ( rnd.join('') === avoid )

    return rnd;
  }

  tick() {
    if ( !this.status ) { return console.log('XXXX Crashed! Game is over.'); }

    console.log('----> tick');
    this.snake._tick();
    this.status = !this._didSnakeCrash();
    if (this.snake.head.join('') === this.gameBoard.levelUpPosition.join('')) {
      this.gameBoard.levelUp(this.snake.nodes);
      this.snake.setExtensionTicks( this.gameBoard.level );
    }
    this.getState();
  }

  changeDirection(dir) {
    if ( !this.status ) { return null; }
    this.direction = this.snake._changeDirection(dir);
    console.log('----> new direction: ', dir);
  }

  getState() {
    console.log('----');
    console.log('nodes: ');
    this.snake.nodes.forEach((node) => ( console.log(node) ));
    console.log('levelup: ', this.gameBoard.levelUpPosition);
    console.log('direction: ', this.direction);
    console.log('status: ', this.status ? 'OK' : 'OVER');
    console.log('----');
    if ( !this.status ) { console.log('XXXX Crashed! Game is over.'); }
  }
} 

export default Game;