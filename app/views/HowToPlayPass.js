import _ from 'underscore';
import util from 'app/util';
import stateManager from 'app/controllers/stateManager';
import stateMappings from 'app/config/stateMappings';
import passRegistry from 'app/controllers/passRegistry';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

import CubeDrawer from 'app/views/CubeDrawer';

function keyListener(e) {
  // step through the pages on any key press
  this.incrementPage();
}

export default class HowToPlayPass extends CubeDrawer {

  constructor( composer ) {
    super();

    this.page = 0;
    this.pages = [
      this.snakePage,
      this.levelPage
    ];


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);

    this.ambientLight = new THREE.AmbientLight( 0x404040, 2 );
    this.scene.add( this.ambientLight );

    this.light = new THREE.PointLight( 0xffffff, 1, 100, 1 );
    this.scene.add( this.light );

    const renderPass = new THREE.RenderPass( this.scene, this.camera );
    renderPass.renderToScreen = true;
    renderPass.setSize( window.__GAME_DIV__.width, window.__GAME_DIV__.height );
    composer.passes = [];
    composer.passes[0] = renderPass;
    passRegistry.register( this );
    this.composer = composer;

    this.addGrid({
      size: 100,
      step: 200
    });

    // events for page selection here
    this.keyListener = keyListener.bind( this );
    window.addEventListener( 'keydown', this.keyListener );

    this.loader();

  }

  incrementPage() {
    // increment the page number, and exit on last page
    this.page++;
    if ( this.page > this.pages.length-1 ) return this.unloader();
    this.pages[this.page].call( this );
  }

  unloader() {

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: 0, far: 0 }, 2000 )
      .start();

    const newState = {
      mainPass: "titlePass",
      difficulty: 0,
      name: "",
      score: 0
    };

    window.setTimeout(() => {
      window.removeEventListener( 'keydown', this.keyListener );
      passRegistry.removeAll();
      stateManager.setNewApplicationState( newState );
    }, 2000 );

  }

  loader() {
    var lim = 5;

    this.scene.fog = new THREE.Fog( 0x000000, 0, 0 );
    this.setCameraPosition( 0, 0, 20);

    // load the initial page
    this.pages[this.page].call( this );

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: lim+10, far: 10*lim+10 }, 2000 )
      .start();

  }

  setCameraPosition(x, y, z) {

    this.camera.position.set( x, y, z );
    // this.camera.lookAt( new THREE.Vector3(-1, 1, -1) );
    this.light.position.set( x+5, y+5, z )
  }

  snakePage() {

    let camPos = {
      x: 0,
      y: 0,
      z: 20
    };

    this.moveCameraPosition( camPos.x, camPos.y, camPos.z );
    // this.setTextOverlay( "howToPlaySnakeOverlay" );
  }

  levelPage() {
    let camPos = {
      x: 50,
      y: 0,
      z: 20
    };

    this.moveCameraPosition( camPos.x, camPos.y, camPos.z );
    // this.setTextOverlay( "howToPlayLevelOverlay" );
  }

  setTextOverlay( overlayDescriptor ) {
    this.overlay = new stateMappings.overlays[ overlayDescriptor ]();
    this.overlay
    this.composer.passes[_overlay_] = this.overlay.renderPass;
    passRegistry.register( this.overlay );
  }

  moveCameraPosition( x, y, z ) {

    let camZ = this.camera.position.z;
    let newCamZ = z;

    let camX = this.camera.position.x;
    let newCamX = x;

    let camY = this.camera.position.y;
    let newCamY = y;

    this.camZTween = new TWEEN.Tween( this.camera.position )
      .to( { x: newCamX, y: newCamY, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Quadratic.InOut )
      .start();

    this.lightTween = new TWEEN.Tween( this.light.position )
      .to( { x: newCamZ+5, y: newCamY+5, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Quadratic.InOut )
      .start();

  }
}


