import "babel-polyfill";
import Manager from 'app/classes/Manager';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

const gameSize = [ 10, 10, 1 ];

let manager = new Manager();

manager.newGame( gameSize );

