function change( options = {} ) {

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

function accept( options = {} ) {

  let now = this.audioCtx.currentTime + (options.delay || 0);
  let duration = 0.200;
  let stopNow = now + duration;

  let oscNode = this.audioCtx.createOscillator();
  let gainNode = this.audioCtx.createGain();

  // set frequency and type
  oscNode.frequency.value = 370;
  oscNode.frequency.setValueAtTime( oscNode.frequency.value, now );
  oscNode.frequency.linearRampToValueAtTime( 300, stopNow );
  oscNode.type = 'triangle';

  // set gain
  gainNode.gain.value = 0.35;
  // gainNode.gain.setValueAtTime( gainNode.gain.value, now );
  // gainNode.gain.exponentialRampToValueAtTime( 0.01, 7*duration/8 );

  oscNode.connect( gainNode );
  gainNode.connect( this.audioCtx.destination );

  oscNode.start( now );
  oscNode.stop( stopNow );

}

module.exports = {
  change,
  accept
};
