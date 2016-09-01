import _ from 'underscore';
import util from 'app/util';

require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/shaders/CopyShader.js' );
require( 'expose?THREE!imports?this=>global!exports?THREE!three/examples/js/postprocessing/EffectComposer.js' );
require( 'imports?this=>global!exports?THREE!three/examples/js/postprocessing/RenderPass.js' );

import CubeDrawer from 'app/views/CubeDrawer';
import Game from 'app/controllers/Game.js';

export default class GamePass extends CubeDrawer {

  constructor( gameType ) {
    super();

    util.assignKeys.call( this, gameType ); // limits, interval, colors
    this._game = new Game( gameType );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.__GAME_DIV__.clientWidth / window.__GAME_DIV__.clientHeight, 0.1, 1000);

    this.ambientLight = new THREE.AmbientLight( 0x404040, 2 );
    this.scene.add( this.ambientLight );

    this.light = new THREE.PointLight( 0xffffff, 1, 100, 1 );
    this.scene.add( this.light );

    this.setBoundaryCubePositions();
    this.setInitialCube();
    this.highlightBoundaryCubes();
    this.setLevelUpPosition( this._game.levelUpPosition );
    this.setInitialCameraPosition();
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.renderPass.renderToScreen = true;
    this.renderPass.setSize( window.__GAME_DIV__.width, window.__GAME_DIV__.height );

    this.addGrid({
      size: 100,
      step: 200
    });

    this._game.on( 'tick', this.tick.bind( this ) );
    this.loader();

  }

  // unloader() {
  //   this.fogTween = new TWEEN.Tween( this.scene.fog )
  //     .to( { near: 0, far: 0 }, 3000 )
  //     .start();

  // }

  loader() {
    var lim = this.limits[2];

    this.scene.fog = new THREE.Fog( 0x000000, 0, 0 );

    this.fogTween = new TWEEN.Tween( this.scene.fog )
      .to( { near: lim+10, far: 10*lim+10 }, 2000 )
      .start();
  }

  tick( { head, nodes, levelUpPosition } ) {
    this.setNodeCubes();
    this.highlightBoundaryCubes();
    this.setLevelUpPosition( levelUpPosition );
    this.moveCameraPosition();
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

  setInitialCameraPosition() {

    let head = this._game._snake.head;

    let pos = [
      this.limits[0]/2 + 0.1*(head[0]-this.limits[0]/2),
      this.limits[1]/2 + 0.1*(head[1]-this.limits[0]/2),
      _.max( this.limits.slice(0,2) ) + head[2]
    ];

    this.camera.position.set( pos[0], pos[1], pos[2] );
    this.light.position.set( pos[0]+5, pos[1]+5, pos[2] )
  }

  moveCameraPosition() {

    let headZ = this._game._snake.head[2];
    let camZ = this.camera.position.z;
    let newCamZ = _.max( this.limits.slice(0,2) ) + headZ;

    let headX = this._game._snake.head[0];
    let camX = this.camera.position.x;
    let newCamX = this.limits[0]/2 + 0.1*(headX-this.limits[0]/2);

    let headY = this._game._snake.head[1];
    let camY = this.camera.position.y;
    let newCamY = this.limits[1]/2 + 0.1*(headY-this.limits[0]/2);
    
    this.camZTween = new TWEEN.Tween( this.camera.position )
      .to( { x: newCamX, y: newCamY, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

    this.lightTween = new TWEEN.Tween( this.light.position )
      .to( { x: newCamZ+5, y: newCamY+5, z: newCamZ }, 1000 )
      .easing( TWEEN.Easing.Linear.None )
      .start();

  }
}
