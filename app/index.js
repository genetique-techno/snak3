import "babel-polyfill";
import 'app/styles/styles.less';
import Application from 'app/controllers/Application.js';

console.log('Welcome to snak3!');

window.__GAME_DIV__ = document.getElementById( 'app' );

var app = new Application();
