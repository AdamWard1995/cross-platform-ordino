import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

import * as cleanup from 'cross-platform-ordino/utils/cleanup';

const test = controller('user/terms/term')
describe(test.label, function () {
  test.setup();

  let controller, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('deleteConfirmationMessage', function () {
      beforeEach(function () {
        controller.set('model', {term: Ember.Object.create({semester: 'Fall', year: 2017})});
      });

      it('should return correct confirmation message', function () {
        expect(controller.get('deleteConfirmationMessage')).to.eql(
          'Are you sure you want to delete Fall 2017?'
        );
      });
    });

    describe('deleteCourseConfirmationMessage', function () {
      describe('is item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', Ember.Object.create({'course-code': 'COMP 4905'}));
        });

        it('should return correct confirmation message', function () {
          expect(controller.get('deleteCourseConfirmationMessage')).to.eql(
            'Are you sure you want to delete COMP 4905?'
          );
        });
      });

      describe('no item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', undefined);
        });

        it('should return correct confirmation message', function () {
          expect(controller.get('deleteCourseConfirmationMessage')).to.eql(undefined);
        });
      });
    });
  });

  describe('Actions', function () {
    describe('showEditModal()', function () {
      beforeEach(function () {
        controller.actions.showEditModal.apply(controller);
      });

      it('should make sure edit term modal is shown', function () {
        expect(controller.get('editTerm')).to.eql(true);
      });
    });

    describe('hideEditModal()', function () {
      beforeEach(function () {
        controller.actions.hideEditModal.apply(controller);
      });

      it('should make sure edit term modal is hidden', function () {
        expect(controller.get('editTerm')).to.eql(false);
      });
    });

    describe('showDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.showDeleteModal.apply(controller);
      });

      it('should make sure delete term confirmation modal is shown', function () {
        expect(controller.get('deleteTerm')).to.eql(true);
      });
    });

    describe('hideDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteModal.apply(controller);
      });

      it('should make sure delete term confirmation modal is hidden', function () {
        expect(controller.get('deleteTerm')).to.eql(false);
      });
    });

    describe('showCreateCourseModal()', function () {
      beforeEach(function () {
        controller.actions.showCreateCourseModal.apply(controller);
      });

      it('should make sure create course modal is shown', function () {
        expect(controller.get('createCourse')).to.eql(true);
      });
    });

    describe('hideCreateCourseModal()', function () {
      beforeEach(function () {
        controller.actions.hideCreateCourseModal.apply(controller);
      });

      it('should make sure create course modal is hidden', function () {
        expect(controller.get('createCourse')).to.eql(false);
      });
    });

    describe('showDeleteCourseModal()', function () {
      let item;
      beforeEach(function () {
        item = {foo: 'bar'};
        controller.actions.showDeleteCourseModal.apply(controller, [item]);
      });

      it('should make sure delete course confirmation modal is shown', function () {
        expect(controller.get('deleteCourse')).to.eql(true);
      });

      it('should have stored the term to delete on confirmation', function () {
        expect(controller.get('itemToDelete')).to.eql(item);
      });
    });

    describe('hideDeleteCourseModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteCourseModal.apply(controller);
      });

      it('should make sure delete course confirmation modal is hidden', function () {
        expect(controller.get('deleteCourse')).to.eql(false);
      });

      it('should have wiped the course to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(null);
      });
    });

    describe('editTerm()', function () {
      let term, otherTerm1, otherTerm2;
      beforeEach(function () {
        term = Ember.Object.create({current: false, semester: 'Fall', year: 2017, save: sinon.stub()});
        otherTerm1 = Ember.Object.create({current: false, save: sinon.stub()});
        otherTerm2 = Ember.Object.create({current: true, save: sinon.stub()});
        controller.set('model', {term, terms: [otherTerm1, otherTerm2]});
        sandbox.stub(controller, 'send');
      });

      describe('edited term is not current', function () {
        beforeEach(function () {
          controller.actions.editTerm.apply(controller, ['Winter', 2018, false]);
        });

        it('should not have changed current status of any term', function () {
          expect(term.get('current'), 'Edited term should not be current').to.eql(false);
          expect(otherTerm1.get('current'), 'First other term should not be current').to.eql(false);
          expect(otherTerm2.get('current'), 'Second other term should be current').to.eql(true);
        });

        it('should have changed edited term\'s semester', function () {
          expect(term.get('semester')).to.eql('Winter');
        });

        it('should have changed edited term\'s year', function () {
          expect(term.get('year')).to.eql(2018);
        });

        it('should have saved changes to edited term', function () {
          expect(term.get('save')).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should have closed the edit term modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });

      describe('edited term is current', function () {
        beforeEach(function () {
          controller.actions.editTerm.apply(controller, ['Winter', 2018, true]);
        });

        it('should not have changed current status of any non-current terms', function () {
          expect(otherTerm1.get('current'), 'First other term should not be current').to.eql(false);
        });

        it('should have changed current status of any editted term and previous current term', function () {
          expect(term.get('current'), 'Edited term should not be current').to.eql(true);
          expect(otherTerm2.get('current'), 'Second other term should not be current').to.eql(false);
        });

        it('should have changed edited term\'s semester', function () {
          expect(term.get('semester')).to.eql('Winter');
        });

        it('should have changed edited term\'s year', function () {
          expect(term.get('year')).to.eql(2018);
        });

        it('should have saved changes to edited term', function () {
          expect(term.get('save')).to.have.callCount(1);
        });

        it('should have saved changes to previous current term', function () {
          expect(otherTerm2.get('save')).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should have closed the edit term modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
        });
      });
    });

    describe('deleteTerm()', function () {
      let term, otherTerm1, otherTerm2, store;
      beforeEach(function () {
        term = Ember.Object.create({current: false, semester: 'Fall', year: 2017, save: sinon.stub()});
        otherTerm1 = Ember.Object.create({current: false, save: sinon.stub()});
        otherTerm2 = Ember.Object.create({current: true, save: sinon.stub()});
        store = {foo: 'bar'};
        controller.set('model', {term, terms: [otherTerm1, otherTerm2]});
        sandbox.stub(controller, 'transitionToRoute');
        sandbox.stub(controller, 'send');
        sandbox.stub(cleanup, 'deleteTerm');
        controller.store = store;
        controller.actions.deleteTerm.apply(controller);
      });

      it('should have called cleanupTerm utility', function () {
        expect(cleanup.deleteTerm).to.have.been.calledWithExactly(term, [otherTerm1, otherTerm2], store);
      });

      it('should have hidden the delte term modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteModal');
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should have transitioned to the terms list page', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('createCourse()', function () {
      let classTime, course, course2, course3, store;
      beforeEach(function () {
        course = Ember.Object.create({id: 123, tid: 67890});
        course.save = sinon.stub();
        course.save.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve();
        }));
        course2 = Ember.Object.create({id: 456, tid: 54321});
        course3 = Ember.Object.create({id: 789, tid: 54321});
        classTime = {save: sinon.stub()};
        store = {createRecord: sinon.stub()};
        store.createRecord.withArgs('course', sinon.match.any).returns(course);
        store.createRecord.withArgs('class-time', sinon.match.any).returns(classTime);
        controller.set('session', Ember.Object.create({currentUser: {uid: 12345}}));
        controller.set('model', {term: Ember.Object.create({id: 67890}), courses: [course], allCourses: [course, course2, course3]});
        controller.store = store;
        sandbox.stub(cleanup, 'normalizeIndices');
        sandbox.stub(controller, 'send');
        sandbox.stub(Ember.run, 'later');
      });

      describe('create for default term', function () {
        beforeEach(function () {
          controller.actions.createCourse.apply(controller, ['COMP 4004', 'TB 238', '10:05 am', '11:25 am', ['Tuesday', 'Thursday'], 67890]);
        });

        it('should have create new course record', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('course', {
            uid: 12345,
            tid: 67890,
            index: 1,
            'course-code': 'COMP 4004'
          });
        });

        it('should have saved the new course record', function () {
          expect(course.save).to.have.callCount(1);
        });

        it('should have created Tuesday class time', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('class-time', {
            uid: 12345,
            cid: 123,
            location: 'TB 238',
            'start-time': '10:05 am',
            'end-time': '11:25 am',
            day: 'Tuesday'
          });
        });

        it('should have created Thursday class time', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('class-time', {
            uid: 12345,
            cid: 123,
            location: 'TB 238',
            'start-time': '10:05 am',
            'end-time': '11:25 am',
            day: 'Thursday'
          });
        });

        it('should have saved created class times', function () {
          expect(classTime.save).to.have.callCount(2);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should closed the create course modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideCreateCourseModal');
        });
      });

      describe('create for non-default term', function () {
        beforeEach(function () {
          controller.actions.createCourse.apply(controller, ['COMP 4004', 'TB 238', '10:05 am', '11:25 am', ['Tuesday', 'Thursday'], 54321]);
        });

        it('should have create new course record', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('course', {
            uid: 12345,
            tid: 54321,
            index: 2,
            'course-code': 'COMP 4004'
          });
        });

        it('should have saved the new course record', function () {
          expect(course.save).to.have.callCount(1);
        });

        it('should have created Tuesday class time', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('class-time', {
            uid: 12345,
            cid: 123,
            location: 'TB 238',
            'start-time': '10:05 am',
            'end-time': '11:25 am',
            day: 'Tuesday'
          });
        });

        it('should have created Thursday class time', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('class-time', {
            uid: 12345,
            cid: 123,
            location: 'TB 238',
            'start-time': '10:05 am',
            'end-time': '11:25 am',
            day: 'Thursday'
          });
        });

        it('should have saved created class times', function () {
          expect(classTime.save).to.have.callCount(2);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should closed the create course modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideCreateCourseModal');
        });
      });
    });

    describe('deleteCourse()', function () {
      let toDelete, otherCourse1, otherCourse2, store;
      beforeEach(function () {
        toDelete = Ember.Object.create({id: 789});
        otherCourse1 = Ember.Object.create({id: 123});
        otherCourse2 = Ember.Object.create({id: 456});
        store = {foo: 'bar'};
        controller.store = store;
        controller.set('model', {courses: [otherCourse1, otherCourse2]});
        controller.set('itemToDelete', toDelete);
        sandbox.stub(cleanup, 'deleteCourse');
        sandbox.stub(controller, 'send');
        controller.actions.deleteCourse.apply(controller);
      });

      it('should have called deleteCourse utility function', function () {
        expect(cleanup.deleteCourse).to.have.been.calledWithExactly(toDelete, [otherCourse1, otherCourse2], store);
      });

      it('should have hidden confirm delete course modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteCourseModal');
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });
    });

    describe('goToTermsRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToTermsRoute.apply(controller);
      });

      it('should have transitioned to the terms list page', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('goToCourseRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute')
        controller.actions.goToCourseRoute.apply(controller, [{course: Ember.Object.create({id: 12345}), average: 95}]);
      });

      it('should have transitioned to the selected course page', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses.course', 12345);
      });
    });
  });
});
