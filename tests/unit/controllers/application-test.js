import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('application')
describe(test.label, function () {
  test.setup();

  let controller;
  beforeEach(function () {
    controller = this.subject();
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
