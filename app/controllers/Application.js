
import stateManager from 'app/controllers/stateManager.js';
import stateMappings from 'app/config/stateMappings.js';

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

    let bloomOptions = {
      resolutionScale: 0.2,
      blurriness: 0,
      strength: 1.0,
      distinction: 1.4
    };
    this.bloomPass = new THREE.BloomPass( bloomOptions );
    this.bloomPass.setSize( this.width, this.height );

    this.composer = new THREE.EffectComposer( this.renderer );

    this.clock = new THREE.Clock();

    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.render();

    stateManager.on( 'newApplicationState', this.setApplicationView.bind( this ) );
    // stateManager.on( 'newGameTypeState', null );
    stateManager.on( 'newOverlayState', this.setOverlayView.bind( this ) );

    stateManager.emitCurrentState();
  }

  setApplicationView( state ) {

    if ( this.mainPass && this.mainPass.unloader ) {
      this.mainPass.unloader();
      window.setTimeout(() => {
        this.mainPass = new stateMappings.mainPasses[ state[ 'mainPass' ] ]( state[ 'gameType' ] );
        this.mainPass.setSize( this.width, this.height );
        this.overlayPass = new stateMappings.overlays[ state[ 'overlay' ] ]();
        this.overlayPass.setSize( this.width, this.height );

        this.composer.passes[0] = this.mainPass.renderPass;
        this.composer.passes[1] = this.bloomPass;
        this.composer.passes[2] = this.overlayPass;
      }, 2000 );
    } else {
      this.mainPass = new stateMappings.mainPasses[ state[ 'mainPass' ] ]( state[ 'gameType' ] );
      this.mainPass.setSize( this.width, this.height );
      this.overlayPass = new stateMappings.overlays[ state[ 'overlay' ] ]();
      this.overlayPass.setSize( this.width, this.height );

      this.composer.passes[0] = this.mainPass.renderPass;
      this.composer.passes[1] = this.bloomPass;
      this.composer.passes[2] = this.overlayPass;      
    }

  }

  setOverlayView( state ) {
    //noop
  }


  render() {
    
    let delta = this.clock.getDelta();

    this.composer.render(delta);

    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();
  }

}

export default Application;
