
export default [
  {
    type: 'game',
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
    type: 'game',
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
    type: 'game',
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
    type: 'game',
    label: 'impossible',
    difficulty: 'impossible',
    limits: [30, 30, 10],
    interval: 150,
    colors: {
      boundaryCubes: '#7408C7',
      cubes: '#F90018'
    }
  },

  {
    type: 'separator',
    label: ''
  },

  {
    type: 'other',
    label: 'how to play',
    func: 'newInstructions'
  },

  {
    type: 'other',
    label: 'high scores',
    func: 'newHighScores'
  }

];
