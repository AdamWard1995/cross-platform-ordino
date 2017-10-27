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
      describe('on user route', function () {
        beforeEach(function () {
          controller.set('router', Ember.Object.create({currentRouteName: 'user.terms'}));
          controller.set('session', Ember.Object.create({isClosing: true, isAuthenticated: true}));
          return wait();
        });

        it('Should have sent accessDenied action', function () {
          expect(controller.send).to.have.been.calledWithExactly('accessDenied');
        });
      });

      describe('on non-user route', function () {
        beforeEach(function () {
          controller.set('router', Ember.Object.create({currentRouteName: 'sign-in'}));
          controller.set('session', Ember.Object.create({isClosing: true, isAuthenticated: true}));
          return wait();
        });

        it('Should have sent accessDenied action', function () {
          expect(controller.send).to.have.callCount(0);
        });
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

  describe('routeChanged', function () {
    describe('drawer open', function () {
      beforeEach(function () {
        controller.routeChanged();
      });

      it('Should have set drawerOpen to false', function () {
        expect(controller.get('drawerOpen')).to.eql(false);
      });
    });

    describe('drawer already closed', function () {
      beforeEach(function () {
        controller.routeChanged();
      });

      it('Should still have drawerOpen set to false', function () {
        expect(controller.get('drawerOpen')).to.eql(false);
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

    describe('goToIndex()', function () {
      let transitionToStub;
      beforeEach(function () {
        transitionToStub = sinon.stub();
        controller.transitionToRoute = transitionToStub;
        controller.actions.goToIndex.apply(controller);
      });

      it('should call to transition to index page', function () {
        expect(transitionToStub).to.have.been.calledWithExactly('index');
      });
    });

    describe('toggleShowVersionModal()', function () {
      describe('showVersionModal initially false', function () {
        beforeEach(function () {
          controller.set('showVersionModal', false);
          controller.actions.toggleShowVersionModal.apply(controller);
        });

        it('should set showVersionModal to true', function () {
          expect(controller.get('showVersionModal')).to.eql(true);
        });
      });

      describe('showVersionModal initially true', function () {
        beforeEach(function () {
          controller.set('showVersionModal', true);
          controller.actions.toggleShowVersionModal.apply(controller);
        });

        it('should set showVersionModal to false', function () {
          expect(controller.get('showVersionModal')).to.eql(false);
        });
      });
    });

    describe('toggleShowDownloadModal()', function () {
      describe('showDownloadModal initially false', function () {
        beforeEach(function () {
          controller.set('showDownloadModal', false);
          controller.actions.toggleShowDownloadModal.apply(controller);
        });

        it('should set showDownloadModal to true', function () {
          expect(controller.get('showDownloadModal')).to.eql(true);
        });
      });

      describe('showDownloadModal initially true', function () {
        beforeEach(function () {
          controller.set('showDownloadModal', true);
          controller.actions.toggleShowDownloadModal.apply(controller);
        });

        it('should set showVersionModal to false', function () {
          expect(controller.get('showDownloadModal')).to.eql(false);
        });
      });
    });
  });
});
