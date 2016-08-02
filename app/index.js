import "babel-polyfill";
import Manager from 'app/classes/Manager';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

const gameOptions = {
  gameSize: [ 10, 10, 8 ]
};

let manager = new Manager();

manager.newGame( gameOptions );

