import _ from 'underscore';
import Game from 'app/classes/Game';
import Menu from 'app/classes/Menu';
import Renderer from 'app/classes/Renderer';

import TitlePass from 'app/classes/Passes/TitlePass.js';
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
    this.renderer.setMainPass( new TitlePass({}) );

    this.renderer.setOverlayPass( new MenuOverlay( this.menu ) );

    this.menu.on( 'acceptSelection', ( gameBoard ) => {
      console.log('menu accepted');
      this.newGame( gameBoard );

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
}
