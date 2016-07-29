var GameBoard = require('../GameBoard');
var Snake = require('../Snake');

class Game {

  constructor( boardArr ) {
    if (!(boardArr instanceof Array()) && length === 3) {
      return console.log('Invalid board game dimensions');
    }

    this.gameBoard = new GameBoard( boardArr );
    this.snake = new Snake(this._getStartingHead());
    this.nodes = [];
    this.status = true;
  }

  // only checks for an edge crash currently
  _checkSnakeCrash() {

    var head = this.nodes[ this.nodes.length -1 ];

    return (head[0] < 0 || head[0] > this.gameBoard.limits[0] ||
        head[1] < 0 || head[1] > this.gameBoard.limits[1] ||
        head[2] < 0 || head[2] > this.gameBoard.limits[2]);
  }

  _getStartingHead() {
    var initX = Math.floor( Math.random() * this.gameBoard[0] );
    var initY = Math.floor( Math.random() * this.gameBoard[1] );
    var initZ = 0; // no 3d for now
    return [ initX, initY, initZ ]; 
  }

  tick() {
    if ( !this.status ) { return console.log('Game is over.'); }

    this.nodes = this.snake._tick();
    this.status = this._checkSnakeCrash();
  }

  changeDirection(dir) {
    this.direction = this.snake._changeDirection(dir);
  }

  getState() {
    console.log('nodes: ', this.nodes);
    console.log('direction: ', this.direction);
    console.log('status: ', this.status);
  }
} 
