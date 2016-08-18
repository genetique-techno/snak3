class GameBoard {
  constructor( { limits, difficulty } ) {
    this.limits = limits;
    this.level = 0;
    this.levelUpPosition = this._getRandomPositionExceptNodes();

    switch ( difficulty ) {
      case 'easy': 
        this._setEasyOptions();
        break;
    }

    return this;
  }

  _setEasyOptions() {
    
    this.boundaryCubeOptions = {
      color: "#33aacc"
    };
    
    this.cubeOptions = {
      color: "#55ff22"
    };

  }

  levelUp(avoidNodes) {  // pass in all nodes of the snake so they won't be randomly generated on
    this.levelUpPosition = this._getRandomPositionExceptNodes(avoidNodes);
    this.level++;
  }

  _getRandomPositionExceptNodes(avoid) {
    avoid = avoid ? avoid.map( function(item) {
      return item.join('$');
    }) : [ -1, -1, -1];
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * this.limits[0] ),
        Math.floor( Math.random() * this.limits[1] ),
        Math.floor( Math.random() * this.limits[2] )
      ];
    } while ( avoid.indexOf( rnd.join('$') ) !== -1 )
    return rnd;
  }
}

export default GameBoard;
