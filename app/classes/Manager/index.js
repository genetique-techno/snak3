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

    // this.renderer.setBoundaryCubes( this.game.gameBoard.limits, { color: this.boundaryColor });
    // this.renderer.setNodeCubes( this.game.snake.nodes, { color: this.cubeColor });
    // this.renderer.highlightBoundaryCubes( this.game.snake.head, { color: this.boundaryColor } );
    // this.renderer.setLevelUpPosition( this.game.gameBoard.levelUpPosition );
    // this.renderer.setCameraPosition( this.game.gameBoard.limits, this.game.snake.head );
    this.renderer.initializeGame(
      this.game.gameBoard.limits,
      this.game.snake.nodes,
      this.game.snake.head,
      this.game.gameBoard.levelUpPosition,
      this.cubeOptions,
      this.boundaryCubeOptions
    );

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
      this.ticker = window.setInterval( this.tick.bind( this ), 500 );
    }
  }

  tick() {
    this.game.tick();
    this.renderer.tick( this.game.snake.nodes, this.game.snake.head, this.game.gameBoard.levelUpPosition );
  }
}
