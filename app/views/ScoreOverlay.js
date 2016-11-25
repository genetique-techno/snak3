import _ from 'underscore';
import stateManager from 'app/controllers/stateManager.js';

require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

const alegreya = require('app/fonts/Alegreya Sans SC Light_Regular.json');

export default class ScoreOverlay {

  constructor() {
    this.font = new THREE.Font( alegreya );
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.fontOptions = {
      font: this.font,
      size: 25,
      height: 0,
      curveSegments: 10,
      bevelEnabled: false
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(window.__GAME_DIV__.clientWidth / - 2, window.__GAME_DIV__.clientWidth / 2, window.__GAME_DIV__.clientHeight / 2, window.__GAME_DIV__.clientHeight / -2, 0.1, 1000);
    this.camera.position.set( 0, 0, 20);
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.renderPass.clear = false;
    this.renderPass.renderToScreen = false;


    stateManager.on( 'newScoreState', this.updateScore.bind( this ) );
    stateManager.emitCurrentScore();
  }

  updateScore( scoreState ) {

    let updatedScore = scoreState.value;

    const basePosition = { x: this.camera.right - 50, y: this.camera.top - 50, z: 0 };

    if ( this.scoreMesh ) {
      this.scene.remove( this.scoreMesh );
    }

    let text = new THREE.TextGeometry( updatedScore, this.fontOptions );
    this.scoreMesh = new THREE.Mesh( text, this.material.clone() );
    text.computeBoundingBox();
    this.scoreMesh.position.set( basePosition.x - text.boundingBox.max.x, basePosition.y, basePosition.z );

    this.scene.add( this.scoreMesh );
  }


}
