import EventEmitter from 'events';
import _ from 'underscore';
import items from 'app/config/howToPlayText';

require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

const alegreya = require('app/fonts/Alegreya Sans SC Light_Regular.json');

export default class HowToPlayOverlay extends EventEmitter {

  constructor() {
    super();

    this.font = new THREE.Font( alegreya );
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    this.fontOptions = {
      font: this.font,
      size: 20,
      height: 0,
      curveSegments: 10,
      bevelEnabled: false
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(window.__GAME_DIV__.clientWidth / - 2, window.__GAME_DIV__.clientWidth / 2, window.__GAME_DIV__.clientHeight / 2, window.__GAME_DIV__.clientHeight / -2, 0.1, 1000);

    this.camera.position.set( 0, 0, 20);
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.renderPass.clear = false;
    this.renderPass.renderToScreen = true;

    this.setItems();
  }

  setItems() {

    const base = { x: -380, y: 180, z: 0 };
    const gap = 30;

    const textGroup = new THREE.Group();

    items.forEach( ( line, index ) => {

      if (line.text) {
        let options = _.extend({}, this.fontOptions, _.omit( line, ["text", "x", "y"] ) );
        let text = new THREE.TextGeometry( line.text.toLowerCase(), options );
        let mesh = new THREE.Mesh( text, this.material.clone() );
        mesh.position.set( base.x + ( line.x || 0 ), (_.isUndefined(line.y) ? base.y - gap * index : line.y), base.z );

        // add to the THREE Group
        textGroup.add( mesh );
      }

    });

    this.scene.add( textGroup );

    // Fade in the instruction text
    textGroup.children.forEach( item => new TWEEN.Tween( item.material )
        .to( { opacity: 1 }, 1000 )
        .start() );
  }

};
