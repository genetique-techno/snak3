
class GameBoard {
  constructor( { limits, difficulty, interval, colors } ) {
    this.limits = limits;
    this.difficulty = difficulty;
    this.interval = interval;
    this.level = 0;
    this.levelUpPosition = this._getRandomPositionExceptNodes();
    this.boundaryCubeOptions = {
      color: colors.boundaryCubes
    };
    this.cubeOptions = {
      color: colors.cubes
    }

    return this;
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
