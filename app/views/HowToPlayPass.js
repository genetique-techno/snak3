import _ from 'underscore';
import util from 'app/util';
import stateManager from 'app/controllers/stateManager';
import stateMappings from 'app/config/stateMappings';
import passRegistry from 'app/controllers/passRegistry';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

import CubeDrawer from 'app/classes/CubeDrawer';
import Game from 'app/controllers/Game.js';
import snakeDirections from 'app/config/demoSnakeDirections';

export default class HowToPlayPass extends CubeDrawer {

  constructor( composer ) {
    super( composer );

    // create a fake game type
    const miniGameType = {
      label: "demo",
      limits: [ 8, 8, 3 ],
      interval: 350,
      colors: {
        boundaryCubes: '#33aacc',
        cubes: '#55ff22'
      }
    };
    // assign the fake game type props to this
    util.assignKeys.call( this, miniGameType );
    // make a fake game instance in demo mode
    const miniGameOptions = {
      demo: true,
      nodes: [
        [7,5,0],
        [7,4,0],
        [7,3,0],
        [7,2,0],
        [7,1,0],
        [7,0,0],
        [6,0,0],
        [5,0,0],
        [4,0,0],
        [3,0,0],
        [2,0,0],
        [1,0,0],
        [0,0,0]
      ],
      noSound: true,
      levelUpPosition: [3,3,1]
    };

    this._game = new Game( miniGameType, miniGameOptions );

    // camera setup -- this page uses a different FOV and camera offset to get the perspective correct for the miniGame demo
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);
    const w = window.__GAME_DIV__.clientWidth * 1.5;
    const h = window.__GAME_DIV__.clientHeight * 1.5;
    this.camera.setViewOffset( window.__GAME_DIV__.clientWidth, window.__GAME_DIV__.clientHeight, 0, 0, w, h);
    this.cameraPosition = [ 4, 3, 15 ];

    this.ambientLight = new THREE.AmbientLight( 0x404040, 2 );
    this.scene.add( this.ambientLight );

    this.light = new THREE.PointLight( 0xffffff, 1, 100, 1 );
    this.scene.add( this.light );

    this.setBoundaryCubePositions();
    this.setInitialCube();
    this.highlightBoundaryCubes();
    this.setLevelUpPosition(  miniGameOptions.levelUpPosition );

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


    this.setNodeCubes();
    this.animationLoopInterval = window.setInterval( this.tick.bind( this ), miniGameType.interval );

    function keyListener(e) {
      // step through the pages on any key press
      this.unloader();
    }
    this.keyListener = keyListener.bind( this );
    window.addEventListener( 'keydown', this.keyListener );

    this.snakeDirections = snakeDirections();
    this.loader();

  }

  tick() {
    let dir = this.snakeDirections.next();
    this._game._snake.changeDirection( dir );
    dir !== 'stop' ? this._game.tick() : null;
    this.setNodeCubes();
    this.highlightBoundaryCubes();
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

    window.clearInterval( this.animationLoopInterval );
    window.setTimeout(() => {
      window.removeEventListener( 'keydown', this.keyListener );
      passRegistry.removeAll();
      stateManager.setNewApplicationState( newState );
    }, 2000 );

  }

  loader() {
    var lim = 5;

    this.scene.fog = new THREE.Fog( 0x000000, 0, 0 );
    this.setCameraPosition.apply( this, this.cameraPosition );

    // load the initial page
    // this.pages[this.page].call( this );

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: lim+10, far: 10*lim+10 }, 2000 )
      .start();

  }

  setCameraPosition(x, y, z) {

    this.camera.position.set( x, y, z );
    // this.camera.lookAt( new THREE.Vector3(-1, 1, -1) );
    this.light.position.set( x+5, y+5, z )
  }

  // howToPlay() {

  //   // establish the camera positon
  //   let camPos = {
  //     x: 0,
  //     y: 0,
  //     z: 20
  //   };

  //   // add snake cubes and start animating them?

  //   // return a function which moves camera to this page
  //   return () => {
  //     this.moveCameraPosition( camPos.x, camPos.y, camPos.z );
  //   }
  // }

  // moveCameraPosition( x, y, z ) {

  //   let camZ = this.camera.position.z;
  //   let newCamZ = z;

  //   let camX = this.camera.position.x;
  //   let newCamX = x;

  //   let camY = this.camera.position.y;
  //   let newCamY = y;

  //   this.camZTween = new TWEEN.Tween( this.camera.position )
  //     .to( { x: newCamX, y: newCamY, z: newCamZ }, 1000 )
  //     .easing( TWEEN.Easing.Quadratic.InOut )
  //     .start();

  //   this.lightTween = new TWEEN.Tween( this.light.position )
  //     .to( { x: newCamZ+5, y: newCamY+5, z: newCamZ }, 1000 )
  //     .easing( TWEEN.Easing.Quadratic.InOut )
  //     .start();

  // }
}
