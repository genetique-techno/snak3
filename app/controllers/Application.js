
import stateManager from 'app/controllers/stateManager.js';
import stateMappings from 'app/config/stateMappings.js';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/ConvolutionShader.js' );

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/BloomPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/ShaderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/TexturePass.js' );


const _main_ = 0;
const _overlay_ = 2;
const _effect1_ = 1;
const _effect2_ = 3;


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
    // this.bloomPass.renderToScreen = true;
    this.bloomPass.setSize( this.width, this.height );

    stateManager.on( 'newApplicationState', this.setApplicationView.bind( this ) );
    stateManager.emitCurrentState();

    this.render();
  }

  setApplicationView( state ) {
    let delay = 0;

    // Things to do only if there's a mainPass change
    if ( state.mainPass.change ) {

      // If there's a mainPass unloader, execute it and add some more delay
      if ( this.mainPass && this.mainPass.unloader ) {
        this.mainPass.unloader();
        delay = 2000;

        if ( this.overlayPass && this.overlayPass.unloader ) {
          this.overlayPass.unloader();
        }
      }

      // This timer takes care of unloader delay
      window.setTimeout(() => {
        this.setMainPass( state );

        // This timer accounts for overlayPass delay
        window.setTimeout(() => {
          this.setOverlayPass( state );
        }, state.overlayPass.delay || 0);

      }, delay );
    } else if ( state.overlayPass.change ) {

      if ( this.overlayPass && this.overlayPass.unloader ) {
        this.overlayPass.unloader();
      }

      // Set the overlayPass if there's no change in mainPass
      window.setTimeout(() => {
        this.setOverlayPass( state );
      }, state.overlayPass.delay );

    }

  }

  setMainPass( state ) {
    this.mainPass = new stateMappings.mainPasses[ state.mainPass.value ]( state.gameType );
    this.composer.passes[_main_] = this.mainPass.renderPass;
    this.setEffects();
  }

  setEffects() {
    this.composer.passes[_effect1_] = this.bloomPass;
  }

  setOverlayPass( state ) {
    if ( stateMappings.overlays[ state.overlayPass.value ] ) {
      this.overlayPass = new stateMappings.overlays[ state.overlayPass.value ]();
      this.composer.passes[_overlay_] = this.overlayPass.renderPass;
    } else if ( this.composer.passes[_overlay_] ) {
      this.composer.passes[_overlay_].enabled = false;
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
