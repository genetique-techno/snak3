/**
 * This file exports all major directories and paths used in the entire application.
 */
var path = require('path');

var paths = module.exports.paths = {};

// Requiring this file from anywhere will make paths.rootDir the path
// to whereever this file is placed
paths.rootDir = __dirname;

// App directory
paths.appDir = path.join( paths.rootDir, 'app' );
paths.appSrcDir = paths.appDir;

// Server directory
paths.serverDir = path.join( paths.rootDir, 'server' );

// Build directory
paths.buildDir = path.join( paths.rootDir, 'build' );

// Sheet build directory
paths.sheetBuildDir = path.join( paths.rootDir, 'examples' );

// Node modules directory
paths.modulesDirectory = path.join( paths.rootDir, 'node_modules' );
