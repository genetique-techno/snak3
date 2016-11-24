const _ = require('underscore');
const soundsObj = require('app/sounds');

function AudioEngine() {
  this.audioCtx = new ( window.AudioContext || window.webkitAudioContext() );

  this.sounds = soundsObj;
  this.muted = false;

  return;
}

AudioEngine.prototype.trigger = function( soundIdentifier, options ) {
  if ( this.muted ) { return null; }
  if ( !_.has( this.sounds, soundIdentifier ) ) { return console.log( `AudioEngine Error: no sound found for ${soundIdentifier}`); }

  this.sounds[soundIdentifier].call( this, options );
};

AudioEngine.prototype.mute = function() {
  this.muted = !this.muted;
};

module.exports = new AudioEngine();
