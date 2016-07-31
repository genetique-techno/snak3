import "babel-polyfill";
import _ from 'underscore';
import Game from 'app/classes/Game';
import Renderer from 'app/classes/Renderer';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

let game = new Game([5, 5, 1]);
let app = document.getElementById('app');
let renderer = new Renderer( app );

renderer.appendToDom( app );
renderer.addFog();
renderer.addGrid();
renderer.setCameraPosition({ pos: [0, 100, 100], lookAt: [0, 0, 0] });
renderer.render();

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
    game.changeDirection(keyCode);
  }

  if (e.keyCode === 84) {
    game.tick();
  }
}

window.addEventListener('keydown', keyChecker);
