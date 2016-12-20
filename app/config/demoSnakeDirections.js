module.exports = () => {

  const dirs = [
    'ArrowUp',
    'ArrowUp',
    'ControlLeft',
    'ControlLeft',
    'ArrowUp',
    'ArrowUp',
    'ArrowUp',
    'ShiftLeft',
    'ShiftLeft',
    'ArrowUp',
    'ArrowUp',

    'ArrowRight',
    'ArrowRight',
    'ArrowDown',
    'ArrowDown',
    'ControlLeft',
    'ArrowRight',
    'ArrowRight',
    'ShiftLeft',
    'ArrowUp',
    'ArrowUp',
    'ArrowRight',
    'ArrowRight',
    'ArrowRight',

    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowDown',
    'ArrowLeft',
    'ArrowDown',
    'ArrowLeft',
    'ArrowLeft',
    'ArrowLeft',
    'ArrowLeft',
    'ControlLeft',
    'ControlLeft',
    'ArrowRight',
    'ArrowRight',
    'ArrowRight',
    'ArrowRight',
    'ArrowRight',
    'ArrowDown',
    'ShiftLeft',
    'ArrowDown',
    'ArrowLeft',
    'ShiftLeft',
    'ArrowLeft',
    'ArrowDown',
    'ControlLeft',
    'ArrowLeft',
    'ControlLeft',
    'ArrowLeft',
    'ArrowLeft',
    'ArrowLeft',
    'ShiftLeft',
    'ShiftLeft',
  ];

  let index = 0;

  return {
    next: () => {
      let out;
      if ( index < dirs.length ) {
        out = dirs[index];
        index++;
      } else {
        index = 0;
        out = dirs[index];
        index++;
        // out = 'stop';
      }
      return out;
    }
  };
};
