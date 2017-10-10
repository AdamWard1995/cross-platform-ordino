import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/account');
describe(test.label, function () {
  test.setup();

  let route, sandbox;
  beforeEach(function () {
    route = this.subject();
    sandbox = sinon.sandbox.create();
    route = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    beforeEach(function () {
      sandbox.stub(route, 'modelFor')
        .withArgs('user').returns({foo: 'bar'});
    });

    it('should return parent route\'s model', function () {
      expect(route.model()).to.eql({foo: 'bar'});
    });
  });
});
