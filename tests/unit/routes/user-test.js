import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user')
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
    beforeEach(function () {
      route.accessDenied = sinon.stub();
    });

    describe('user is not logged in', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: false}));
        route.model({}, {foo: 'bar'});
      });

      it('should have denied access', function () {
        expect(route.accessDenied).to.have.been.calledWithExactly({foo: 'bar'});
      });
    });

    describe('trying to access another user\'s page', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: true, currentUser: {uid: 456}}));
        route.model({user: 123}, {foo: 'bar'});
      });

      it('should have denied access', function () {
        expect(route.accessDenied).to.have.been.calledWithExactly({foo: 'bar'});
      });
    });

    describe('user is logged in', function () {
      let model;
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: true, currentUser: {uid: 12345}}));
        route.store = {
          findRecord: sinon.stub()
        };
        route.store.findRecord.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({foo: 'bar'});
        }));
        model = route.model({user: 12345});
      });

      it('should have queried for all user courses', function () {
        expect(route.store.findRecord).to.have.been.calledWithExactly('user', 12345);
      });

      it('should have returned all the reponse courses', function () {
        expect(model._result).to.eql({foo: 'bar'});
      });
    });
  });
});
