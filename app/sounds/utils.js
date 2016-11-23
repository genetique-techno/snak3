exports.noise = function noise(ctx, duration) {
  let channels = 1;
  let frames = ctx.sampleRate * duration;
  let buffer = ctx.createBuffer( channels, frames, ctx.sampleRate );

  let nowBuffering = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    nowBuffering[i] = Math.random() * 2 - 1;
  }

  var source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
};
