import THREE from 'three';
import TWEEN from 'tween.js';
import _ from 'underscore';

import { EffectComposer, RenderPass, BloomPass } from 'postprocessing';

export default class Renderer {

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.__GAME_DIV__.clientWidth, window.__GAME_DIV__.clientHeight );


    // Shader experiment ------
    this.composer = new EffectComposer( this.renderer );
    let bloomPass = new BloomPass({
      resolutionScale: 0.2,
      blurriness: 0,
      strength: 1.0,
      distinction: 1.4
    });
    bloomPass.renderToScreen = true;

    this.mainPassInstance = {};
    this.overlayPassInstance = {};

    this.composer.passes.push({});
    this.composer.passes.push({});
    this.composer.addPass( bloomPass, 2 );

    this.clock = new THREE.Clock();

    window.__GAME_DIV__.appendChild( this.renderer.domElement );

    this.render();

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
    this.composer.render(delta);

    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();
  }
}
