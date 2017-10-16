import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/timetable')
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
    describe('have current term', function () {
      let model, class1, class2, class3, course1, course2, course3, term1, term2;
      beforeEach(function () {
        term1 = Ember.Object.create({id: 12345, current: true});
        term2 = Ember.Object.create({id: 67890, current: false});
        course1 = Ember.Object.create({id: 123, tid: 12345});
        course2 = Ember.Object.create({id: 456, tid: 12345});
        course3 = Ember.Object.create({id: 789, tid: 67890});
        class1 = Ember.Object.create({id: 12, cid: 123});
        class2 = Ember.Object.create({id: 34, cid: 123});
        class3 = Ember.Object.create({id: 56, cid: 789});
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns({
            classTimes: [class1, class2, class3],
            courses: [course1, course2, course3],
            terms: [term1, term2]
          });
        model = route.model();
      });

      it('should have returned all user courses and class times for current term', function () {
        expect(model).to.eql([{course: course1, classTimes: [class1, class2]}, {course: course2, classTimes: []}]);
      });
    });

    describe('have current term', function () {
      let model, class1, class2, class3, course1, course2, course3, term1, term2;
      beforeEach(function () {
        term1 = Ember.Object.create({id: 12345, current: false});
        term2 = Ember.Object.create({id: 67890, current: false});
        course1 = Ember.Object.create({id: 123, tid: 12345});
        course2 = Ember.Object.create({id: 456, tid: 12345});
        course3 = Ember.Object.create({id: 789, tid: 67890});
        class1 = Ember.Object.create({id: 12, cid: 123});
        class2 = Ember.Object.create({id: 34, cid: 123});
        class3 = Ember.Object.create({id: 56, cid: 789});
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns({
            classTimes: [class1, class2, class3],
            courses: [course1, course2, course3],
            terms: [term1, term2]
          });
        model = route.model();
      });

      it('should have returned no current term flag', function () {
        expect(model).to.eql({'no-current-term': true});
      });
    });
  });
});
