
import stateManager from 'app/controllers/stateManager.js';


require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/ConvolutionShader.js' );

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/BloomPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/ShaderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/TexturePass.js' );


class Application {

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.__GAME_DIV__.clientWidth;
    this.height = window.__GAME_DIV__.clientHeight;

    this.renderer.setSize( this.width, this.height );

    this.bloomOptions = {
      resolutionScale: 0.2,
      blurriness: 0,
      strength: 1.0,
      distinction: 1.4
    };

    this.composer = new THREE.EffectComposer( this.renderer );

    this.clock = new THREE.Clock();

    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.render();

    stateManager.on( 'newApplicationState', this.setApplicationView.bind( this ) );
    stateManager.on( 'newGameTypeState', null );
    stateManager.on( 'newOverlayState', this.setOverlayView.bind( this ) );

  }


  render() {
    
    let delta = this.clock.getDelta();

    this.titleComposer.render( delta );

    this.composer.render(delta);

    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();
  }

}

export default Application;
