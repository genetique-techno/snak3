import _ from 'underscore';
import util from 'app/util';
import MainPass from "app/classes/MainPass";

export default class CubeDrawer extends MainPass {

  constructor( composer ) { super( composer ) }

  addGrid( options = {} ) {
    if ( !this.scene ) {
      console.log( 'CubeDrawer: No instance of this.scene on which to draw grid.' );
      return null;
    }

    options = _.defaults(options, { size: 500, step: 50 });

    let grid = new THREE.GridHelper( options.size, options.step, options.color, options.color );
    grid.rotation.set( 1.5707, 0, 0 );
    grid.position.set( -0.5, -0.5, -0.5);
    this.scene.add( grid );
  }

  addCube( options ) {
    if ( !options ) { return null; }
    if ( !this.scene ) {
      console.log( 'CubeDrawer: No instance of this.scene on which to draw cubes.' );
      return null;
    }

    const {
      color,
      pos,
      name,
      scale,
      group
    } = options;

    let s = +scale || 1;

    let geometry = new THREE.BoxGeometry( s*1, s*1, s*1 );

    let material = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 0 } );
    material.transparent = true;
    material.opacity = 1.0;

    let cube = new THREE.Mesh( geometry, material );

    cube.name = name || pos.join('$');
    cube.position.set( s*pos[0], s*pos[1], s*pos[2] );

    if (group) {
      if ( !this[group] ) {
        this[group] = new THREE.Group();
        this.scene.add( this[group] );
      }
      this[group].add(cube);
    } else {
      if ( !this.cubes ) {
        this.cubes = new THREE.Group();
        this.scene.add( this.cubes );
      }
      this.cubes.add(cube);
    }
  }

  removeCube( options ) {
    if ( !this[ options.group ] ) {
      console.log( `CubeDrawer: The ${options.group} group does not exist.` );
      return null;
    }

    this[options.group].remove( _.find( this[options.group].children, (cube) => {
      return cube.name === options.node;
    }));
  }

  setLevelUpPosition() {

    let node = this._game.levelUpPosition;

    if ( !this.sphere ) {
      let geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
      let material = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        specular: 0x555555,
        shininess: 30,
      });
      this.sphere = new THREE.Mesh( geometry, material );
      this.scene.add( this.sphere );
    }

    if ( !this.levelUpBeacons ) {
      this.levelUpBeacons = new THREE.Group();
      for ( let i = 0; i < 4; i++ ) {
        let geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
        let material = new THREE.MeshPhongMaterial( { color: "#FF2300", specular: 0x555555, shininess: 30 } );
        let beacon = new THREE.Mesh( geometry, material );
        this.levelUpBeacons.add( beacon );
      }
      this.scene.add( this.levelUpBeacons );
    }

    this.sphere.position.set( node[0], node[1], node[2] );

    // get the x position at the edge of the board
    let xEdge = _.max( this.boundaryCubes.children, (edge) => {
      return edge.position.x;
    }).position.x;
    // get the y position at the edge of the board
    let yEdge = _.max( this.boundaryCubes.children, (edge) => {
      return edge.position.y;
    }).position.y;

    this.levelUpBeacons.children[0].position.set( -0.9, node[1], node[2] );
    this.levelUpBeacons.children[1].position.set( node[0], -0.9, node[2] );
    this.levelUpBeacons.children[2].position.set( node[0], yEdge-0.1, node[2] );
    this.levelUpBeacons.children[3].position.set( xEdge-0.1, node[1], node[2] );

  }

  setInitialCube() {
    let head = this._game._snake.head;
    this.addCube({
      group: 'cubes',
      color: this.colors.cubes,
      pos: head
    });
  }

  setNodeCubes() {
    let nodes = this._game._snake.nodes;

    let head = nodes[ nodes.length-1 ];

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
      this.removeCube({
        node,
        group: 'cubes'
      });
    });

    // add new cubes for any new snake nodes
    addNodes.forEach((node) => {
      this.addCube({
        group: 'cubes',
        color: this.colors.cubes,
        pos: node.split('$')
      });
    });

    // change cube colors at different z depths
    let highZCubes = _.forEach( this.cubes.children, (cube) => {
      cube.material.color.set( this.colors.cubes );
      if (+cube.name.split('$')[2] > head[2]) {
        cube.material.opacity = 0.5;
      } else {
        cube.material.opacity = 1.0;
      }

      let cubeZ = +cube.name.split('$')[2];
      if (cubeZ < head[2]) {
        let factor = _.min( [ head[2] - cubeZ, 4 ] );
        cube.material.color.set( util.colorLuminance( this.colors.cubes, ( -0.2 * factor ) ) );
      }
    });
  }

  setBoundaryCubePositions() {

    let edges = [];
    for ( let z = 0; z < this.limits[2]; z++ ) {
      for ( let y = 0; y < this.limits[1]; y++ ) {
        for ( let x = 0; x < this.limits[0]; x++ ) {

          if ( x === 0 ) {
            edges.push( [ -1, y, z ] );

            if ( y === 0 ) {
              edges.push( [ -1, -1, z ] );
            }
          }

          if ( x === this.limits[0] - 1 ) {
            edges.push( [ this.limits[0], y, z ] );
            if ( y === 0 ) {
              edges.push( [ this.limits[0], -1, z ] );
            }
          }

          if ( y === 0 ) {
            edges.push( [ x, - 1, z ] );
          }

          if ( y === this.limits[1] - 1) {
            edges.push( [ x, this.limits[1], z ] );

            if ( x === 0 ) {
              edges.push( [ -1, this.limits[1], z ] );
            }
            if ( x === this.limits[0] - 1 ) {
              edges.push( [ this.limits[0], this.limits[1], z ] );
            }

          }
        }
      }
    }

    edges.forEach((edge) => {
      this.addCube( {
        group: 'boundaryCubes',
        pos: edge,
        color: this.colors.boundaryCubes
      } );
    });

  }

  highlightBoundaryCubes() {
    if ( this.limits[2] === 1 ) { return null; }

    let headZ = this._game._snake.head[2];
    _.forEach( this.boundaryCubes.children, (cube) => {
      if ( cube.position.z === headZ ) {
        cube.material.color.set( util.colorLuminance( this.colors.boundaryCubes, 2.0 ) );
      } else {
        cube.material.color.set( this.colors.boundaryCubes );
      }

    });
  }

};
