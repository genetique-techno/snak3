import _ from 'underscore';
import util from 'app/util';
import MenuOverlay from 'app/views/MenuOverlay.js';
import stateManager from 'app/controllers/stateManager.js';
import passRegistry from 'app/controllers/passRegistry.js';

const geoOblique = require('app/fonts/Geo_Oblique.json');
import titleCubes from 'app/config/titleCubes.js';

import CubeDrawer from 'app/classes/CubeDrawer.js';

export default class TitlePass extends CubeDrawer {

  constructor( composer, state ) {
    super( composer );

    this._setCameraPosition();
    this._setLighting();
    this._setTitleText();

    this.nodes = [];
    this.startRemovingNodes = false;
    this.cubes = new THREE.Group();
    this.scene.add( this.cubes );

    this.loader();
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

  unloader( newState ) {
    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: 0, far: 0 }, 2000 )
      .start();
    window.setTimeout(() => {
      this.unload( newState );
    }, 2000 );
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

    window.setTimeout(() => {
      this.overlay = new MenuOverlay();
      this.loadOverlay( this.overlay );
      this.overlay.on( "acceptSelection", this.unloader.bind( this ) );
    }, 7000 );

    window.setTimeout(() => {
      this._animateTitleCubes( [].concat(titleCubes) );
    }, 7000 );
  }

  _animateTitleCubes( titleCubes ) {
    var cubeInterval = window.setInterval(() => {

      let lengthCubeTrail = 20;

      if ( titleCubes.length ) {
        this.nodes.push( titleCubes.shift() );
      }

      if ( this.nodes.length === lengthCubeTrail ) {
        this.startRemovingNodes = true;
      }

      if ( this.startRemovingNodes ) {
        this.nodes.shift();
        if ( this.nodes.length === 0 ) {
          window.clearInterval( cubeInterval );
        }
      }

      let renderedCubes = this.cubes.children.map((node) => {
        return node.name;
      });

      let removeNodes = _.difference( renderedCubes, this.nodes );
      let addNodes = _.difference( this.nodes, renderedCubes );

      // remove any cubes no longer in the snake nodes
      removeNodes.forEach((node) => {
        this.removeCube({
          node,
          group: 'cubes'
        });
      });

      // add new cubes for any new snake nodes

      addNodes.forEach((node) => {
        this.addCube({
          group: 'cubes',
          color: 0xA8ED1F,
          pos: node
        });
      });
      this.cubes.children.forEach((cube, index) => {
        cube.material.color.set( util.colorLuminance( "#A8ED1F", -( lengthCubeTrail - index) / lengthCubeTrail ) );
      });

    }, 100);
  }

  _setLighting() {

    this.light = new THREE.PointLight( 0xffffff, 1, 500, 1 );
    this.scene.add(this.light);

  }

  _setCameraPosition() {
    this.camera.position.z = 10;
  }
}
