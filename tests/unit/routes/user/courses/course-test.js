import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/courses/course')
describe(test.label, function () {
  test.setup()

  let route, sandbox, course1, course2, course3;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();
    course1 = Ember.Object.create({id: 123});
    course2 = Ember.Object.create({id: 456});
    course3 = Ember.Object.create({id: 789});
    sandbox.stub(route, 'modelFor')
      .withArgs('user.courses').returns([course1, course2, course3]);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    describe('user is not authenticated', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: false}));
        sandbox.stub(route, 'transitionTo');
        route.model({course: 123});
      });

      it('should transition to index', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('index');
      });
    });

    describe('no course with the ID', function () {
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        sandbox.stub(route, 'transitionTo');
        route.model({course: -1});
      });

      it('should transition to course list page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('user.courses');
      });
    });

    describe('get class times and course work for course', function () {
      let model;
      beforeEach(function () {
        route.set('session', Ember.Object.create({isAuthenticated: true}));
        route.store = {query: sinon.stub()};
        route.store.query.withArgs('course-work', sinon.match.any).returns(new Ember.RSVP.Promise(function (resolve) {
          resolve({toArray: function () {return ['foo'];}});
        }));
        route.store.query.withArgs('class-time', sinon.match.any).returns(new Ember.RSVP.Promise(function (resolve) {
          resolve({toArray: function () {return ['bar'];}});
        }));
        model = route.model({course: 123});
      });

      it('should have returned parent route model', function () {
        expect(model._result).to.eql({course: course1, classTimes: ['bar'], courseWork: ['foo']});
      });
    });
  });

  describe('setupController()', function () {
    let controller;
    beforeEach(function () {
      controller = {set: sinon.stub()};
      route.setupController(controller);
    });

    it('should have set list of courses', function () {
      expect(controller.set).to.have.been.calledWithExactly('courses', [course1, course2, course3]);
    });
  });
});
