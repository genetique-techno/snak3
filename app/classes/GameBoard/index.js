class GameBoard {
  constructor( [x, y, z] ) {
    this.limits = [x-1, y-1, z-1];
    this.level = 0;
    this.levelUpPosition = this._getRandomStartLevelUp();
  }

  levelUp(avoidNodes) {  // pass in all nodes of the snake so they won't be randomly generated on
    this.levelUpPosition = this._getRandomStartLevelUp(avoidNodes);
    console.log(levelUpPosition);
    this.level++;
    return this.levelUpPosition;
  }

  _getRandomStartLevelUp(avoid) {
    avoid = avoid ? avoid.map( function(item) {
      return item.join('');
    }) : [ -1, -1, -1];
    var rnd;

    do {
      rnd = [
        Math.floor( Math.random() * this.limits[0] ),
        Math.floor( Math.random() * this.limits[1] ),
        Math.floor( Math.random() * this.limits[2] )
      ];
    } while ( avoid.indexOf( rnd.join('') ) !== -1 )
    return rnd;
  }
}

module.exports = GameBoard;
