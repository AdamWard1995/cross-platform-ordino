import Ember from 'ember'
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/terms/term')
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
    describe('user not authenticated', function () {
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user.terms').returns([Ember.Object.create({id: 12345})]);
        route.set('session', Ember.Object.create({isAuthenticated: false}));
        sandbox.stub(route, 'transitionTo');
        route.model({term: 12345});
      });

      it('should have transitioned to index', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('index');
      });
    });

    describe('term with id does not exist', function () {
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user.terms').returns([Ember.Object.create({id: 56789})]);
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        sandbox.stub(route, 'transitionTo');
        route.model({term: 12345});
      });

      it('should have transitioned to terms list', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('no terms for user', function () {
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user.terms').returns([]);
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        sandbox.stub(route, 'transitionTo');
        route.model({term: 12345});
      });

      it('should have transitioned to terms list', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('query for courses', function () {
      let model;
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user.terms').returns([Ember.Object.create({id: 12345})]);
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        route.store = {query: sinon.stub()};
        route.store.query.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({toArray: function (){return [Ember.Object.create({id: 67890})]}});
        }));
        model = route.model({term: 12345});
      });

      it('should have queried for courses for the term', function () {
        expect(route.store.query).to.have.been.calledWithExactly('course', {orderBy: 'tid', equalTo: 12345});
      });

      it('should have returned array of courses', function () {
        expect(model._result.courses, 'Should have fetched one course').to.have.length(1);
        expect(model._result.courses[0].get('id'), 'Fetched course should have expected ID').to.eql(67890);
      });

      it('should have term in the model', function () {
        expect(model._result.term.get('id')).to.eql(12345);
      });
    });
  });

  describe('setupController()', function () {
    let controller;
    beforeEach(function () {
      sandbox.stub(route, 'modelFor')
        .withArgs('user.terms').returns([{foo: 'bar'}, {foo: 'baz'}]);
      sandbox.stub(route, 'set');
      controller = {set: sinon.stub()};
      route.setupController(controller)
    });

    it('should have added list of terms to the controller', function () {
      expect(controller.set).to.have.been.calledWithExactly('terms', [{foo: 'bar'}, {foo: 'baz'}]);
    });
  });
});
