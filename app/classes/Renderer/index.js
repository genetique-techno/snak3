import _ from 'underscore';

import TitlePass from 'app/classes/Passes/TitlePass.js';

// import { EffectComposer, RenderPass, BloomPass } from 'postprocessing';

// Load all of the THREE.js stuff using webpack's expose-loader, imports-loader, and exports-loader
// Only the THREE.js project has module.exports

/*
<script src="js/shaders/BleachBypassShader.js"></script>
<script src="js/shaders/ColorifyShader.js"></script>
<script src="js/shaders/ConvolutionShader.js"></script>
<script src="js/shaders/CopyShader.js"></script>
<script src="js/shaders/DotScreenShader.js"></script>
<script src="js/shaders/FilmShader.js"></script>
<script src="js/shaders/HorizontalBlurShader.js"></script>
<script src="js/shaders/SepiaShader.js"></script>
<script src="js/shaders/VerticalBlurShader.js"></script>
<script src="js/shaders/VignetteShader.js"></script>

<script src="js/postprocessing/EffectComposer.js"></script>
<script src="js/postprocessing/RenderPass.js"></script>
<script src="js/postprocessing/BloomPass.js"></script>
<script src="js/postprocessing/FilmPass.js"></script>
<script src="js/postprocessing/DotScreenPass.js"></script>
<script src="js/postprocessing/TexturePass.js"></script>
<script src="js/postprocessing/ShaderPass.js"></script>
<script src="js/postprocessing/MaskPass.js"></script>
*/

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/ConvolutionShader.js' );

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/BloomPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/ShaderPass.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/TexturePass.js' );

export default class Renderer {

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


    // start building composers
    this.buildTitleRenderScene();

    this.composer = new THREE.EffectComposer( this.renderer );
    this.composer.addPass( this.titleRenderScene );

    this.clock = new THREE.Clock();

    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.render();

  }

  buildTitleRenderScene() {

    this.titleComposer = new THREE.EffectComposer( this.renderer, new THREE.WebGLRenderTarget( this.width, this.height ) );
    let bloomPass = new THREE.BloomPass( this.bloomOptions );
    bloomPass.renderToScreen = true;
    let titlePass = new TitlePass();

    this.titleComposer.addPass( titlePass.renderPass );
    this.titleComposer.addPass( bloomPass );

    this.titleRenderScene = new THREE.TexturePass( this.titleComposer.renderTarget2.texture );
  }

  setMainPass( pass ) {
    if ( this.mainPassInstance.unloader ) {

      this.mainPassInstance.unloader();
      window.setTimeout(() => {
        this.composer.passes[0] = pass.renderPass;
        this.mainPassInstance = pass;
        this.mainPassInstance.loader();
      }, 2000 );
    } else {
      this.composer.passes[0] = pass.renderPass;
      this.mainPassInstance = pass;
      this.mainPassInstance.loader();
    }
  }

  setOverlayPass( pass ) {
    if ( !pass || _.isEmpty( pass ) ) {
      this.composer.passes[1] = {};
    } else {
      this.composer.passes[1] = pass.renderPass;
    }
  }

  render() {
    
    let delta = this.clock.getDelta();

    this.titleComposer.render( delta );

    this.composer.render(delta);

    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();
  }
}
