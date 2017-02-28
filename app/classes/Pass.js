import EventEmitter from 'events';
import _ from 'underscore';
import passRegistry from 'app/controllers/passRegistry';
import stateManager from 'app/controllers/stateManager';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

export default class Pass extends EventEmitter {

  constructor( composer ) {
    super();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000 );

    const renderPass = new THREE.RenderPass( this.scene, this.camera );
    renderPass.renderToScreen = true;
    renderPass.setSize( window.__GAME_DIV__.width, window.__GAME_DIV__.height );
    this.renderPass = renderPass;

    composer.passes = [];
    composer.passes[0] = this.renderPass;
    passRegistry.register( this );
    this.composer = composer;

  }

  loader() {
    console.log( "Pass Error: This pass has not implemented a loader" );
  }

  unloader() {
    console.log( "Pass Warning: This pass has not implemented an unloader" );
  }


  unload( newState ) {

    if ( !newState ) return console.log( "newState is not valid, cannot unload" );

    passRegistry.removeAll();
    stateManager.setNewApplicationState( newState );
  }
};


/*

ABSTRACT OUT THE COMPOSER PASS BULLSHIT AND MAKE IT NOT SUCK

*/
