import sinon from 'sinon'

/**
 * @param {String[]} stubbedMethods - the names of methods to stub on this selector stub
 * @returns {*} a new selector stub
 */
export function createSelectorStub (...stubbedMethods) {
  const stub = {}

  stubbedMethods.forEach((method) => {
    stub[method] = sinon.stub()
  })

  return stub
}
