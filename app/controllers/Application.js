
import stateManager from 'app/controllers/stateManager.js';
import stateMappings from 'app/config/stateMappings.js';
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

const _main_ = 0;
const _overlay_ = 1;
const _effect1_ = 2;
const _effect2_ = 3;


class Application {

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.__GAME_DIV__.clientWidth;
    this.height = window.__GAME_DIV__.clientHeight;
    this.renderer.setSize( this.width, this.height );
    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.renderTarget = createRenderTarget( this.renderer, this.width, this.height );

    this.composer = new THREE.EffectComposer( this.renderer, this.renderTarget );
    this.clock = new THREE.Clock();

    this.rgbShiftShader = new THREE.ShaderMaterial( THREE.RGBShiftShader );
    this.rgbShiftShader.uniforms.amount.value = 0.004;
    this.rgbShiftShader.uniforms.angle.value = 0.35;
    this.bloomPass = new THREE.ShaderPass( this.rgbShiftShader );
    this.bloomPass.setSize( this.width, this.height );

    stateManager.on( 'newApplicationState', this.setApplicationView.bind( this ) );
    stateManager.emitCurrentState();

    this.post = setupPostProcessing( this.renderer, this.width, this.height, this.renderTarget );
    this.render();

    this.resize = this.resize.bind( this );
    window.addEventListener( "resize", _.throttle( this.resize, 200 ), false );
  }

  resize(e) {
    this.width = window.__GAME_DIV__.clientWidth;
    this.height = window.__GAME_DIV__.clientHeight;

    this.renderer.setSize( this.width, this.height );
    this.composer.setSize( this.width, this.height );

    this.renderTarget.width = this.width;
    this.renderTarget.height = this.height;

    this.mainPass.camera.aspect = this.width / this.height;
    this.overlayPass.camera.aspect = this.mainPass.camera.aspect;

    this.mainPass.camera.updateProjectionMatrix();

    this.overlayPass.camera.left = this.width / -2;
    this.overlayPass.camera.right = this.width / 2;
    this.overlayPass.camera.top = this.height / 2;
    this.overlayPass.camera.bottom = this.height / -2;
    this.overlayPass.camera.updateProjectionMatrix();
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
        this.setOverlayPass( state );

      }, delay );
    } else if ( state.overlayPass.change ) {

      if ( this.overlayPass && this.overlayPass.unloader ) {
        this.overlayPass.unloader();
      }

      // Set the overlayPass if there's no change in mainPass
      this.setOverlayPass( state );

    }
  }

  setMainPass( state ) {
    this.mainPass = new stateMappings.mainPasses[ state.mainPass.value ]( state.gameType );
    this.composer.passes[_main_] = this.mainPass.renderPass;
    this.setEffects();
  }

  setEffects() {

    this.composer.passes[_effect1_] = this.bloomPass;
    console.log(this.composer);
  }

  setOverlayPass( state ) {
    if ( stateMappings.overlays[ state.overlayPass.value ] ) {
      this.overlayPass = new stateMappings.overlays[ state.overlayPass.value ]();
      this.overlayPass.renderPass.enabled = false;
      this.composer.passes[_overlay_] = this.overlayPass.renderPass;

      window.setTimeout(() => {
        this.overlayPass.renderPass.enabled = true;
      }, state.overlayPass.delay );
    } else if ( this.composer.passes[_overlay_] ) {
      this.composer.passes[_overlay_].enabled = false;
    }
  }


  render() {
    window.requestAnimationFrame( this.render.bind( this ) );
    
    let delta = this.clock.getDelta();

    this.composer.render(delta);
    this.renderer.render( this.post.scene, this.post.camera );


    TWEEN.update();
  }

}

export default Application;

function createRenderTarget(renderer, width, height) {
  var rtWidth = width||2,
      rtHeight = height||2;

  var gl = renderer.getContext();
  var maxRenderTargetSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

  rtWidth = Math.min(rtWidth, maxRenderTargetSize);
  rtHeight = Math.min(rtHeight, maxRenderTargetSize);

  var renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      generateMipmaps: false
  });
  return renderTarget;
}

function setupPostProcessing(renderer, width, height, renderTarget) {
  var fxaaMaterial = new THREE.ShaderMaterial({
      uniforms: {
          //the scene texture...
          texture: {type:'t', value: renderTarget.texture},
          resolution: {type:'v2', value: new THREE.Vector2(width, height)}
      },
      vertexShader: vertShader,
      fragmentShader: fragShader
  });

  
  var postQuad = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2 ), fxaaMaterial);
  console.log(postQuad);

  var postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, -1, 1 );
  postCamera.updateProjectionMatrix();

  var postScene = new THREE.Scene();
  postScene.add(postQuad);
  console.log(fxaaMaterial);

  return {
      camera: postCamera,
      scene: postScene,
      quad: postQuad,
      fxaaMaterial: fxaaMaterial,
    };
}
