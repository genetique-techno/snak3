class GameBoard {
  constructor( [x, y, z] ) {
    this.limits = [x, y, z];
    this.level = 0;
    this.levelUpPosition = this._getRandomPositionExceptNodes();
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
