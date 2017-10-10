import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test';

const test = route('sign-in');
describe(test.label, function () {
  test.setup();

  let route;
  beforeEach(function () {
    route = this.subject();
  });

  describe('model()', function () {
    it('should return empty model', function () {
      expect(route.model()).to.eql({});
    });
  });

  describe('resetController()', function () {
    let setStub;
    beforeEach(function () {
      setStub = sinon.stub();
      route.resetController({set: setStub});
    });

    it('should have reset email', function () {
      expect(setStub).to.have.been.calledWithExactly('email', null);
    });

    it('should have reset password', function () {
      expect(setStub).to.have.been.calledWithExactly('password', null);
    });

    it('should have reset errorMessage', function () {
      expect(setStub).to.have.been.calledWithExactly('errorMessage', null);
    });

    it('should have reset emailNotVerified', function () {
      expect(setStub).to.have.been.calledWithExactly('emailNotVerified', false);
    });
  });
});
