import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import moment from 'moment';
import sinon from 'sinon';

import * as cleanup from 'cross-platform-ordino/utils/cleanup';

const test = controller('user/courses/course/index')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, work1, work2, work3, class1, class2, course;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    class1 = Ember.Object.create({save: sinon.stub(), destroyRecord: sinon.stub(), id: 135, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: 'Tuesday'});
    class2 = Ember.Object.create({save: sinon.stub(), destroyRecord: sinon.stub(), id: 791, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: 'Thursday'});
    work1 = Ember.Object.create({save: sinon.stub(), id: 123, index: 1, cid: 12345, label: 'Assignment 2', weight: 25, grade: 95, due: moment('October 17th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a')});
    work2 = Ember.Object.create({save: sinon.stub(), id: 456, index: 0, cid: 12345, label: 'Assignment 1', weight: 25, grade: 90, due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a')});
    work3 = Ember.Object.create({save: sinon.stub(), id: 789, index: 2, cid: 12345, label: 'Final Exam', weight: 50, grade: null, due: moment('December 16th 2017, 9:00 am', 'MMMM Do yyyy, h:mm a')});
    course = Ember.Object.create({save: sinon.stub(), id: 12345, tid: 67890, 'course-code': 'COMP 4004'});

    class1.get('save').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));
    class2.get('save').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));

    class1.get('destroyRecord').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));
    class2.get('destroyRecord').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));

    work1.get('save').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));
    work2.get('save').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));
    work3.get('save').returns(new Ember.RSVP.Promise(function (resolve) {resolve()}));

    controller.set('model', {course, classTimes: [class1, class2], courseWork: [work1, work2, work3]});
    controller.set('session', Ember.Object.create({currentUser: {uid: 680}}));
    controller.set('courses', [course, {foo: 'bar'}, {foo: 'baz'}]);
    controller.store = {createRecord: sinon.stub()};
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('deleteConfirmationMessage', function () {
      it('should have the correct confirmation message' , function () {
        expect(controller.get('deleteConfirmationMessage')).to.eql('Are you sure you want to delete COMP 4004?');
      });
    });

    describe('deleteCourseWorkConfirmationMessage', function () {
      describe('is item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', work1);
        });

        it('should have the correct confirmation message' , function () {
          expect(controller.get('deleteCourseWorkConfirmationMessage')).to.eql('Are you sure you want to delete Assignment 2?');
        });
      });

      describe('no item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', undefined);
        });

        it('should have the correct confirmation message' , function () {
          expect(controller.get('deleteCourseWorkConfirmationMessage')).to.eql(undefined);
        });
      });
    });

    describe('classDays', function () {
      it('should have the correct day strings' , function () {
        expect(controller.get('classDays')).to.eql(['Tuesday', 'Thursday']);
      });
    });

    describe('createClassTimes', function () {
      describe('no class times', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [];
        });

        it('should be false' , function () {
          expect(controller.get('createClassTimes')).to.eql(false);
        });
      });

      describe('have class times', function () {
        it('should be true' , function () {
          expect(controller.get('createClassTimes')).to.eql(true);
        });
      });
    });

    describe('location', function () {
      describe('no class times', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [];
        });

        it('should be undefined' , function () {
          expect(controller.get('location')).to.eql(undefined);
        });
      });

      describe('have class times', function () {
        it('should have location' , function () {
          expect(controller.get('location')).to.eql('TB 238');
        });
      });
    });

    describe('startTime', function () {
      describe('no class times', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [];
        });

        it('should be undefined' , function () {
          expect(controller.get('startTime')).to.eql(undefined);
        });
      });

      describe('have class times', function () {
        it('should have correct start time' , function () {
          expect(controller.get('startTime').format('h:mm a')).to.eql('10:05 am');
        });
      });
    });

    describe('endTime', function () {
      describe('no class times', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [];
        });

        it('should be undefined' , function () {
          expect(controller.get('endTime')).to.eql(undefined);
        });
      });

      describe('have class times', function () {
        it('should have correct end time' , function () {
          expect(controller.get('endTime').format('h:mm a')).to.eql('11:25 am');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('showEditModal()', function () {
      beforeEach(function () {
        controller.actions.showEditModal.apply(controller);
      });

      it('should ensure edit course modal is shown', function () {
        expect(controller.get('editCourse')).to.eql(true);
      });
    });

    describe('hideEditModal()', function () {
      beforeEach(function () {
        controller.actions.hideEditModal.apply(controller);
      });

      it('should ensure edit course modal is hidden', function () {
        expect(controller.get('editCourse')).to.eql(false);
      });
    });

    describe('showDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.showDeleteModal.apply(controller);
      });

      it('should ensure confirm delete course modal is shown', function () {
        expect(controller.get('deleteCourse')).to.eql(true);
      });
    });

    describe('hideDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteModal.apply(controller);
      });

      it('should ensure confirm delete course modal is hidden', function () {
        expect(controller.get('deleteCourse')).to.eql(false);
      });
    });

    describe('showCreateCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.showCreateCourseWorkModal.apply(controller);
      });

      it('should ensure create course work modal is shown', function () {
        expect(controller.get('createCourseWork')).to.eql(true);
      });
    });

    describe('hideCreateCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.hideCreateCourseWorkModal.apply(controller);
      });

      it('should ensure create course work modal is hidden', function () {
        expect(controller.get('createCourseWork')).to.eql(false);
      });
    });

    describe('showEditCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.showEditCourseWorkModal.apply(controller, [work1]);
      });

      it('should ensure edit course work modal is shown', function () {
        expect(controller.get('editCourseWork')).to.eql(true);
      });

      it('should have set item to edit', function () {
        expect(controller.get('itemToEdit')).to.eql(work1);
      });
    });

    describe('hideEditCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.hideEditCourseWorkModal.apply(controller);
      });

      it('should ensure edit course work modal is hidden', function () {
        expect(controller.get('editCourseWork')).to.eql(false);
      });

      it('should have wiped out item to edit', function () {
        expect(controller.get('itemToEdit')).to.eql(null);
      });
    });

    describe('showDeleteCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.showDeleteCourseWorkModal.apply(controller, [work1]);
      });

      it('should ensure delete course work confirmation modal is shown', function () {
        expect(controller.get('deleteCourseWork')).to.eql(true);
      });

      it('should have set item to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(work1);
      });
    });

    describe('hideDeleteCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteCourseWorkModal.apply(controller);
      });

      it('should ensure delete course work confirmation modal is hidden', function () {
        expect(controller.get('deleteCourseWork')).to.eql(false);
      });

      it('should have wiped out item to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(null);
      });
    });

    describe('editCourse()', function () {
      describe('edit existing class times', function () {
        beforeEach(function () {
          sandbox.stub(controller, 'send');
          controller.actions.editCourse.apply(controller, ['COMP 4905', 'N/A', '3:00 pm', '4:00 pm', ['Thursday', 'Tuesday']]);
        });

        it('should have updated the course code', function () {
          expect(course.get('course-code')).to.eql('COMP 4905');
        });

        it('should have saved changes to the course', function () {
          expect(course.get('save')).to.have.callCount(1);
        });

        it('should not have destroyed class1', function () {
          expect(class1.get('destroyRecord')).to.have.callCount(0);
        });

        it('should not have destroyed class2', function () {
          expect(class2.get('destroyRecord')).to.have.callCount(0);
        });

        it('should have updated class1 location', function () {
          expect(class1.get('location')).to.eql('N/A');
        });

        it('should have updated class2 location', function () {
          expect(class2.get('location')).to.eql('N/A');
        });

        it('should have saved changes to class1', function () {
          expect(class1.get('save')).to.have.callCount(1);
        });

        it('should have saved changes to class2', function () {
          expect(class2.get('save')).to.have.callCount(1);
        });

        it('should not have created any new records', function () {
          expect(controller.store.createRecord).to.have.callCount(0);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should ensure edit course modal is hidden', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });

      describe('remove, add, and keep class times', function () {
        let saveNewRecordStub;
        beforeEach(function () {
          saveNewRecordStub = sinon.stub();
          saveNewRecordStub.returns(new Ember.RSVP.Promise(function (resolve){resolve();}));
          sandbox.stub(controller, 'send');
          controller.store.createRecord.returns({save: saveNewRecordStub});
          controller.actions.editCourse.apply(controller, ['COMP 4905', 'N/A', '3:00 pm', '4:00 pm', ['Thursday', 'Friday']]);
        });

        it('should have updated the course code', function () {
          expect(course.get('course-code')).to.eql('COMP 4905');
        });

        it('should have saved changes to the course', function () {
          expect(course.get('save')).to.have.callCount(1);
        });

        it('should not have destroyed class2', function () {
          expect(class2.get('destroyRecord')).to.have.callCount(0);
        });

        it('should have destroyed class1', function () {
          expect(class1.get('destroyRecord')).to.have.callCount(1);
        });

        it('should have updated class2 location', function () {
          expect(class2.get('location')).to.eql('N/A');
        });

        it('should have saved changes to class2', function () {
          expect(class2.get('save')).to.have.callCount(1);
        });

        it('should have created new class time', function () {
          expect(controller.store.createRecord).to.have.been.calledWithExactly('class-time',
            {uid: 680, cid: 12345, location: 'N/A', 'start-time': '3:00 pm', 'end-time': '4:00 pm', day: 'Friday'}
          );
        });

        it('should have saved new class time', function () {
          expect(saveNewRecordStub).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should ensure edit course modal is hidden', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });

      describe('delete existing class times', function () {
        beforeEach(function () {
          sandbox.stub(controller, 'send');
          controller.actions.editCourse.apply(controller, ['COMP 4905', 'N/A', null, null, []]);
        });

        it('should have updated the course code', function () {
          expect(course.get('course-code')).to.eql('COMP 4905');
        });

        it('should have saved changes to the course', function () {
          expect(course.get('save')).to.have.callCount(1);
        });

        it('should have destroyed class1', function () {
          expect(class1.get('destroyRecord')).to.have.callCount(1);
        });

        it('should have destroyed class2', function () {
          expect(class2.get('destroyRecord')).to.have.callCount(1);
        });

        it('should not have created any new records', function () {
          expect(controller.store.createRecord).to.have.callCount(0);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should ensure edit course modal is hidden', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });

      describe('create new class time', function () {
        let saveNewRecordStub;
        beforeEach(function () {
          saveNewRecordStub = sinon.stub();
          saveNewRecordStub.returns(new Ember.RSVP.Promise(function (resolve){resolve();}));
          sandbox.stub(controller, 'send');
          controller.store.createRecord.returns({save: saveNewRecordStub});
          controller.actions.editCourse.apply(controller, ['COMP 4905', 'N/A', '3:00 pm', '4:00 pm', ['Friday']]);
        });

        it('should have updated the course code', function () {
          expect(course.get('course-code')).to.eql('COMP 4905');
        });

        it('should have saved changes to the course', function () {
          expect(course.get('save')).to.have.callCount(1);
        });

        it('should have destroyed class1', function () {
          expect(class1.get('destroyRecord')).to.have.callCount(1);
        });

        it('should have destroyed class2', function () {
          expect(class2.get('destroyRecord')).to.have.callCount(1);
        });

        it('should have created new class time', function () {
          expect(controller.store.createRecord).to.have.been.calledWithExactly('class-time',
            {uid: 680, cid: 12345, location: 'N/A', 'start-time': '3:00 pm', 'end-time': '4:00 pm', day: 'Friday'}
          );
        });

        it('should have saved new class time', function () {
          expect(saveNewRecordStub).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should ensure edit course modal is hidden', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });
    });

    describe('deleteCourse()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        sandbox.stub(controller, 'send');
        sandbox.stub(cleanup, 'deleteCourse');
        controller.actions.deleteCourse.apply(controller);
      });

      it('should have called deleteCourse utility function', function () {
        expect(cleanup.deleteCourse).to.have.been.calledWithExactly(course, controller.get('courses'), controller.store);
      });

      it('should have hidden delete course confirmation modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteModal');
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should have transitioned to the parent term page', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms.term', 67890);
      });
    });

    describe('createCourseWork()', function () {
      let saveNewRecordStub;
      beforeEach(function () {
        saveNewRecordStub = sinon.stub();
        saveNewRecordStub.returns(new Ember.RSVP.Promise(function (resolve){resolve();}));
        sandbox.stub(controller, 'send');
        controller.store.createRecord.returns({save: saveNewRecordStub});
        controller.actions.createCourseWork.apply(controller, ['Midterm', 40, 90, moment('September 30th 2017, 10:30 pmZ', 'MMMM Do yyyy, h:mm aZ').toISOString()]);
      });

      it('should have created new course work', function () {
        expect(controller.store.createRecord).to.have.been.calledWithExactly('course-work',
          {uid: 680, cid: 12345, index: 3, label: 'Midterm', weight: 40, grade: 90, due: '2017-09-30T22:30:00.000Z'}
        );
      });

      it('should have saved new course work', function () {
        expect(saveNewRecordStub).to.have.callCount(1);
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should ensure create course work modal is hidden', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideCreateCourseWorkModal');
      });
    });

    describe('editCourseWork()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'send');
        controller.set('itemToEdit', work1);
        controller.actions.editCourseWork.apply(controller, ['Assignment 4', 33, 87, moment('September 30th 2017, 10:30 pmZ', 'MMMM Do yyyy, h:mm aZ').toISOString()]);
      });

      it('should have set the item label', function () {
        expect(work1.get('label')).to.eql('Assignment 4');
      });

      it('should have set the item weight', function () {
        expect(work1.get('weight')).to.eql(33);
      });

      it('should have set the item grade', function () {
        expect(work1.get('grade')).to.eql(87);
      });

      it('should have set the item due', function () {
        expect(work1.get('due')).to.eql('2017-09-30T22:30:00.000Z');
      });

      it('should have hidden edit course work modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideEditCourseWorkModal');
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });
    });

    describe('deleteCourseWork()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'send');
        sandbox.stub(cleanup, 'deleteCourseWork');
        controller.set('itemToDelete', work1);
        controller.actions.deleteCourseWork.apply(controller);
      });

      it('should have called deleteCourseWork utility function', function () {
        expect(cleanup.deleteCourseWork).to.have.been.calledWithExactly(work1, [work1, work2, work3], controller.store);
      });

      it('should have hidden delete course work confirmation modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteCourseWorkModal');
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });
    });

    describe('goToTermRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToTermRoute.apply(controller);
      });

      it('should have transitioned to course route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms.term', 67890);
      });
    });

    describe('goToCourseReport()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCourseReport.apply(controller);
      });

      it('should have transitioned to course route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses.course.report', 12345);
      });
    });
  });
});
