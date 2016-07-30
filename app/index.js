import "babel-polyfill";
import _ from 'underscore';
import Game from 'app/classes/Game';

console.log('Welcome to snak3!');

window.game = new Game([5, 5, 1]); // Don't use window normally, just testing playability


game.getState();

function keyChecker(e) {
  let keyCode = _.result({
    '37': 'left',
    '38': 'up',
    '39': 'right',
    '40': 'down',
    '16': 'in',
    '17': 'out'
  }, e.keyCode, null);
  
  if (keyCode) {
    window.game.changeDirection(keyCode);
  }

  if (e.keyCode === 84) {
    window.game.tick();
  }
}

window.addEventListener('keydown', keyChecker);

/*
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
*/
