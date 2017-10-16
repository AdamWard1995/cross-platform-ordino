import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/courses/index')
describe(test.label, function () {
  test.setup()

  let route, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    let model;
    beforeEach(function () {
      sandbox.stub(route, 'modelFor')
        .withArgs('user.courses').returns({
          courses: 'foo',
          terms: 'bar'
      });
      model = route.model();
    });

    it('should have returned parent route model data', function () {
      expect(model).to.eql({
        courses: 'foo',
        terms: 'bar'
      });
    });
  });
});
