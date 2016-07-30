import "babel-polyfill";

var Game = require('./Classes/Game');


console.log('Welcome to snak3!');

var game = new Game([5, 5, 1]);

game.getState();

game.changeDirection('up');
game.tick();
game.tick();
game.changeDirection('right');
game.tick();
game.tick();
game.changeDirection('down');
game.tick();
game.tick();
game.tick();
