import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test';

const test = route('user/terms/term');
describe(test.label, function () {
  test.setup()

  let route, sandbox, course1, course2, course3, term1, term2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();

    term1 = Ember.Object.create({id: 12345, current: true, semester: 'Fall', year: 2017});
    term2 = Ember.Object.create({id: 67890, current: false, semester: 'Winter', year: 2017});
    course1 = Ember.Object.create({id: 123, tid: 12345});
    course2 = Ember.Object.create({id: 456, tid: 12345});
    course3 = Ember.Object.create({id: 789, tid: 67890});
    sandbox.stub(route, 'modelFor')
      .withArgs('user').returns({
        courses: [course1, course2, course3],
        terms: [term1, term2]
      });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    describe('no course with the ID', function () {
      beforeEach(function () {
        sandbox.stub(route, 'transitionTo');
        route.model({course: -1});
      });

      it('should transition to term list page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('get all term data', function () {
      let model;
      beforeEach(function () {
        model = route.model({term: 12345});
      });

      it('should have returned parent route model data', function () {
        expect(model).to.eql({
          term: term1,
          terms: [term1, term2],
          allCourses: [course1, course2, course3],
          courses: [course1, course2]
        });
      });

      it('should have set dynamic title token', function () {
        expect(route.get('titleToken')).to.eql('Fall 2017');
      });
    });
  });
});
