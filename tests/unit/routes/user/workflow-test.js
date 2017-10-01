import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/workflow')
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
    describe('user is not logged in', function () {
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns(Ember.Object.create({}));
        sandbox.stub(route, 'transitionTo');
        route.model();
      });

      it('should have transitioned to home page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('index');
      });
    });

    describe('no current term', function () {
      let model, user;
      beforeEach(function () {
        user = Ember.Object.create({id: 123456789});
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns(user);
        route.store = {
          query: sinon.stub()
        };
        route.store.query.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({
            toArray: function () {
              return [Ember.Object.create({current: false})];
            }
          });
        }));
        model = route.model();
      });

      it('should have queried for all user terms', function () {
        expect(route.store.query).to.have.been.calledWithExactly('term', {
          orderBy: 'uid',
          equalTo: 123456789
        });
      });

      it('should indicate no current term', function () {
        expect(model._result).to.eql({'no-current-term': true});
      });
    });

    describe('is a current term', function () {
      let model, user, term, course1, course2, course3, work1, work2, work3;
      beforeEach(function () {
        user = Ember.Object.create({id: 123456789});
        course1 = Ember.Object.create({id: 135});
        course2 = Ember.Object.create({id: 246});
        course3 = Ember.Object.create({id: 791});
        work1 = Ember.Object.create({id: 123, cid: 135});
        work2 = Ember.Object.create({id: 456, cid: 246});
        work3 = Ember.Object.create({id: 789, cid: 246});
        term = Ember.Object.create({current: true, id: 12345});

        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns(user);
        route.store = {
          query: sinon.stub()
        };
        route.store.query.withArgs('term', sinon.match.any).returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({
            toArray: function () {
              return [term];
            }
          });
        }));
        route.store.query.withArgs('course', sinon.match.any).returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({
            toArray: function () {
              return [course1, course2, course3];
            }
          });
        }));
        route.store.query.withArgs('course-work', sinon.match.any).returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({
            toArray: function () {
              return [work1, work2, work3];
            }
          });
        }));
        model = route.model();
      });

      it('should have queried for all user terms', function () {
        expect(route.store.query).to.have.been.calledWithExactly('term', {
          orderBy: 'uid',
          equalTo: 123456789
        });
      });

      it('should have returned course1 group', function () {
        expect(model._result[0]).to.eql({course: course1, courseWork: [work1]});
      });

      it('should have returned course2 group', function () {
        expect(model._result[1]).to.eql({course: course2, courseWork: [work2, work3]});
      });

      it('should have returned course3 group', function () {
        expect(model._result[2]).to.eql({course: course3, courseWork: []});
      });
    });
  });
});
