
import stateManager from 'app/controllers/stateManager.js';
import stateMappings from 'app/config/stateMappings.js';
import passRegistry from 'app/controllers/passRegistry.js';
import _ from 'underscore';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/ConvolutionShader.js' );

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/BloomPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/ShaderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/TexturePass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/RGBShiftShader.js' );

import { vertShader, fragShader } from 'app/shaders/FXAA.js';

class Application {

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.__GAME_DIV__.clientWidth;
    this.height = window.__GAME_DIV__.clientHeight;
    this.renderer.setSize( this.width, this.height );
    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.composer = new THREE.EffectComposer( this.renderer, this.renderTarget );
    this.clock = new THREE.Clock();

    const funcSetApplicationView = this.setApplicationView.bind( this );
    stateManager.on( 'newApplicationState', funcSetApplicationView );
    stateManager.emitCurrentState();

    this.render();

    this.resize = this.resize.bind( this );
    window.addEventListener( "resize", _.throttle( this.resize, 200 ), false );
  }

  resize(e) {

    this.width = window.__GAME_DIV__.clientWidth;
    this.height = window.__GAME_DIV__.clientHeight;

    this.renderer.setSize( this.width, this.height );
    this.composer.setSize( this.width, this.height );

    passRegistry.resizeAll( this.width, this.height );

  }

  setApplicationView( state ) {

    this.composer.passes = [];
    this.mainPass = new stateMappings.mainPasses[ state.mainPass ]( this.composer, state );

  }

  render() {
    window.requestAnimationFrame( this.render.bind( this ) );

    let delta = this.clock.getDelta();

    this.composer.render(delta);

    TWEEN.update();
  }

}

export default Application;
