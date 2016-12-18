import _ from 'underscore';
import util from 'app/util';
import stateManager from 'app/controllers/stateManager';
import stateMappings from 'app/config/stateMappings.js';
import gameTypes from 'app/config/gameTypes.js';
import passRegistry from 'app/controllers/passRegistry.js';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

import CubeDrawer from 'app/views/CubeDrawer';
import Game from 'app/controllers/Game.js';

const _overlay_ = 1;

export default class GamePass extends CubeDrawer {

  constructor( composer, { difficulty } ) {
    super();

    util.assignKeys.call( this, gameTypes[ difficulty ] ); // limits, interval, colors
    this._game = new Game( gameTypes[ difficulty ] );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);

    this.ambientLight = new THREE.AmbientLight( 0x404040, 2 );
    this.scene.add( this.ambientLight );

    this.light = new THREE.PointLight( 0xffffff, 1, 100, 1 );
    this.scene.add( this.light );

    this.setBoundaryCubePositions();
    this.setInitialCube();
    this.highlightBoundaryCubes();
    this.setLevelUpPosition( this._game.levelUpPosition );
    this.setInitialCameraPosition();

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

    this._game.on( "tick", this.tick.bind( this ) );
    this._game.on( "gameOver", this.gameOver.bind( this ) );
    this.loader();

  }

  unloader( newState ) {

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: 0, far: 0 }, 2000 )
      .start();

    window.setTimeout(() => {
      passRegistry.removeAll();
      stateManager.setNewApplicationState( newState );
    }, 2000 );

  }

  loader() {
    var lim = this.limits[2];

    this.scene.fog = new THREE.Fog( 0x000000, 0, 0 );

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: lim+10, far: 10*lim+10 }, 2000 )
      .start();

    this.scoreOverlay = new stateMappings.overlays[ "scoreOverlay" ]();
    this.scoreOverlay.updateScore( 0 );
    this.composer.passes[_overlay_] = this.scoreOverlay.renderPass;
    passRegistry.register( this.scoreOverlay );

  }

  // investigate this whole "loadOverlay" thing.  It's not working out like I hoped.
  // How do you efficiently tell the gamePass that the gameOverOverlayWithEntry or gameOverOverlay was used,
  // and how does gameOverOverlayWithEntry tell gamePass to load gameOverlay after it's done
  // maybe it's all handled in the gameOverOverlay...instead of having a second overlay!!
  gameOver() {
    window.setTimeout(() => {
      let gameOverOverlay = new stateMappings.overlays[ "gameOverOverlay" ]();
      this.composer.passes[_overlay_] = gameOverOverlay.renderPass;
      gameOverOverlay.on( "gameOverOverlayDone", this.unloader.bind( this ) );
    }, 2000 );
  }

  tick( { head, nodes, levelUpPosition, score } ) {
    this.setNodeCubes();
    this.highlightBoundaryCubes();
    this.setLevelUpPosition( levelUpPosition );
    this.moveCameraPosition();
    this.scoreOverlay.updateScore( score );
  }

  setInitialCameraPosition() {

    let head = this._game._snake.head;

    let pos = [
      this.limits[0]/2 + 0.1*(head[0]-this.limits[0]/2),
      this.limits[1]/2 + 0.1*(head[1]-this.limits[0]/2),
      _.max( this.limits.slice(0,2) ) + head[2]
    ];

    this.camera.position.set( pos[0], pos[1], pos[2] );
    this.light.position.set( pos[0]+5, pos[1]+5, pos[2] )
  }

  moveCameraPosition() {

    let headZ = this._game._snake.head[2];
    let camZ = this.camera.position.z;
    let newCamZ = _.max( this.limits.slice(0,2) ) + headZ;

    let headX = this._game._snake.head[0];
    let camX = this.camera.position.x;
    let newCamX = this.limits[0]/2 + 0.1*(headX-this.limits[0]/2);

    let headY = this._game._snake.head[1];
    let camY = this.camera.position.y;
    let newCamY = this.limits[1]/2 + 0.1*(headY-this.limits[0]/2);

    this.camZTween = new TWEEN.Tween( this.camera.position )
      .to( { x: newCamX, y: newCamY, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

    this.lightTween = new TWEEN.Tween( this.light.position )
      .to( { x: newCamZ+5, y: newCamY+5, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

  }
}
