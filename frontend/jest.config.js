module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
    '^axios$': '<rootDir>/node_modules/axios/dist/axios.min.js'
  },
  testEnvironment: 'jest-environment-jsdom', // Explicitly specify the environment
  collectCoverage: true,
  collectCoverageFrom: [
    'src/store/**/*.{js,jsx}',
    'src/hooks/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
    'src/components/UI/*.{js,jsx}',
    'src/components/Lobby/Lobby.page.jsx',
    'src/components/Lobby/CreateRoomBlock.jsx',
    'src/components/Login/*.{js,jsx}',
    'src/components/Layout/Home.page.jsx',
    'src/components/Layout/NotFound.page.jsx',
    'src/components/Layout/MainLayout.jsx',
    'src/components/Layout/Footer.jsx',
    'src/components/Game/Board.jsx',
    'src/components/Game/BoardCell.jsx',
    'src/components/Game/GameController.jsx',
    'src/components/Game/GameStats.jsx',
    'src/components/Game/Messenger.jsx',
    'src/components/Game/Preview.jsx',
    'src/components/Game/Previews.jsx',
    'src/components/Game/Rules.jsx',
    'src/components/Game/Tetris.jsx',
    '!**/node_modules/**', // Exclude node_modules
    '!src/tests/**/*.test.{js,jsx}' // Exclude test files from coverage
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['html', 'text'], // Formats for the coverage reports
  setupFiles: ['jest-canvas-mock'], // jest-canvas-mock setup
  fakeTimers: {
    enableGlobally: true
  }
};
