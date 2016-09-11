import 'app/util';
import EventEmitter from 'events';
import util from 'app/util';
import stateManager from 'app/controllers/stateManager.js';
import _ from 'underscore';

import Snake from 'app/controllers/Snake';

function keyListener(e) {

  switch ( this.gameStatus ) {

    case 'ready':
      if ( [
          'ArrowUp', 
          'ArrowDown', 
          'ArrowRight', 
          'ArrowLeft',
          'ShiftLeft',
          'ControlLeft'
      ].indexOf( e.code ) !== -1 ) {
        this._snake.changeDirection( e.code );
        this.ticker = this.ticker || window.setInterval(() => {
          this.gameStatus = 'live';
          this.tick();
        }, this.interval );
      }
      break;

    case 'live':
      if ( [
          'ArrowUp', 
          'ArrowDown', 
          'ArrowRight', 
          'ArrowLeft',
          'ShiftLeft',
          'ControlLeft'
      ].indexOf( e.code ) !== -1 ) {
        this._snake.changeDirection( e.code );
      } else if ( e.code === 'KeyP' ) {
        // this.pauseGame;
        console.log('p was pressed');
        // set state: new overlay: pauseOverlay
      }
      break;
    default:

  }
}

class Game extends EventEmitter {

  constructor( gameType ) {
    super();

    util.assignKeys.call( this, gameType );
    
    this.level = 0;
    this.score = 0;
    this.gameStatus = 'ready';
    this._ticker;
    this._snake = new Snake( this.limits );

    // game over listener
    this._snake.on( 'gameOver', this.endGame.bind( this ) );

    this.keyListener = keyListener.bind( this );
    window.addEventListener( 'keydown', this.keyListener );
    let dontExtendSnake = true;
    this.levelUp( dontExtendSnake );
    console.log(this.gameStatus);
  }



  levelUp( initialBool ) {
    let avoid = this._snake.nodes;
    let rnd;

    avoid.map( function( item ) {
      return item.join('$');
    });

    do {
      rnd = [
        Math.floor( Math.random() * this.limits[0] ),
        Math.floor( Math.random() * this.limits[1] ),
        Math.floor( Math.random() * this.limits[2] )
      ];
    } while ( avoid.indexOf( rnd.join('$') ) !== -1 )

    if ( !initialBool ) {
      this.level++;
      this._snake.extendBy( this.level );
    }

    this.levelUpPosition = rnd;
  }

  tick() {

    if ( this.gameStatus === 'gameOver' ) { 
      return null;
    }

    this._snake.advance();

    if (this._snake.head.join('$') === this.levelUpPosition.join('$')) {
      this.levelUp();
    }

    this.emit( 'tick', {
      nodes: this._snake.nodes,
      head: this._snake.head,
      levelUpPosition: this.levelUpPosition
    });

    if ( this._snake.extensions ) {
      this.score++;
      console.log( this.score );
    }

  }

  endGame( p ) {

    console.log( `GameOver: ${p.reason}` );
    window.clearTimeout( this.ticker );
    this.gameStatus = 'gameOver';
    window.removeEventListener( 'keydown', this.keyListener );
    stateManager.setNewApplicationState({
      mainPass: {
        change: false,
        delay: false,
        value: 'gamePass'        
      },
      overlayPass: {
        change: true,
        delay: 1000,
        value: 'gameOverOverlay'
      }
    });

  }

}

export default Game;
