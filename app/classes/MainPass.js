import Pass from "./Pass";
import passRegistry from "app/controllers/passRegistry"

export default class MainPass extends Pass {

  constructor( composer ) {
    super( composer );

  }

  loadOverlay( overlay ) {

    if ( !overlay ) return console.log( "loadOverlay called without a overlay" );
    if ( !overlay.renderPass ) return console.log( "overlay must have a renderPass object" );

    this.composer.addPass( overlay.renderPass );
    passRegistry.register( overlay );
  }

  setInitialCameraPosition() {
    return console.log( "No implementation of setInitialCameraPosition" );
  }

  moveCameraPosition() {
    return console.log( "No implementation of moveCameraPosition" );
  }

}
