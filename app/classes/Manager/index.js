import _ from 'underscore';
import Game from 'app/classes/Game';
import Renderer from 'app/classes/Renderer';

import GamePass from 'app/classes/Passes/GamePass.js';

window.__GAME_DIV__ = document.getElementById( 'app' );

export default class Manager {

  constructor() {
    this.view = 'menu';
    this.renderer = new Renderer();
    window.addEventListener( 'keydown', this.keyChecker.bind( this ) );
  }

  newGame( options = {} ) {    
    options = _.defaults( options, {
      gameSize: [10, 10, 3],
      boundaryColor: "#33aacc",
      cubeColor: "#55ff22"
    });

    this.gameSize = options.gameSize;
    
    this.boundaryCubeOptions = {
      color: options.boundaryColor
    };
    
    this.cubeOptions = {
      color: options.cubeColor
    };

    this.game = new Game( this.gameSize );
    this.renderer.setMainPass( new GamePass({
      limits: this.game.gameBoard.limits,
      nodes: this.game.snake.nodes,
      headNode: this.game.snake.head,
      initLevelUpPos: this.game.gameBoard.levelUpPosition,
      cubeOptions: this.cubeOptions,
      boundaryCubeOptions: this.boundaryCubeOptions,
      emitter: this.game
    }) );
    
    this.game.on( 'gameOver', () => {
      window.removeEventListener( 'keyDown', this.keyChecker.bind( this ) );
      window.clearInterval( this.ticker );
    });

    this.ticker = null;
    this.view = 'game';
  }

  keyChecker(e) {
    if ( this.view === 'menu' ) {

      // key bindings when in menu mode
          let keyCode = _.result({
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down',
            '16': 'in',
            '17': 'out'
          }, e.keyCode, null);
          
          if (keyCode) {
            this.game.changeDirection(keyCode);
          }

    } else if ( this.view === 'game' ) {

      // key bindings when in game mode
      switch ( this.game.status ) {
        case 'ready':
          this.ticker = this.ticker || window.setInterval( this.game.tick.bind( this.game ), 500 );
        case true:
          let keyCode = _.result({
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down',
            '16': 'in',
            '17': 'out'
          }, e.keyCode, null);
          
          if (keyCode) {
            this.game.changeDirection(keyCode);
          }
        case false:
          console.log(e);        
      }
    }
  }
}
