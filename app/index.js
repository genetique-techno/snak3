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
renderer.addFog({ near: 300, far: 800 });
renderer.addGrid({
  size: 100,
  step: 100
});

renderer.addCube({
  pos: [0, 0, 0],
  color: '#3bbb00',
  scale: 2
});

function keyAdd() {  
  renderer.addCube({
    pos: [2, 0, 0],
    color: '#3bbb00',
    scale: 2
  });
  console.log(renderer.scene.children);
}

renderer.setCameraPosition({ pos: [0, 20, 20], lookAt: [0, 0, 0] });
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
    keyAdd();
  }

  if (e.keyCode === 84) {
    game.tick();
  }
}

window.addEventListener('keydown', keyChecker);
