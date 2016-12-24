Snak3 Class Map

Pass
  extends EventEmitter
  Scene
  Camera
  loader()
  unloader()


OverlayPass
  extends Pass

MainPass
  extends Pass

Menu
  extends OverlayPass
  acceptSelection( newState )
  setSelection( index )

CubeDrawer
  extends MainPass
  addGrid
  addCube
  removeCube
  setLevelUpPosition
  setInitialCube
  setNodeCubes
  setBoundaryCubePositions
  highlightBounderCubes

GamePass
  extends CubeDrawer

TitlePass
  extends CubeDrawer
