var util = require('../../util');

class Snake {

  constructor( [initX, initY, initZ] ) {

    this.head = [initX, initY, initZ];
    this.direction = null;
    this.nodes = [ [initX, initY, initZ] ];
    this.extensionsTicks = 0;
  }

  _changeDirection( newDir ) {

    if ( newDir === this.direction ) { return null; }
    this.direction = newDir;
    return this.direction;
  }

  setExtensionsTicks( val ) {
    this.extensionsTicks = val;
    console.log('Extended! by', val);
  }

  _tick() {
    var headStub = [0, 0, 0];

    switch ( this.direction ) {

      case 'up':
        headStub = [0, -1, 0];
        break;

      case 'down':
        headStub = [0, 1, 0];
        break;

      case 'left':
        headStub = [-1, 0, 0];
        break;

      case 'right':
        headStub = [1, 0, 0];
        break;

      case 'in':
        headStub = [0, 0, 1];
        break;

      case 'out':
        headStub = [0, 0, -1];
        break;
      default:
    }

    // add the new head position
    this.head = util.addNodes( this.head, headStub);
    this.nodes.push( this.head );
    // extend the snake if necessary
    if ( this.extensionsTicks === 0 ) {
      // remove node from tail of snake
      this.nodes.shift();
    } else {
      this.extensionsTicks--;
    }
    // return the nodes
    return this.nodes; 
  }
}

module.exports = Snake;
