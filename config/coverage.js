/* eslint-env node */
module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  useBabelInstrumenter: true,
  reporters: [
    'json',
    'html',
    'lcov',
    'text-summary'
  ]
}
