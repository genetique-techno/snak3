import _ from 'underscore';
import Game from 'app/classes/Game';
import GameBoard from 'app/classes/GameBoard';
import Menu from 'app/classes/Menu';
import Renderer from 'app/classes/Renderer';

import GamePass from 'app/classes/Passes/GamePass.js';

import MenuOverlay from 'app/classes/Overlays/MenuOverlay.js';

window.__GAME_DIV__ = document.getElementById( 'app' );

export default class Manager {

  constructor() {
    this.view = 'menu';
    this.renderer = new Renderer();

    this.newMenu();
  }

  newMenu() {
    this.menu = new Menu();
    // this.renderer.setMainPass( new TitlePass({}) );

    window.setTimeout(() => {
      // this.renderer.setOverlayPass( new MenuOverlay( this.menu ) );
      console.log(this.renderer.composer);
    }, 5200);

    this.menu.on( 'acceptSelection', ( item ) => {
      console.log('menu accepted');
      switch ( item.type ) {
        case 'game':
          this.newGame( new GameBoard( item ) );
          break;
        case 'other':
          this[item.func]();
      }

    });
  }

  newGame( gameBoard ) {    

    this.game = new Game( gameBoard );
    this.renderer.setMainPass( new GamePass({
      limits: gameBoard.limits,
      nodes: this.game.snake.nodes,
      headNode: this.game.snake.head,
      initLevelUpPos: gameBoard.levelUpPosition,
      cubeOptions: gameBoard.cubeOptions,
      boundaryCubeOptions: gameBoard.boundaryCubeOptions,
      emitter: this.game
    }) );
    this.renderer.setOverlayPass();
    

    this.view = 'game';
  }

  newInstructions() {
    console.log('new instructions called');
  }

  newHighScores() {
    console.log('new high scores called');
  }
}
