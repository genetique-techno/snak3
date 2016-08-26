import _ from 'underscore';

class CubeDrawer {
  
  constructor() {}
  
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

};

export default CubeDrawer;
