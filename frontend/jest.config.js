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
    'src/components/**/*.{js,jsx}', // Specify folders and file types to collect coverage from
    'src/utils/**/*.{js,jsx}',
    'src/hooks/**/*.{js,jsx}',
    'src/store/**/*.{js,jsx}',
    '!**/node_modules/**', // Exclude node_modules
    '!src/tests/**/*.test.{js,jsx}' // Exclude test files from coverage
  ],
  coverageDirectory: 'coverage', // Output directory for coverage reports
  coverageReporters: ['html', 'text'] // Formats for the coverage reports
};
