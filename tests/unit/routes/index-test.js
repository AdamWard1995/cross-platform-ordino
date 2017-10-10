import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('index');
describe(test.label, function () {
  test.setup();

  let route, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('beforeModel()', function () {
    let sendStub;
    beforeEach(function () {
      sendStub = sinon.stub();
      sandbox.stub(route, 'controllerFor')
        .withArgs('application').returns({send: sendStub});
    });

    describe('session is authenticated', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        route.beforeModel();
      });

      it('should have gone to account dashboard', function () {
        expect(sendStub).to.have.been.calledWithExactly('goToAccountDashboard');
      });
    });

    describe('session is not authenticated', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: false}));
        route.beforeModel();
      });

      it('should have done nothing', function () {
        expect(sendStub).to.have.callCount(0);
      });
    });
  });

  describe('model()', function () {
    it('should return empty model', function () {
      expect(route.model()).to.eql({});
    });
  });
});
