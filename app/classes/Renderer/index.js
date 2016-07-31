import _ from 'underscore';
import THREE from 'three';

export default class Renderer {

  constructor( div ) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, div.clientWidth / div.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( div.clientWidth, div.clientHeight );
  }

  appendToDom( div ) {
    div.appendChild( this.renderer.domElement );
  }

  addFog( options = {} ) {
    options = _.defaults(options, { color: 0x000000, near: 100, far: 500 });

    this.scene.fog = new THREE.Fog( options.color, options.near, options.far );
  }

  addGrid( options = {} ) {
    options = _.defaults(options, { size: 500, step: 50 });

    let grid = new THREE.GridHelper( options.size, options.step );
    this.scene.add( grid );
  }

  addCube( options ) {
    if ( !options ) { return null; }

    const {
      color,
      pos,
      name,
      scale,
      group
    } = options;

    let s = +scale || 1;

    let geometry = new THREE.BoxGeometry( s*1, s*1, s*1 );
    let material = new THREE.MeshBasicMaterial({ color: color });
    let cube = new THREE.Mesh(geometry, material);

    cube.name = name || pos.join('$');
    cube.position.set( s*pos[0], s*pos[1], s*pos[2] );

    if (group) {
      material.wireframe = true;
      material.wireframeLinewidth = 2;
      this[group].add(cube);
    } else {
      this.cubes.add(cube);    
    }
  }

  setLevelUpPosition( node, options ) {
    if ( !node ) { return };
    if ( !this.sphere ) {
      let geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
      let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      this.sphere = new THREE.Mesh( geometry, material );
      this.scene.add( this.sphere );
    }

    this.sphere.position.set( node[0], node[1], node[2] );
  }

  setNodeCubes( nodes, options ) {
    if ( !this.cubes ) {
      this.cubes = new THREE.Group();
      this.scene.add( this.cubes );
    }

    nodes = nodes.map((node) => {
      return node.join('$');
    });

    let renderedCubes = this.cubes.children.map((node) => {
      return node.name;
    });

    let removeNodes = _.difference( renderedCubes, nodes );
    let addNodes = _.difference( nodes, renderedCubes );

    // remove any cubes no longer in the snake nodes
    removeNodes.forEach((node) => {
      this.cubes.remove( _.find( this.cubes.children, (cube) => {
        return cube.name === node;
      }));
    });

    // add new cubes for any new snake nodes
    addNodes.forEach((node) => {
      this.addCube({
        color: options.color,
        pos: node.split('$')
      });
    }); 

  }

  setBoundaryCubes( limits, options ) {
    if ( !limits instanceof Array && limits.length ) { return null; }
    this.gameBoard = new THREE.Group();
    this.scene.add( this.gameBoard );

    // [5, 5, 1]

    let edges = [];
    for ( let z = 0; z < limits[2]; z++ ) {
      for ( let y = 0; y < limits[1]; y++ ) {
        for ( let x = 0; x < limits[0]; x++ ) {
          
          if ( x === 0 ) {
            edges.push( [ -1, y, z ] );

            if ( y === 0 ) {
              edges.push( [ -1, -1, z ] );
            }
          }

          if ( x === limits[0] - 1 ) {
            edges.push( [ limits[0], y, z ] );
            if ( y === 0 ) {
              edges.push( [ limits[0], -1, z ] );
            }
          }
          
          if ( y === 0 ) {
            edges.push( [ x, - 1, z ] );
          }

          if ( y === limits[1] - 1) {
            edges.push( [ x, limits[1], z ] );

            if ( x === 0 ) {
              edges.push( [ -1, limits[1], z ] );
            }
            if ( x === limits[0] - 1 ) {
              edges.push( [ limits[0], limits[1], z ] );
            }

          }
        }
      }
    }

    edges.forEach((edge) => {
      this.addCube( _.extend( options, { group: 'gameBoard', pos: edge } ) );
    });
  }

  setCameraPosition( options ) {
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
