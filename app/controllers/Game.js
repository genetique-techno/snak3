import 'app/util';
import EventEmitter from 'events';

import Snake from 'app/controllers/Snake';

class Game extends EventEmitter {

  constructor( gameType ) {
    super();

    util.assignKeys.call( this, gameType );
    
    this.level = 0;
    this.status = 'ready';
    this._levelUpPosition;
    this._ticker;
    this._snake = new Snake( this.limits );

    // game over listener
    this._snake.on( 'gameOver', this.endGame.bind( this ) );

    // keydown listener
    this._keyListener.on( 'keydown', this.processKey.bind( this ) );

  }

  _keyListener(e) {

    switch ( this.status ) {
      case 'ready':
        this.ticker = this.ticker || window.setInterval(() => {
          this.tick();
          this.status = 'live';
        }, this.interval );
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
        }
        break;

      case 'paused':
        // paused keys
        break;

      case false:
        // gameover keys
        break;

    }

  }


  levelUp() {
    let avoid = this._snake.nodes;
    let rnd;

    avoid.map( function( item ) {
      return item.join('$');
    }) : [ -1, -1, -1];

    do {
      rnd = [
        Math.floor( Math.random() * this.limits[0] ),
        Math.floor( Math.random() * this.limits[1] ),
        Math.floor( Math.random() * this.limits[2] )
      ];
    } while ( avoid.indexOf( rnd.join('$') ) !== -1 )

    this.level++;
    this._snake.extendBy( this.level );

    return rnd;
  }

  tick() {

    if ( !this.status ) { 
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

  }

  endGame( p ) {

    console.log( `GameOver: ${p.reason}` );
    window.clearTimeout( this.ticker );
    this.status = false;
    
  }

}

export default Game;
