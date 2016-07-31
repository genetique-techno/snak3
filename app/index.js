import "babel-polyfill";
import _ from 'underscore';
import Game from 'app/classes/Game';
import Renderer from 'app/classes/Renderer';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

const gameSize = [ 10, 10, 1 ];




let game = new Game( gameSize );
let app = document.getElementById('app');
let renderer = new Renderer( app );

renderer.appendToDom( app );
renderer.addFog({ near: 300, far: 800 });
renderer.addGrid({
  size: 100,
  step: 100
});
renderer.setBoundaryCubes( game.gameBoard.limits, {
  color: '#33aacc'
});
renderer.setNodeCubes( game.snake.nodes, {
  color: '#55ff22'
});
renderer.setLevelUpPosition( game.gameBoard.levelUpPosition );


renderer.setCameraPosition({ 
  pos: [
    gameSize[0]/2, 
    gameSize[1]/2, 
    _.max(gameSize)
  ],
  lookAt: [
    gameSize[0]/2, 
    gameSize[1]/2, 
    0
  ] 
});

renderer.render();

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
    window.setInterval( gameTick, 500 );
  }
}

function gameTick() {
  game.tick();
  renderer.setNodeCubes( game.snake.nodes, {
    color: '#55ff22'
  });
  renderer.setLevelUpPosition( game.gameBoard.levelUpPosition );  
}

window.addEventListener('keydown', keyChecker);
