import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('application');
describe(test.label, function () {
  test.setup();

  let route, sandbox, fetchStub, catchStub, closeStub;
  beforeEach(function () {
    fetchStub = sinon.stub();
    catchStub = sinon.stub();
    closeStub = sinon.stub();
    fetchStub.returns({catch: catchStub});
    this.register('service:session', Ember.Service.extend({
      fetch: fetchStub
    }));
    sandbox = sinon.sandbox.create();
    route = this.subject();
    route.get('session').set('fetch', fetchStub);
    route.get('session').set('close', closeStub);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('title()', function () {
    describe.skip('running as electron app', function () {
      let oldProcess;
      beforeEach(function () {
        oldProcess = window.process;
        window.process = {versions: {electron: "1.2.3"}};
      });

      afterEach(function () {
        window.process = oldProcess;
      });

      it('should return \'Ordino\' when tokens provided', function () {
        expect(route.title(['Sign in'])).to.eql('Ordino');
      });

      it('should return \'Ordino\' when no tokens provided', function () {
        expect(route.title([])).to.eql('Ordino');
      });
    });

    describe('running as web app', function () {
      it('should include pnly token in title when only one', function () {
        expect(route.title(['Sign in'])).to.eql('Sign in - Ordino');
      });

      it('should only include last token in title when there is multiple', function () {
        expect(route.title(['Courses', 'COMP 4004', 'COMP 4004 Report'])).to.eql('COMP 4004 Report - Ordino');
      });

      it('should return \'Ordino\' when no tokens provided', function () {
        expect(route.title([])).to.eql('Ordino');
      });
    });
  });

  describe('beforeModel()', function () {
    beforeEach(function () {
      route.beforeModel();
    });

    it('should have fetched firebase data', function () {
      expect(fetchStub).to.have.callCount(1);
    });

    it('should catch any excpetions', function () {
      expect(catchStub).to.have.callCount(1);
    });
  });

  describe('model()', function () {
    it('should return empty model', function () {
      expect(route.model()).to.eql({});
    });
  });

  describe('Actions', function () {
    describe('accessDenied()', function () {
      beforeEach(function () {
        sandbox.stub(route, 'transitionTo');
        route.actions.accessDenied.apply(route);
      });

      it('should have transitioned to home page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('index');
      });
    });

    describe('signOut()', function () {
      beforeEach(function () {
        route.actions.signOut.apply(route);
      });

      it('should closed the session', function () {
        expect(route.get('session').get('close')).to.callCount(1);
      });
    });

    describe('refreshModel()', function () {
      beforeEach(function () {
        sandbox.stub(route, 'refresh');
        route.actions.refreshModel.apply(route);
      });

      it('should have refreshed the data model', function () {
        expect(route.refresh).to.callCount(1);
      });
    });
  });
});
