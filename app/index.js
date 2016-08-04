import "babel-polyfill";
import Manager from 'app/classes/Manager';

import 'app/styles/styles.less';

console.log('Welcome to snak3!');

const gameOptions = {
  gameSize: [ 10, 10, 3 ],
  // cubeColor: '#7B85AD',
  // boundaryColor: '#172457'
};

let manager = new Manager();

manager.newGame( gameOptions );


// window.addEventListener( 'keydown', function(e) {
//   if ( e.keyCode === '78' ) {
//     manager.newGame( gameOptions );
//   }
// });

