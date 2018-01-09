import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('user/courses/index')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, term1, term2, course1, course2, course3, course4, courseWork1, courseWork2, courseWork3, courseWork4;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    term1 = Ember.Object.create({id: 12345, index: 1, semester: 'Fall', year: 2017});
    term2 = Ember.Object.create({id: 67890, index: 0, semester: 'Winter', year: 2018});
    course1 = Ember.Object.create({id: 123, tid: 12345, 'course-code': 'COMP 4905'});
    course2 = Ember.Object.create({id: 456, tid: 67890, 'course-code': 'SYSC 4903'});
    course3 = Ember.Object.create({id: 789, tid: 67890, 'course-code': 'COMP 3008'});
    course4 = Ember.Object.create({id: 101, tid: 67890, 'course-code': 'COMP 3002'});
    courseWork1 = Ember.Object.create({id: 13, cid: 456, weight: 20, grade: 90});
    courseWork2 = Ember.Object.create({id: 57, cid: 456, weight: 30, grade: 80});
    courseWork3 = Ember.Object.create({id: 24, cid: 789, weight: 25});
    courseWork4 = Ember.Object.create({id: 24, cid: 101, weight: 15, grade: 75});

    controller.set('model', {
      terms: [term1, term2],
      courses: [course1, course2, course3, course4],
      courseWork: [courseWork1, courseWork2, courseWork3, courseWork4]
    });
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('listItems', function () {
      describe('terms not set', function () {
        beforeEach(function () {
          controller.get('model')['terms'] = undefined;
        });

        it('should return empty array', function () {
          expect(controller.get('listItems')).to.have.length(0);
        });
      });

      describe('terms not an array', function () {
        beforeEach(function () {
          controller.get('model')['terms'] = {};
        });

        it('should return empty array', function () {
          expect(controller.get('listItems')).to.have.length(0);
        });
      });

      describe('no terms', function () {
        beforeEach(function () {
          controller.get('model')['terms'] = [];
        });

        it('should return empty array', function () {
          expect(controller.get('listItems')).to.have.length(0);
        });
      });

      describe('have terms', function () {
        it('should have two term groups', function () {
          expect(controller.get('listItems')).to.have.length(2);
        });

        it('should have term2 first', function () {
          expect(controller.get('listItems')[0].group).to.eql(term2);
        });

        it('should have term1 second', function () {
          expect(controller.get('listItems')[1].group).to.eql(term1);
        });

        it('should have course1 and correct corresponding average in term1 group', function () {
          expect(controller.get('listItems')[1].items[0]).to.eql({course: course1, average: 0});
        });

        it('should have course2 and correct corresponding average  in term2 group', function () {
          expect(controller.get('listItems')[0].items[0]).to.eql({course: course2, average: 84});
        });

        it('should have course3 and correct corresponding average  in term2 group', function () {
          expect(controller.get('listItems')[0].items[1]).to.eql({course: course3, average: 0});
        });

        it('should have course4 and correct corresponding average  in term2 group', function () {
          expect(controller.get('listItems')[0].items[2]).to.eql({course: course4, average: 75});
        });
      });
    });
  });

  describe('courseCodeValidator', function () {
    it('should pass when filter value is upper case', function () {
      expect(controller.courseCodeValidator(term1, course1, 'COMP')).to.eql(true);
    });

    it('should pass when filter value is lower case', function () {
      expect(controller.courseCodeValidator(term1, course1, 'comp')).to.eql(true);
    });

    it('should pass when no course code entered', function () {
      expect(controller.courseCodeValidator(term1, course1, undefined)).to.eql(true);
    });

    it('should fail when course code doesn\'t start with filter value', function () {
      expect(controller.courseCodeValidator(term1, course1, 'erth')).to.eql(false);
    });

    it('should fail when filter value is in course code but not at start', function () {
      expect(controller.courseCodeValidator(term1, course1, 'rth')).to.eql(false);
    });
  });

  describe('semesterValidator', function () {
    it('should pass when semester matches', function () {
      expect(controller.semesterValidator(term1, course1, 'Fall')).to.eql(true);
    });

    it('should pass when not semester selected', function () {
      expect(controller.semesterValidator(term1, course1, undefined)).to.eql(true);
    });

    it('should fail', function () {
      expect(controller.semesterValidator(term2, course2, 'Fall')).to.eql(false);
    });
  });

  describe('yearValidator', function () {
    it('should pass when year starts with filter value', function () {
      expect(controller.yearValidator(term1, course1, 20)).to.eql(true);
    });

    it('should pass when no year entered', function () {
      expect(controller.yearValidator(term1, course1, undefined)).to.eql(true);
    });

    it('should fail when course code doesn\'t start with filter value', function () {
      expect(controller.yearValidator(term1, course1, 30)).to.eql(false);
    });

    it('should fail when filter value is in course code but not at start', function () {
      expect(controller.yearValidator(term1, course1, 17)).to.eql(false);
    });
  });

  describe('Actions', function () {
    describe('goToCourseRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCourseRoute.apply(controller, [{course: course1, average: null}]);
      });

      it('should have transitioned to course route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses.course', 123);
      });
    });
  });
});
