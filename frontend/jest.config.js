module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },

  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/axios.min.js'
  },

  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}', // Specify folders and file types to collect coverage from
    'src/utils/**/*.{js,jsx}',
    '!**/node_modules/**', // Exclude node_modules
    '!src/components/**/*.test.{js,jsx}', // Exclude test files from coverage
    '!src/utils/**/*.test.{js,jsx}'
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['html', 'text'] // Formats for the coverage reports
};
