import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/courses/course/report')
describe(test.label, function () {
  test.setup()

  let route, sandbox, work1, work2, work3, course;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();

    course = Ember.Object.create({id: 12345, 'course-code': 'COMP 4004'});
    work1 = Ember.Object.create({id: 123, cid: 12345, label: 'Assignment 1', weight: 25, grade: 90});
    work2 = Ember.Object.create({id: 456, cid: 12345, label: 'Assignment 2', weight: 25, grade: 80});
    work3 = Ember.Object.create({id: 789, cid: 12345, label: 'Final Exam', weight: 50});

    sandbox.stub(route, 'modelFor')
      .withArgs('user.courses.course')
      .returns({course, courseWork: [work1, work2, work3]});
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    let model;
    beforeEach(function () {
      model = route.model();
    });

    it('should have added the course to the model', function () {
      expect(model.course).to.eql(course);
    });

    it('should have the correct accumulatedMarks', function () {
      expect(model.accumulatedMarks).to.eql(42.5);
    });

    it('should have the correct completedWeight', function () {
      expect(model.completedWeight).to.eql(50);
    });

    it('should have the correct lowestGrade', function () {
      expect(model.lowestGrade).to.eql(80);
    });

    it('should have the correct highestGrade', function () {
      expect(model.highestGrade).to.eql(90);
    });

    it('should have the correct medianGrade', function () {
      expect(model.medianGrade).to.eql(90);
    });

    it('should have the correct currentAvg', function () {
      expect(model.currentAvg).to.eql(85);
    });
  });
});
