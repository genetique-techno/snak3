class GameBoard {
  constructor( { limits, difficulty, interval } ) {
    this.limits = limits;
    this.difficulty = difficulty;
    this.interval = interval;
    this.level = 0;
    this.levelUpPosition = this._getRandomPositionExceptNodes();

    this['_'+difficulty+'Options']();

    return this;
  }

  _easyOptions() {
    this.boundaryCubeOptions = {
      color: "#33aacc"
    };
    
    this.cubeOptions = {
      color: "#55ff22"
    };
  }
  _mediumOptions() {
    this.boundaryCubeOptions = {
      color: "#33aacc"
    };
    
    this.cubeOptions = {
      color: "#55ff22"
    };
  }
  _hardOptions() {
    this.boundaryCubeOptions = {
      color: "#33aacc"
    };
    
    this.cubeOptions = {
      color: "#55ff22"
    };
  }
  _impossibleOptions() {
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
