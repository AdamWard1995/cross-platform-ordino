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
      describe('account not changed', function () {
        let model, user;
        beforeEach(function () {
          const getStub = sinon.stub();
          getStub.withArgs('accountChanged').returns(false);
          user = {get: getStub};
          route.set('session', Ember.Object.create({isAuthenticated: true, currentUser: {uid: 12345}}));
          route.get('session').close = sinon.stub();
          route.store = {
            findRecord: sinon.stub(),
            query: sinon.stub()
          };
          route.store.findRecord.returns(new Ember.RSVP.Promise(function(resolve) {
            resolve(user);
          }));
          route.store.query
            .withArgs('term', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'bar'}});
              }))
            .withArgs('course', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'baz'}});
              }))
            .withArgs('course-work', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'qux'}});
              }))
            .withArgs('class-time', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'qnx'}});
              }))
            .withArgs('category', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'dap'}});
              }));
          model = route.model({user: 12345});
        });

        it('should not have closed session', function () {
          expect(route.get('session').close).to.have.callCount(0)
        });

        it('should have queried for user record', function () {
          expect(route.store.findRecord).to.have.been.calledWithExactly('user', 12345);
        });

        it('should have queried for all user terms', function () {
          expect(route.store.query).to.have.been.calledWithExactly('term', {orderBy: 'uid', equalTo: 12345});
        });

        it('should have queried for all user courses', function () {
          expect(route.store.query).to.have.been.calledWithExactly('course', {orderBy: 'uid', equalTo: 12345});
        });

        it('should have queried for all user course work', function () {
          expect(route.store.query).to.have.been.calledWithExactly('course-work', {orderBy: 'uid', equalTo: 12345});
        });

        it('should have queried for all user class times', function () {
          expect(route.store.query).to.have.been.calledWithExactly('class-time', {orderBy: 'uid', equalTo: 12345});
        });

        it('should have queried for all user categories', function () {
          expect(route.store.query).to.have.been.calledWithExactly('category', {orderBy: 'uid', equalTo: 12345});
        });

        it('should have returned all the reponses', function () {
          expect(model._result).to.eql({
            user,
            terms: 'bar',
            courses: 'baz',
            courseWork: 'qux',
            classTimes: 'qnx',
            categories: 'dap'
          });
        });
      });

      describe('account not changed', function () {
        let model, user;
        beforeEach(function () {
          const getStub = sinon.stub();
          getStub.withArgs('accountChanged').returns(true);
          user = {get: getStub};
          route.set('session', Ember.Object.create({isAuthenticated: true, currentUser: {uid: 12345}}));
          route.get('session').close = sinon.stub();
          route.store = {
            findRecord: sinon.stub(),
            query: sinon.stub()
          };
          route.store.findRecord.returns(new Ember.RSVP.Promise(function(resolve) {
            resolve(user);
          }));
          route.store.query
            .withArgs('term', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'bar'}});
              }))
            .withArgs('course', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'baz'}});
              }))
            .withArgs('course-work', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'qux'}});
              }))
            .withArgs('class-time', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'qnx'}});
              }))
            .withArgs('category', {orderBy: 'uid', equalTo: 12345})
              .returns(new Ember.RSVP.Promise(function(resolve) {
                resolve({toArray: function () {return 'dap'}});
              }));
          model = route.model({user: 12345});
        });

        it('should have closed session', function () {
          expect(route.get('session').close).to.have.callCount(1)
        });

        it('should have queried for user record', function () {
          expect(route.store.findRecord).to.have.been.calledWithExactly('user', 12345);
        });

        it('should not have queried dat', function () {
          expect(route.store.query).to.have.callCount(0);
        });

        it('should have returned nothing', function () {
          expect(model._result).to.eql(undefined);
        });
      });
    });
  });
});
