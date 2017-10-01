import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('user/courses/course/report')
describe(test.label, function () {
  test.setup();

  let sandbox, controller, course;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    course = Ember.Object.create({id: 12345, 'course-code': 'COMP 4004'});

    controller.set('model', {course, accumulatedMarks: 42.5, completedWeight: 50, lowestGrade: 80, highestGrade: 90, medianGrade: 90, currentAvg: 85});
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('chartData', function () {
      it('should have the correct chart labels' , function () {
        expect(controller.get('chartData').labels).to.eql(['Earned', 'Lost', 'Remaining']);
      });

      it('should have the correct data values' , function () {
        expect(controller.get('chartData').datasets[0].data).to.eql(['42.5', '7.5', '50.0']);
      });

      it('should have unique colors' , function () {
        expect(controller.get('chartData').datasets[0].backgroundColor.length).to
          .eql(controller.get('chartData').datasets[0].backgroundColor.uniq().length);
      });

      it('should have unique hover colors' , function () {
        expect(controller.get('chartData').datasets[0].hoverBackgroundColor.length).to
          .eql(controller.get('chartData').datasets[0].hoverBackgroundColor.uniq().length);
      });
    });

    describe('required-grade', function () {
      describe('already earned desired grade', function () {
        beforeEach(function () {
          controller.set('desired-grade', 42.5);
        });

        it('should have the correct required grade' , function () {
          expect(controller.get('required-grade')).to.eql(0);
        });
      });

      describe('already over earned desired grade', function () {
        beforeEach(function () {
          controller.set('desired-grade', 40);
        });

        it('should have the correct required grade' , function () {
          expect(controller.get('required-grade')).to.eql(0);
        });
      });

      describe('need to improve upon current grade', function () {
        beforeEach(function () {
          controller.set('desired-grade', 90);
        });

        it('should have the correct required grade' , function () {
          expect(controller.get('required-grade')).to.eql(95);
        });
      });

      describe('no desired grade entered', function () {
        beforeEach(function () {
          controller.set('desired-grade', undefined);
        });

        it('should have the correct required grade' , function () {
          expect(controller.get('required-grade')).to.eql('---');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('goToCourseRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCourseRoute.apply(controller);
      });

      it('should have transitioned to course route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses.course', 12345);
      });
    });
  });
});
