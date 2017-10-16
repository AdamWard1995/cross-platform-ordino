import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test';

const test = route('user/courses/course');
describe(test.label, function () {
  test.setup()

  let route, sandbox, category1, category2, class1, class2, class3, course1, course2, course3, term1, term2, work1, work2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();

    term1 = Ember.Object.create({id: 12345, current: true});
    term2 = Ember.Object.create({id: 67890, current: false});
    course1 = Ember.Object.create({id: 123, tid: 12345});
    course2 = Ember.Object.create({id: 456, tid: 12345});
    course3 = Ember.Object.create({id: 789, tid: 67890});
    class1 = Ember.Object.create({id: 12, cid: 123});
    class2 = Ember.Object.create({id: 34, cid: 123});
    class3 = Ember.Object.create({id: 56, cid: 789});
    work1 = Ember.Object.create({id: 78, cid: 123});
    work2 = Ember.Object.create({id: 90, cid: 789});
    category1 = Ember.Object.create({id: 13579, label: 'Assignment'});
    category2 = Ember.Object.create({id: 24680, label: 'Reading'});
    sandbox.stub(route, 'modelFor')
      .withArgs('user').returns({
        categories: [category1, category2],
        classTimes: [class1, class2, class3],
        courses: [course1, course2, course3],
        courseWork: [work1, work2],
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

      it('should transition to course list page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('user.courses');
      });
    });

    describe('get all course data', function () {
      let model;
      beforeEach(function () {
        model = route.model({course: 123});
      });

      it('should have returned parent route model data', function () {
        expect(model).to.eql({
          course: course1,
          allWork: [work1, work2],
          categories: [category1, category2],
          classTimes: [class1, class2],
          courseWork: [work1],
          termCourses: [course1, course2],
          allCourses: [course1, course2, course3],
          terms: [term1, term2]
        });
      });
    });
  });
});
