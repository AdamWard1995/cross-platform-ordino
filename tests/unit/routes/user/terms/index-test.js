import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/terms/index')
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
        .withArgs('user.terms').returns('foo');
      model = route.model();
    });

    it('should use the parent routes model', function () {
      expect(route.modelFor, 'Should have got the parents model').to.have.been.calledWithExactly('user.terms');
      expect(model, 'Should have returned the parents model').to.eql('foo');
    });
  });
});
