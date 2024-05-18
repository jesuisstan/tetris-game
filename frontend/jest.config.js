module.exports = {
  // Other Jest configuration settings...

  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',  // Specify folders and file types to collect coverage from
    'src/utils/**/*.{js,jsx}',
    '!src/components/**/*.test.{js,jsx}',  // Exclude test files from coverage
    '!src/utils/**/*.test.{js,jsx}',
  ],
  coverageDirectory: 'coverage',  // Output directory for coverage reports
  coverageReporters: ['html', 'text'],  // Formats for the coverage reports
};