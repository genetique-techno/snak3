
export default [
  {
    label: 'easy',
    difficulty: 'easy',
    limits: [10, 10, 1],
    interval: 500,
    colors: {
      boundaryCubes: '#00C19B',
      cubes: '#F3F33D'
    }
  },

  {
    label: 'medium',
    difficulty: 'medium',
    limits: [10, 10, 3],
    interval: 500,
    colors: {
      boundaryCubes: '#33aacc',
      cubes: '#55ff22'
    }
  },

  {
    label: 'hard',
    difficulty: 'hard',
    limits: [15, 15, 6],
    interval: 250,
    colors: {
      boundaryCubes: '#100D9A',
      cubes: '#FFAE00'
    }
  },

  {
    label: 'impossible',
    difficulty: 'impossible',
    limits: [30, 30, 10],
    interval: 150,
    colors: {
      boundaryCubes: '#7408C7',
      cubes: '#F90018'
    }
  }
];
