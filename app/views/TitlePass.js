// import { RenderPass } from 'postprocessing';
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

const geoOblique = require('app/fonts/Geo_Oblique.json');

export default class TitlePass {

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);

    this._setCameraPosition();
    this._setLighting();
    this._setTitleText();

    this.renderPass = new THREE.RenderPass( this.scene, this.camera );

  }

  _setTitleText() {
    this.text = new THREE.TextGeometry( "s n a k 3", {
      font: new THREE.Font( geoOblique ),
      size: 10,
      height: 1.2,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.3
    } );
    this.text.computeBoundingBox();
    let centerOffset = -0.5 * ( this.text.boundingBox.max.x - this.text.boundingBox.min.x );

    this.material = new THREE.MultiMaterial( [
          new THREE.MeshPhongMaterial( { color: 0xA8ED1F, shading: THREE.FlatShading, shininess: 0 } ), // front
          new THREE.MeshPhongMaterial( { color: 0x215EA6, shading: THREE.SmoothShading, shininess: 0 } ) // side
        ] );
    this.textMesh = new THREE.Mesh( this.text, this.material );
    this.textMesh.position.set( centerOffset, 0, 0 );//-50 );

    this.pivot = new THREE.Object3D();
    this.pivot.position.set( 0, 0, -50 );
    this.pivot.add( this.textMesh );
    this.pivot.rotation.set( Math.random() * 0.3 - 0.15, Math.random() * 2 - 1, Math.random() * 0.5 - 0.25 );

    this.scene.add( this.pivot );
  }

  unloader() {
    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: 0, far: 0 }, 2000 )
      .start();
  }

  loader() {
    this.scene.fog = new THREE.Fog( 0x000000, 0, 10 );
    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: 20, far: 100 }, 2000 )
      .start();

    this.textTween = new TWEEN.Tween( this.pivot.position )
      .to( { z: -20 }, 6000 )
      .easing( TWEEN.Easing.Quadratic.InOut )
      .start();

    this.textRotationTween = new TWEEN.Tween( this.pivot.rotation )
      .to( { x: 0, y: 0, z: 0 }, 7000 )
      .easing( TWEEN.Easing.Quadratic.InOut )
      .start();
  }

  _setLighting() {

    this.light = new THREE.PointLight( 0xffffff, 1, 500, 1 );
    this.scene.add(this.light);

  }

  _setCameraPosition() {
    this.camera.position.z = 10;
  }
}
