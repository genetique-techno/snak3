import _ from 'underscore';
import Game from 'app/classes/Game';
import Renderer from 'app/classes/Renderer';

export default class Manager {

  constructor() {

    let app = document.getElementById( 'app' );
    this.renderer = new Renderer( app );
    this.renderer.appendToDom( app );
    this.renderer.addFog({ new: 300, far: 800 });
    this.renderer.addGrid({
      size: 100,
      step: 100
    });
  }

  newGame( gameSize ) {
    this.game = new Game( gameSize );
    this.renderer.setBoundaryCubes( this.game.gameBoard.limits, {
      color: '#33aacc'
    });
    this.renderer.setNodeCubes( this.game.snake.nodes, {
      color: '#55ff22'
    });

    this.renderer.highlightBoundaryCubes( this.game.snake.head, { color: "#33aacc" } );

    this.renderer.setLevelUpPosition( this.game.gameBoard.levelUpPosition );

    this.renderer.setCameraPosition( this.game.gameBoard.limits, this.game.snake.head );

    this.renderer.render();

    window.addEventListener( 'keydown', this.keyChecker.bind( this ) );
    
    this.game.on( 'gameOver', () => {
      window.removeEventListener( 'keyDown', this.keyChecker.bind( this ) );
      window.clearInterval( this.ticker );
    });
  }

  keyChecker(e) {
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

    if (e.keyCode === 84) {
      // this.gameTick();
      this.ticker = window.setInterval( this.gameTick.bind( this ), 500 );
    }
  }

  gameTick() {
    this.game.tick();
    this.renderer.setNodeCubes( this.game.snake.nodes, {
      color: '#55ff22'
    });
    this.renderer.highlightBoundaryCubes( this.game.snake.head, { color: "#33aacc" } );
    this.renderer.setLevelUpPosition( this.game.gameBoard.levelUpPosition );
    this.renderer.setCameraPosition( this.game.gameBoard.limits, this.game.snake.head );
  }
}
