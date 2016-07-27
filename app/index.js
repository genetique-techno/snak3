// var _ = require('underscore');
var EventEmitter = require('events');

console.log('Welcome to snak3');

class GameBoard {
	constructor( [x, y, z] ) {
		this.limits = [x, y, z];
	}
}


class Snake {

	constructor( [initX, initY, initZ] ) {

		this.head = [initX, initY, initZ];
		this.direction = null;
		this.nodes = [ [initX, initY, initZ] ];
		this.extensionPasses = 0;

		this.board = new GameBoard( [3, 3, 3] );

		// add an event listener for the tick event
		this.eventer = new EventEmitter();
		this.eventer.addListener( 'tick', this.tick.bind( this ) );
		this.eventer.addListener( 'dir', this.changeDirection.bind( this ) );
		this.eventer.addListener( 'extend', this.setExtensionPasses.bind( this ) );
	}

	changeDirection( newDir ) {

		if ( newDir === this.direction ) { return null; }
		this.direction = newDir;

	}

	setExtensionPasses( val ) {
		this.extensionPasses = val;
		console.log('Extended! by', val);
	}

	tick() {
		var headStub = [0, 0, 0];

		function addPositions( a, b ) {
			return [ a[0]+b[0], a[1]+b[1], a[2]+b[2] ];
		}

		function checkHeadCrash(arr) {
			return (arr[0] < 0 || arr[0] > this.board.limits[0] ||
					arr[1] < 0 || arr[1] > this.board.limits[1] ||
					arr[2] < 0 || arr[2] > this.board.limits[2]);
		}

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
			default:
		}


		// check current position against board limits
		var newHead = addPositions( this.head, headStub );
		if ( checkHeadCrash.bind( this )( newHead ) ) {
			// crashed
			// remove the event listener
			this.eventer.removeListener( 'tick', this.tick.bind( this ) );
			this.eventer.removeListener( 'dir', this.changeDirection.bind( this ) );
			console.log(' CRASH! you hit the edge at', newHead);
			console.log( 'all nodes', this.nodes );

		} else {
			// no crash
			this.nodes.push( addPositions( this.head, headStub ) );
			this.head = this.nodes[this.nodes.length-1];
			if ( !this.extensionPasses ) {
				this.nodes.shift();
			} else {
				this.extensionPasses--;
			}
			// current position
			console.log( 'head', this.head, 'tail', this.nodes[0] );
		}

	}

}


var snake = new Snake([0, 0, 0]);
console.log('head', snake.head);
snake.eventer.emit( 'dir', 'down' );
snake.eventer.emit( 'tick' );
snake.eventer.emit( 'extend', 2 );
snake.eventer.emit( 'tick' );
snake.eventer.emit( 'dir', 'right' );
snake.eventer.emit( 'tick' );
snake.eventer.emit( 'tick' );
snake.eventer.emit( 'tick' );
snake.eventer.emit( 'tick' );



