import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('user/timetable')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, class1, class2, class3, course1, course2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    class1 = Ember.Object.create({id: 135, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: 'Tuesday'});
    class2 = Ember.Object.create({id: 456, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: 'Thursday'});
    class3 = Ember.Object.create({id: 789, cid: 67890, 'start-time': '10:05 am', 'end-time': '12:55 pm', location: 'SB 123', day: 'Monday'});
    course1 = Ember.Object.create({id: 12345, 'course-code': 'COMP 4004', index: 0});
    course2 = Ember.Object.create({id: 67890, 'course-code': 'ERTH 2401', index: 1});

    controller.set('model', [
      {
        course: course1,
        classTimes: [class1, class2]
      },
      {
        course: course2,
        classTimes: [class3]
      }
    ]);
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('haveCurrentTerm', function () {
      describe('no-current-term flag set', function () {
        beforeEach(function () {
          controller.set('model', {'no-current-term': true});
        });

        it('should return false', function () {
          expect(controller.get('haveCurrentTerm')).to.eql(false);
        });
      });

      describe('no-current-term flag not set', function () {
        beforeEach(function () {
          controller.set('model', []);
        });

        it('should return true', function () {
          expect(controller.get('haveCurrentTerm')).to.eql(true);
        });
      });
    });

    describe('timeslots', function () {
      describe('model is empty', function () {
        beforeEach(function () {
          controller.set('model', []);
        });

        it('should return empty array', function () {
          expect(controller.get('timeslots')).to.have.length(0);
        });
      });

      describe('model has values', function () {
        it('should have 3 term groups', function () {
          expect(controller.get('timeslots')).to.have.length(3);
        });

        it('should have correct first timeslot', function () {
          expect(controller.get('timeslots')[0]).to.eql({
            item: course1,
            day: 'Tuesday',
            start: '10:05 am',
            end: '11:25 am',
            label: 'COMP 4004',
            location: 'TB 238'
          });
        });

        it('should have correct second timeslot', function () {
          expect(controller.get('timeslots')[1]).to.eql({
            item: course1,
            day: 'Thursday',
            start: '10:05 am',
            end: '11:25 am',
            label: 'COMP 4004',
            location: 'TB 238'
          });
        });

        it('should have correct third timeslot', function () {
          expect(controller.get('timeslots')[2]).to.eql({
            item: course2,
            day: 'Monday',
            start: '10:05 am',
            end: '12:55 pm',
            label: 'ERTH 2401',
            location: 'SB 123'
          });
        });
      });
    });
  });

  describe('Actions', function () {
    describe('timeSlotSelected()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.timeSlotSelected.apply(controller, [course1]);
      });

      it('should have transitioned to correct course route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses.course', 12345);
      });
    });
  });
});
