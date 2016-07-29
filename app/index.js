// var _ = require('underscore');
var EventEmitter = require('events');

console.log('Welcome to snak3');





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



