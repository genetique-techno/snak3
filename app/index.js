import "babel-polyfill";
import Manager from 'app/classes/Manager';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

const gameOptions = {
  gameSize: [ 10, 10, 3 ],
  // cubeColor: '#ff2300',
  // boundaryColor: '#ee2399'
};

let manager = new Manager();

manager.newGame( gameOptions );

