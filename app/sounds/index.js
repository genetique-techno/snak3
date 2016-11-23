module.exports = {
  SnakeSideways: require('./Snake').normal,
  SnakeOut: require('./Snake').high,
  SnakeIn: require('./Snake').low,
  SnakeCrash: require('./Snake').crash,

  LevelUp: require('./LevelUp'),

  MenuChange: require('./Menu').change,
  MenuAccept: require('./Menu').accept,
};
