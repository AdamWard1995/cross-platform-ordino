import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test';

const test = route('user/workflow');
describe(test.label, function () {
  test.setup()

  let route, sandbox, category1, category2, course1, course2, course3, term1, term2, work1, work2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();

    term1 = Ember.Object.create({id: 12345, current: true});
    term2 = Ember.Object.create({id: 67890, current: false});
    course1 = Ember.Object.create({id: 123, tid: 12345});
    course2 = Ember.Object.create({id: 456, tid: 12345});
    course3 = Ember.Object.create({id: 789, tid: 67890});
    work1 = Ember.Object.create({id: 78, cid: 123});
    work2 = Ember.Object.create({id: 90, cid: 789});
    category1 = Ember.Object.create({id: 13579, label: 'Assignment'});
    category2 = Ember.Object.create({id: 24680, label: 'Reading'});
    sandbox.stub(route, 'modelFor')
      .withArgs('user').returns({
        categories: [category1, category2],
        courses: [course1, course2, course3],
        courseWork: [work1, work2],
        terms: [term1, term2]
      });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    describe('no current term', function () {
      let model;
      beforeEach(function () {
        term1.set('current', false);
        model = route.model();
      });

      it('should have returned no current term flag', function () {
        expect(model).to.eql({'no-current-term': true});
      });
    });

    describe('have current term', function () {
      let model;
      beforeEach(function () {
        model = route.model();
      });

      it('should have returned parent route model data', function () {
        expect(model).to.eql({
          allCourses: [course1, course2, course3],
          allWork: [work1, work2],
          categories: [category1, category2],
          workByCourse: [{course: course1, courseWork: [work1]}, {course: course2, courseWork: []}]
        });
      });
    });
  });
});
