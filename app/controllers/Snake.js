import util from 'app/util';
import EventEmitter from 'events';
import audioEngine from 'app/controllers/audioEngine.js';

class Snake extends EventEmitter {

  constructor( limits, options = {} ) {
    super();
    this.options = options;
    this.limits = limits;
    this.head = options.nodes ? options.nodes[ options.nodes.length-1 ] : null || this._getStartingHead( limits );
    this.direction = null;
    this.nodes = options.nodes || [ this.head ];
    this.extensions = 0;

  }

  _getStartingHead( avoid ) {
    avoid = avoid.join('$');
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * (this.limits[0] - 1) ),
        Math.floor( Math.random() * (this.limits[1] - 1) ),
        Math.floor( Math.random() * (this.limits[2] - 1) )
      ];
    } while ( rnd.join('$') === avoid )

    return rnd;
  }

  _didSnakeCrash() {

    // Check if crashed into own snake
    if ( util.isNodeIncluded( this.head, this.nodes.slice(0, this.nodes.length - 2 ) ) ) {

      this.emit( 'gameOver', {
        reason: 'crashed into own snake'
      } );

      return true;

    // Check if crashed into floor, wall, or ceiling
    } else if (
        (this.head[0] < 0 || this.head[0] > this.limits[0] - 1)
        || (this.head[1] < 0 || this.head[1] > this.limits[1] - 1)
        || (this.head[2] < 0 || this.head[2] > this.limits[2] - 1)
    ) {

      this.emit( 'gameOver', {
        reason: 'crashed into the wall, floor, or ceiling'
      } );

      return true;

    }

    // didn't crash
    return false;
  }


  changeDirection( code ) {

    let newDir = util.keyToAction[ code ];

    if (this.nodes.length === 1) { return this.nextDirection = newDir };

    // ignore inputs that would reverse the snake on itself
    if ( newDir === 'up' && this.direction === 'down' ) {
      return null;
    } else if ( newDir === 'left' && this.direction === 'right' ) {
      return null;
    } else if ( newDir === 'right' && this.direction === 'left' ) {
      return null;
    } else if ( newDir === 'down' && this.direction === 'up' ) {
      return null;
    } else if ( newDir === 'in' && this.direction === 'out' ) {
      return null;
    } else if ( newDir === 'out' && this.direction === 'in' ) {
      return null;
    } else {
      this.nextDirection = newDir;
    }

  }

  extendBy( val ) {
    // push the new extensions, don't replace them if they are still being popped
    this.extensions = this.extensions + val;
  }

  advance() {
    var headStub = [0, 0, 0];
    var directionalSound = '';
    // set the direction off of the nextDirection
    this.direction = this.nextDirection;
    switch ( this.direction ) {

      case 'up':
        headStub = [0, 1, 0];
        directionalSound = 'SnakeSideways'
        break;

      case 'down':
        headStub = [0, -1, 0];
        directionalSound = 'SnakeSideways'
        break;

      case 'left':
        headStub = [-1, 0, 0];
        directionalSound = 'SnakeSideways'
        break;

      case 'right':
        headStub = [1, 0, 0];
        directionalSound = 'SnakeSideways'
        break;

      case 'out':
        headStub = [0, 0, 1];
        directionalSound = 'SnakeOut'
        break;

      case 'in':
        headStub = [0, 0, -1];
        directionalSound = 'SnakeIn'
        break;
    }

    // add the new head position
    this.head = util.addNodes( this.head, headStub);
    this.nodes.push( this.head );

    // Check if the snake crashed
    let crashed = this._didSnakeCrash();

    // extend the snake if necessary
    if ( this.extensions === 0 ) {
      // remove node from tail of snake
      this.nodes.shift();
    } else {
      this.extensions--;
    }

    if ( !this.options.noSound ) {
      if ( crashed ) {
        audioEngine.trigger( 'SnakeCrash' );
      } else {
        audioEngine.trigger( directionalSound );
      }
    }

    // return the nodes
    return this.nodes;
  }

}

export default Snake;
