import _ from 'underscore';
import THREE from 'three';

export default class Renderer {

  constructor(div) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, div.clientWidth / div.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( div.clientWidth, div.clientHeight );
  }

  appendToDom(div) {
    div.appendChild( this.renderer.domElement );
  }

  addFog(options = {}) {
    options = _.defaults(options, { color: 0x000000, near: 100, far: 500 });

    this.scene.fog = new THREE.Fog( options.color, options.near, options.far );
  }

  addGrid(options = {}) {
    options = _.defaults(options, { size: 500, step: 50 });

    let grid = new THREE.GridHelper( options.size, options.step );
    this.scene.add( grid );
  }

  setCameraPosition(options) {
    const { pos, lookAt} = options;

    if (pos instanceof Array && pos.length === 3) {
      let [x, y, z] = pos;
      this.camera.position.set(x, y, z );
    }
    
    if (lookAt instanceof Array && lookAt.length === 3) {
      let [x, y, z] = lookAt;
      this.camera.lookAt( new THREE.Vector3(x, y, z) );
    }
  }

  render() {
    window.requestAnimationFrame( this.render.bind( this ) );


    this.renderer.render( this.scene, this.camera );
  }
}
