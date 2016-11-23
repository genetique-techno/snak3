import { noise } from 'app/sounds/utils.js';

function normal( options = {} ) {

  let now = this.audioCtx.currentTime + (options.delay || 0);
  let duration = 0.100;
  let stopNow = now + duration;

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 600;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  oscNode.frequency.linearRampToValueAtTime( 620, stopNow );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;
  gainNode.gain.setValueAtTime( gainNode.gain.value, now );
  gainNode.gain.exponentialRampToValueAtTime( 0.01, now+7*duration/8 );

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );

  oscNode.start( now );
  oscNode.stop( stopNow );

}

function high( options = {} ) {

  let now = this.audioCtx.currentTime + (options.delay || 0);
  let duration = 0.100;
  let stopNow = now + duration;

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 620;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  oscNode.frequency.linearRampToValueAtTime( 640, stopNow );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;
  gainNode.gain.setValueAtTime( gainNode.gain.value, now );
  gainNode.gain.exponentialRampToValueAtTime( 0.01, now+7*duration/8 );

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );

  oscNode.start( now );
  oscNode.stop( stopNow );

}

function low( options = {} ) {

  let now = this.audioCtx.currentTime + (options.delay || 0);
  let duration = 0.100;
  let stopNow = now + duration;

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 590;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  oscNode.frequency.linearRampToValueAtTime( 570, stopNow );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;
  gainNode.gain.setValueAtTime( gainNode.gain.value, now );
  gainNode.gain.exponentialRampToValueAtTime( 0.01, now+7*duration/8 );

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );

  oscNode.start( now );
  oscNode.stop( stopNow );

}

function crash( options = {} ) {

  const numSteps = 20;

  function *stepGeneratorFactory(now, sw, numSteps) {
    var step = 0;
    for (var i = 0; i <= numSteps; i++) {
      step++;
      yield now+(step*sw);
    }
    return step;
  }

  function *waveGeneratorFactory(startFreq, upInterval, downInterval, numSteps) {
    var step = 0;
    var freq = startFreq;
    for (var i =0; i <= numSteps; i++) {
      step++;
      yield (step%2 === 0 ? freq = freq - downInterval : freq = freq + upInterval);
    }
  }

  let sw = 0.050; //step width
  let now = this.audioCtx.currentTime + (options.delay || 0);
  var step = stepGeneratorFactory(now, sw, numSteps);
  var freq = waveGeneratorFactory(200, 60, 80, numSteps);

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 200;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  for (let i = 0; i < numSteps; i++) {
    oscNode.frequency.linearRampToValueAtTime( freq.next().value, step.next().value );
  }
  let stop = step.next().value;
  oscNode.frequency.linearRampToValueAtTime( 100, stop );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;
  // gainNode.gain.setValueAtTime( gainNode.gain.value, now );
  // gainNode.gain.exponentialRampToValueAtTime( 0.01, now+7*duration/8 );

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );


  // make noise node
  let noiseNode = noise( this.audioCtx, 2);
  let noiseGainNode = this.audioCtx.createGain();
  noiseGainNode.gain.value = 0.30;
  noiseGainNode.gain.exponentialRampToValueAtTime( 0.001, stop);
  noiseNode.connect( noiseGainNode );
  noiseGainNode.connect( this.audioCtx.destination );
  // start everything

  oscNode.start( now );
  oscNode.stop( stop );
  noiseNode.start( now );
  noiseNode.stop( stop );

}

module.exports = {
  normal,
  low,
  high,
  crash,
};
