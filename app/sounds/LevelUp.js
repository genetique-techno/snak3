module.exports = function levelUp( options = {} ) {

  let now = this.audioCtx.currentTime + (options.delay || 0);
  let step1 = now + 0.100;
  let stopNow = step1 + 0.100;

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 620;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  oscNode.frequency.linearRampToValueAtTime( 200, step1 );
  oscNode.frequency.linearRampToValueAtTime( 620, stopNow );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );

  oscNode.start( now );
  oscNode.stop( stopNow );

};
