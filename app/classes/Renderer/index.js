import _ from 'underscore';
import THREE from 'three';
import TWEEN from 'tween.js';
import util from 'app/util';

export default class Renderer {

  constructor( div ) {
    this.div = div;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, div.clientWidth / div.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( div.clientWidth, div.clientHeight );
    div.appendChild( this.renderer.domElement );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    window.addEventListener( 'mousedown', this.cubeClick.bind( this ) );

    this.addFog({ new: 300, far: 800 });
    this.render();
    this.head = [];

    this.ambientLight = new THREE.AmbientLight( 0x404040, 2 );
    this.scene.add( this.ambientLight );
    console.log(this.ambientLight);

    this.light = new THREE.PointLight( 0xffffff, 1, 100, 1 );
    this.scene.add(this.light);
  }

  initializeGame( limits, nodes, headNode, initLevelUpPos, cubeOptions, boundaryCubeOptions ) {
    this.cubeOptions = cubeOptions;
    this.boundaryCubeOptions = boundaryCubeOptions;
    this.limits = limits;

    this.setBoundaryCubes( limits, boundaryCubeOptions );
    this.setNodeCubes( nodes, cubeOptions );
    this.highlightBoundaryCubes( headNode, boundaryCubeOptions );
    this.setLevelUpPosition( initLevelUpPos );
    this.setCameraPosition( limits, headNode );

    this.addGrid({
      size: 100,
      step: 200
    });

  }

  tick( nodes, headNode, currentLevelUpPos ) {
    this.setNodeCubes( nodes, this.cubeOptions );
    this.highlightBoundaryCubes( headNode, this.boundaryCubeOptions );
    this.setLevelUpPosition( currentLevelUpPos );
    this.moveCameraPosition( this.limits, headNode );
  }

  cubeClick( e ) {
    this.mouse.x = 2 * (e.clientX / this.div.clientWidth) - 1;
    this.mouse.y = 1 - 2 * ( e.clientY / this.div.clientHeight );

    this.raycaster.setFromCamera( this.mouse, this.camera ); 
    let intersects = this.raycaster.intersectObjects( this.cubes.children );

    console.log(intersects[0]);
  }

  addFog( options = {} ) {
    options = _.defaults(options, { color: 0x000000, near: 100, far: 500 });

    this.scene.fog = new THREE.Fog( options.color, options.near, options.far );
  }

  addGrid( options = {} ) {
    options = _.defaults(options, { size: 500, step: 50 });

    let grid = new THREE.GridHelper( options.size, options.step, options.color, options.color );
    console.log(grid);
    grid.rotation.set( 1.5707, 0, 0 );
    grid.position.set( -0.5, -0.5, -0.5);
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

    let material = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 30 } );
    material.transparent = true;
    material.opacity = 1.0;

    let cube = new THREE.Mesh(geometry, material );

    cube.name = name || pos.join('$');
    cube.position.set( s*pos[0], s*pos[1], s*pos[2] );

    if (group) {
      // material.wireframe = true;
      // material.wireframeLinewidth = 2;
      this[group].add(cube);
    } else {
      this.cubes.add(cube);    
    }
  }

  setLevelUpPosition( node, options ) {
    if ( !node ) { return };
    if ( !this.sphere ) {
      let geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
      let material = new THREE.MeshPhongMaterial( {color: 0xffff00, specular: 0x555555, shininess: 30 } );
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

    // change the positions of the beacons
    this._setLevelUpBeaconLocations( node );

    this.sphere.position.set( node[0], node[1], node[2] );
  }

  _setLevelUpBeaconLocations( node ) {
    // get the x position at the edge of the board
    let xEdge = _.max( this.gameBoard.children, (edge) => {
      return edge.position.x;
    }).position.x;
    // get the y position at the edge of the board
    let yEdge = _.max( this.gameBoard.children, (edge) => {
      return edge.position.y;
    }).position.y;

    this.levelUpBeacons.children[0].position.set( -0.9, node[1], node[2] );
    this.levelUpBeacons.children[1].position.set( node[0], -0.9, node[2] );
    this.levelUpBeacons.children[2].position.set( node[0], yEdge-0.1, node[2] );
    this.levelUpBeacons.children[3].position.set( xEdge-0.1, node[1], node[2] );
  }

  setNodeCubes( nodes, options ) {
    if ( !this.cubes ) {
      this.cubes = new THREE.Group();
      this.scene.add( this.cubes );
    }

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
    
    // change cube colors at different z depths
    let highZCubes = _.forEach( this.cubes.children, (cube) => {
      cube.material.color.set( options.color );
      if (+cube.name.split('$')[2] > head[2]) {
        cube.material.opacity = 0.5;
      } else {
        cube.material.opacity = 1.0;
      }

      let cubeZ = +cube.name.split('$')[2];
      if (cubeZ < head[2]) {
        let factor = _.min( [ head[2] - cubeZ, 4 ] );
        cube.material.color.set( util.colorLuminance( options.color, ( -0.2 * factor ) ) );
      }
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

  highlightBoundaryCubes( head, options ) {

    let headZ = head[2];
    _.forEach( this.gameBoard.children, (cube) => {

      if ( cube.position.z === headZ ) {
        cube.material.color.set( util.colorLuminance( options.color, 2.0 ) );
      } else {
        cube.material.color.set( options.color );
      }

    });
  }

  setCameraPosition( gameBoard, head ) {
    let headZ = head[2];

    let pos = [
      gameBoard[0]/2 + 0.1*(head[0]-gameBoard[0]/2),
      gameBoard[1]/2 + 0.1*(head[1]-gameBoard[0]/2),
      _.max( gameBoard.slice(0,2) ) + headZ
    ];

    this.camera.position.set( pos[0], pos[1], pos[2] );
    this.light.position.set( pos[0]+5, pos[1]+5, pos[2] )


    console.log( this.camera, this.light );
  }

  moveCameraPosition( gameBoard, head ) {

    let headZ = head[2];
    let camZ = this.camera.position.z;
    let newCamZ = _.max( gameBoard.slice(0,2) ) + headZ;

    let headX = head[0];
    let camX = this.camera.position.x;
    let newCamX = gameBoard[0]/2 + 0.1*(headX-gameBoard[0]/2);

    let headY = head[1];
    let camY = this.camera.position.y;
    let newCamY = gameBoard[1]/2 + 0.1*(headY-gameBoard[0]/2);
    
    this.camZTween = new TWEEN.Tween( this.camera.position )
      .to( { x: newCamX, y: newCamY, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

    this.lightTween = new TWEEN.Tween( this.light.position )
      .to( { x: newCamZ+5, y: newCamY+5, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

  }

  render() {
    window.requestAnimationFrame( this.render.bind( this ) );

    TWEEN.update();

    this.renderer.render( this.scene, this.camera );
  }
}
