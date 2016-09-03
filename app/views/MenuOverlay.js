import _ from 'underscore';
import Menu from 'app/controllers/Menu.js';
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

const alegreya = require('app/fonts/Alegreya Sans SC Light_Regular.json');
const basePosition = { x: 0, y: -100, z: 0 };
const itemGap = 30;

export default class MenuOverlay {

  constructor( emitter ) {

    this._menu = new Menu();

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

    this.setItems();

    this.camera.position.set( 0, 0, 20);
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.renderPass.clear = false;
    this.renderPass.renderToScreen = false;

    this.setSelection(0);
    this._menu.on( 'changeSelection', this.setSelection.bind( this ) );
    this._menu.on( 'acceptSelection', this.acceptSelection.bind( this ) );
    
  }

  acceptSelection(e) {

    let counter = 0;
    let white =  new THREE.Color( 0xffffff );
    let darker = new THREE.Color( 0x000000 );
    let timer = window.setInterval(() => {
      if ( counter % 2 === 0 ) {
        // set the item's fount color to 0xffffff
        this.selector.material.color = white;
        this.items.children[ this._menu.selectionIndex ].material.color = white;
      } else {
        // set the item's font color to darker
        this.selector.material.color = darker;
        this.items.children[ this._menu.selectionIndex ].material.color = darker;
      }
      counter++;
      if ( counter === 20 ) { window.clearInterval( timer ); };
    }, 25 );

  }

  unloader() {
    window.setTimeout(() => {
      this.renderPass.enabled = false;
    }, 500 );
  }

  setItems() {

    this.items = new THREE.Group();
    this._menu.menuItems.forEach( ( item, index ) => {
      if ( item.type !== 'separator' ) {
        let text = new THREE.TextGeometry( item.label, this.fontOptions );
        let mesh = new THREE.Mesh( text, this.material.clone() );
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
      x: item.position.x - 30,
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
