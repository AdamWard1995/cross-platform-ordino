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
    describe('toggleDrawerState()', function () {
      describe('drawerOpen initially false', function () {
        beforeEach(function () {
          controller.set('drawerOpen', false);
          controller.actions.toggleDrawerState.apply(controller);
        });

        it('should set drawerOpen to true', function () {
          expect(controller.get('drawerOpen')).to.eql(true);
        });
      });

      describe('drawerOpen initially true', function () {
        beforeEach(function () {
          controller.set('drawerOpen', true);
          controller.actions.toggleDrawerState.apply(controller);
        });

        it('should set drawerOpen to false', function () {
          expect(controller.get('drawerOpen')).to.eql(false);
        });
      });
    });

    describe('goToAccountPage()', function () {
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
        controller.actions.goToAccountPage.apply(controller);
      });

      it('should call to transition to user\'s account page', function () {
        expect(transitionToStub).to.have.been.calledWithExactly('user', 'abc123');
      });
    });
  });
});
