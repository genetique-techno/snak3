import _ from 'underscore';

import menuItems from 'app/config/menuItems.js';

import { RenderPass } from 'postprocessing';

const alegreya = require('app/fonts/Alegreya Sans SC Light_Regular.json');

const basePosition = { x: 0, y: -5, z: 0 };
const itemGap = 1.2;

export default class MenuOverlay {

  constructor( emitter ) {

    this.font = new THREE.Font( alegreya );
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.fontOptions = {
      font: this.font,
      size: 1.1,
      height: 0,
      curveSegments: 10,
      bevelEnabled: false
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);

    this.setItems();

    this.camera.position.set( 0, 0, 20);
    this.renderPass = new RenderPass( this.scene, this.camera );
    this.renderPass.clear = false;

    this.setSelection(0);
    emitter.on( 'changeSelection', this.setSelection.bind( this ) );
    
  }

  setItems() {

    this.items = new THREE.Group();
    menuItems.forEach( ( item, index ) => {
      if ( item.type !== 'separator' ) {
        let text = new THREE.TextGeometry( item.label, this.fontOptions );
        let mesh = new THREE.Mesh( text, this.material );
        mesh.position.set( basePosition.x, basePosition.y - itemGap * index, basePosition.z );
        this.items.add( mesh );
      } else {
        this.items.add( new THREE.Object3D() );
      }
    });   

    this.scene.add( this.items );
  }

  setSelection( index ) {

    let item = this.items.children[index];

    let selectorPosition = {
      x: item.position.x - 2,
      y: item.position.y,
      z: item.position.z
    };

    if ( !this.selector ) {
      this.selector = new THREE.Mesh( new THREE.TextGeometry( '>', this.fontOptions ), this.material );
      this.selector.position.x = selectorPosition.x;
      this.selector.position.y = selectorPosition.y;
      this.selector.position.z = selectorPosition.z;
      this.scene.add( this.selector );
    }

    this.selectorTween = new TWEEN.Tween( this.selector.position )
      .to( { y: selectorPosition.y }, 75 )
      .start();
  }
};
