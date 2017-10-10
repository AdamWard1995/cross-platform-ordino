import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('application')
describe(test.label, function () {
  test.setup();

  let controller;
  beforeEach(function () {
    controller = this.subject();
  });

  describe('observeSession', function () {
    beforeEach(function () {
      sinon.stub(controller, 'send');
    });

    describe('session closing and authenticated', function () {
      beforeEach(function () {
        controller.set('session', Ember.Object.create({isClosing: true, isAuthenticated: true}));
        return wait();
      });

      it('Should have sent accessDenied action', function () {
        expect(controller.send).to.have.been.calledWithExactly('accessDenied');
      });
    });

    describe('session closing and was not authenticated', function () {
      beforeEach(function () {
        controller.set('session', Ember.Object.create({isClosing: true, isAuthenticated: false}));
        return wait();
      });

      it('Should not have sent accessDenied action', function () {
        expect(controller.send).to.have.callCount(0);
      });
    });

    describe('session not closing and not authenticated', function () {
      beforeEach(function () {
        controller.set('session', Ember.Object.create({isClosing: false, isAuthenticated: false}));
        return wait();
      });

      it('Should not have sent accessDenied action', function () {
        expect(controller.send).to.have.callCount(0);
      });
    });

    describe('session not closing and is authenticated', function () {
      beforeEach(function () {
        controller.set('session', Ember.Object.create({isClosing: false, isAuthenticated: true}));
        return wait();
      });

      it('Should not have sent accessDenied action', function () {
        expect(controller.send).to.have.callCount(0);
      });
    });
  });

  describe('Actions', function () {
    describe('goToAccountDashboard()', function () {
      let transitionToStub;
      beforeEach(function () {
        transitionToStub = sinon.stub();
        const sessionStub = sinon.stub();
        const currentUser = {
          uid: 'abc123'
        };
        sessionStub.get = sinon.stub();
        sessionStub.get.withArgs('currentUser').returns(currentUser);
        controller.set('session', sessionStub);
        controller.transitionToRoute = transitionToStub;
        controller.actions.goToAccountDashboard.apply(controller);
      });

      it('should call to transition to user\'s account dashboard page', function () {
        expect(transitionToStub).to.have.been.calledWithExactly('user', 'abc123');
      });
    });

    describe('goToAccountDetails()', function () {
      let transitionToStub;
      beforeEach(function () {
        transitionToStub = sinon.stub();
        const sessionStub = sinon.stub();
        const currentUser = {
          uid: 'abc123'
        };
        sessionStub.get = sinon.stub();
        sessionStub.get.withArgs('currentUser').returns(currentUser);
        controller.set('session', sessionStub);
        controller.transitionToRoute = transitionToStub;
        controller.actions.goToAccountDetails.apply(controller);
      });

      it('should call to transition to user\'s account details page', function () {
        expect(transitionToStub).to.have.been.calledWithExactly('user.account', 'abc123');
      });
    });
  });
});
