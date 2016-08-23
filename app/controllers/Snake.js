import util from 'app/util';
import EventEmitter from 'events';

class Snake extends EventEmitter {

  constructor( limits ) {
    super();

    this.limits = limits;
    this.head = this._getStartingHead( limits );
    this.direction = null;
    this.nodes = [ this.head ];
    this.extensions = 0;

  }

  _getStartingHead( avoid ) {

    avoid = avoid.join('$');
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * (avoid[0] - 1) ),
        Math.floor( Math.random() * (avoid[1] - 1) ),
        Math.floor( Math.random() * (avoid[2] - 1) )
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

    // Check if crashed into floor, wall, or ceiling
    } else if (
        (head[0] < 0 || head[0] > this.limits[0] - 1)
        || (head[1] < 0 || head[1] > this.limits[1] - 1)
        || (head[2] < 0 || head[2] > this.limits[2] - 1)
    ) {

      this.emit( 'gameOver', {
        reason: 'crashed into the wall, floor, or ceiling'
      } );

    }
  }


  changeDirection( code ) {

    let newDir = util.keyToAction[ code ];

    if (this.nodes.length === 1) { return this.direction = newDir };
    
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
      this.direction = newDir;
    }

  }

  extendBy( val ) {
    // push the new extensions, don't replace them if they are still being popped
    this.extensions = this.extensions + val;
  }

  advance() {
    var headStub = [0, 0, 0];

    switch ( this.direction ) {

      case 'up':
        headStub = [0, 1, 0];
        break;

      case 'down':
        headStub = [0, -1, 0];
        break;

      case 'left':
        headStub = [-1, 0, 0];
        break;

      case 'right':
        headStub = [1, 0, 0];
        break;

      case 'out':
        headStub = [0, 0, 1];
        break;

      case 'in':
        headStub = [0, 0, -1];
        break;
    }

    // add the new head position
    this.head = util.addNodes( this.head, headStub);
    this.nodes.push( this.head );

    // Check if the snake crashed
    this._didSnakeCrash()
    
    // extend the snake if necessary
    if ( this.extensions === 0 ) {
      // remove node from tail of snake
      this.nodes.shift();
    } else {
      this.extensions--;
    }
    
    // return the nodes
    return this.nodes; 
  }

}

export default Snake;
