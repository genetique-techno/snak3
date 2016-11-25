import _ from "underscore";

class PassRegistry {

  constructor() {
    this.registry = [];
  }

  register( pass ) {
    this.registry.push( pass );
    // console.log('Registered Pass: ', pass.scene.id+pass.camera.id);
    // console.log('Pass Registry: ', this.registry );
  }

  remove( inPass ) {
    const index = _.findIndex( this.registry, (pass) => {
      return (pass.scene.id+pass.camera.id) === (inPass.scene.id+inPass.camera.id);
    });

    this.registry = this.registry.splice( index, 1 );
    // console.log('Removed Pass: ', inPass.scene.id+inPass.camera.id);
  }

  resizeAll( width, height ) {
    _.forEach( this.registry, (pass) => {

      if ( pass.camera.type === "PerspectiveCamera" ) {
        pass.camera.aspect = width / height;
        pass.camera.updateProjectionMatrix();
        // console.log('resized PerspectiveCamera');
      }

      if ( pass.camera.type === "OrthographicCamera" ) {
        pass.camera.left = width / -2;
        pass.camera.right = width / 2;
        pass.camera.top = height / 2;
        pass.camera.bottom = height / -2;
        pass.camera.updateProjectionMatrix();
        // console.log('resized OrthographicCamera');
      }

    });
  }

  removeAll() {
    this.registry = [];
    // console.log('Cleared passRegistry');
  }
}

export default new PassRegistry();
