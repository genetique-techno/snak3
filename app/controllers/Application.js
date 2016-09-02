
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
    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.composer = new THREE.EffectComposer( this.renderer );
    this.clock = new THREE.Clock();

    let bloomOptions = {
      resolutionScale: 0.2,
      blurriness: 0,
      strength: 1.0,
      distinction: 1.4
    };
    this.bloomPass = new THREE.BloomPass( bloomOptions );
    this.bloomPass.renderToScreen = true;
    this.bloomPass.setSize( this.width, this.height );

    stateManager.on( 'newApplicationState', this.setApplicationView.bind( this ) );
    stateManager.emitCurrentState();

    this.render();
  }

  setApplicationView( state ) {
    let delay = 0;

    if ( state.mainPass.change ) {
      if ( this.mainPass && this.mainPass.unloader ) {
        this.mainPass.unloader();
        delay = 2000;
      }

      window.setTimeout(() => {
        this.setMainPass( state );
        this.setOverlayPass( state );
      }, delay );
    } else if ( state.overlayPass.change ) {
      this.setOverlayPass( state );
    }
  }

  setMainPass( state ) {
    this.mainPass = new stateMappings.mainPasses[ state.mainPass.value ]( state.gameType );
    this.composer.passes[0] = this.mainPass.renderPass;
    this.composer.passes[1] = this.bloomPass;
  }

  setOverlayPass( state ) {
    if ( stateMappings.overlays[ state.overlayPass.value ] ) {
      this.overlayPass = new stateMappings.overlays[ state.overlayPass.value ]();
      this.composer.passes[2] = this.overlayPass.renderPass;
    } else if ( this.composer.passes[2] ) {
      this.composer.passes[2].enabled = false;
    }
  }


  render() {
    
    let delta = this.clock.getDelta();

    this.composer.render(delta);
    // this.renderer.render( this.mainPass.scene, this.mainPass.camera );

    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();
  }

}

export default Application;
