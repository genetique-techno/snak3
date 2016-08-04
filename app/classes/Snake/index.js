import util from 'app/util';

class Snake {

  constructor( [initX, initY, initZ] ) {

    this.head = [initX, initY, initZ];
    this.direction = null;
    this.nodes = [ [initX, initY, initZ] ];
    this.extensionTicks = 0;
    this.directionQueue = [];
  }

  _changeDirection( newDir ) {
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

  setExtensionTicks( val ) {
    this.extensionTicks = this.extensionTicks + val;
    console.log('Extended! by', val);
  }

  _tick() {
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
      default:
    }

    // add the new head position
    this.head = util.addNodes( this.head, headStub);
    this.nodes.push( this.head );
    // extend the snake if necessary
    if ( this.extensionTicks === 0 ) {
      // remove node from tail of snake
      this.nodes.shift();
    } else {
      this.extensionTicks--;
    }
    // return the nodes
    return this.nodes; 
  }
}

export default Snake;
