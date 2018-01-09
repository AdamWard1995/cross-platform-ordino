import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import moment from 'moment';
import sinon from 'sinon';

const test = controller('user/index')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, work1, work2, work3, work4, class1, class2, class3, class4, course1, course2, course3, category1, category2, category3, term1, term2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    term1 = Ember.Object.create({id: 67890, semester: 'Fall', year: 2017, current: true});
    term2 = Ember.Object.create({id: 98765, semester: 'Winter', year: 2018});
    class1 = Ember.Object.create({id: 135, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: moment().add(4, 'days').format('dddd')});
    class2 = Ember.Object.create({id: 791, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: moment().add(2, 'days').format('dddd')});
    class3 = Ember.Object.create({id: 567, cid: 12345, 'start-time': '10:05 am', 'end-time': '11:25 am', location: 'TB 238', day: moment().add(-2, 'days').format('dddd')});
    class4 = Ember.Object.create({id: 567, cid: 12345, 'start-time': moment().add(-1, 'minutes').format('hh:mm a'), 'end-time': moment().add(1, 'minutes').format('hh:mm a'), location: 'TB 238', day: moment().format('dddd')});
    work1 = Ember.Object.create({id: 123, index: 1, cid: 12345, label: 'Assignment 2', weight: 25, grade: 95, due: moment().add(2, 'days')});
    work2 = Ember.Object.create({id: 456, index: 0, cid: 12345, label: 'Assignment 1', weight: 25, grade: 90, due: moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a')});
    work3 = Ember.Object.create({id: 789, index: 2, cid: 111213, label: 'Final Exam', weight: 50, grade: null, due: moment().add(5, 'days')});
    work4 = Ember.Object.create({id: 101, index: 3, cid: 111213, label: 'Final Exam', weight: 50, grade: null, due: moment().add(8, 'days')});
    course1 = Ember.Object.create({id: 12345, tid: 67890, 'course-code': 'COMP 4004', index: 0});
    course2 = Ember.Object.create({id: 111213, tid: 67890, 'course-code': 'COMP 4107', index: 1});
    course3 = Ember.Object.create({id: 141516, tid: 98765, 'course-code': 'COMP 4905', index: 2});
    category1 = Ember.Object.create({id: 987, label: 'Assignment', icon: 'file-text'});
    category2 = Ember.Object.create({id: 654, label: 'Reading', icon: 'book'});
    category3 = Ember.Object.create({id: 321, label: 'Exam', icon: 'flag'});

    controller.set('model', {
      course1,
      categories: [category1, category2, category3],
      classTimes: [class1, class2, class3, class4],
      courseWork: [work1, work2, work3, work4],
      courses: [course1, course2, course3],
      terms: [term1, term2]
    });
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('dueNextWeek', function () {
      describe('no course work data', function () {
        beforeEach(function () {
          controller.get('model').courseWork = undefined;
        });

        it('should have returned nothing' , function () {
          expect(controller.get('dueNextWeek')).to.eql(undefined);
        });
      });

      describe('have course work data', function () {
        it('should have returned correct items due this week' , function () {
          expect(controller.get('dueNextWeek')).to.eql([{course: course1, work: work1}, {course: course2, work: work3}]);
        });
      });
    });

    describe('numTerms', function () {
      describe('no term data', function () {
        beforeEach(function () {
          controller.get('model').terms = undefined;
        });

        it('should have returned 0' , function () {
          expect(controller.get('numTerms')).to.eql(0);
        });
      });

      describe('have term data', function () {
        it('should have returned correct number of terms' , function () {
          expect(controller.get('numTerms')).to.eql(2);
        });
      });
    });

    describe('createFirstTerm', function () {
      describe('no term data', function () {
        beforeEach(function () {
          controller.get('model').terms = undefined;
        });

        it('should have returned true' , function () {
          expect(controller.get('createFirstTerm')).to.eql(true);
        });
      });

      describe('have term data', function () {
        it('should have returned false' , function () {
          expect(controller.get('createFirstTerm')).to.eql(false);
        });
      });
    });

    describe('numCourses', function () {
      describe('no course data', function () {
        beforeEach(function () {
          controller.get('model').courses = undefined;
        });

        it('should have returned 0' , function () {
          expect(controller.get('numCourses')).to.eql(0);
        });
      });

      describe('have course data', function () {
        it('should have returned correct number of courses' , function () {
          expect(controller.get('numCourses')).to.eql(3);
        });
      });
    });

    describe('numCategories', function () {
      describe('no category data', function () {
        beforeEach(function () {
          controller.get('model').categories = undefined;
        });

        it('should have returned 0' , function () {
          expect(controller.get('numCategories')).to.eql(0);
        });
      });

      describe('have course data', function () {
        it('should have returned correct number of categories' , function () {
          expect(controller.get('numCategories')).to.eql(3);
        });
      });
    });

    describe('currentTerm', function () {
      describe('no current term', function () {
        beforeEach(function () {
          term1.set('current', false);
        });

        it('should have returned nothing' , function () {
          expect(controller.get('currentTerm')).to.eql(undefined);
        });
      });

      describe('have currentTerm', function () {
        it('should have returned correct term' , function () {
          expect(controller.get('currentTerm')).to.eql(term1);
        });
      });
    });

    describe('nextClass', function () {
      describe('no class times', function () {
        beforeEach(function () {
          controller.get('model').classTimes = undefined;
        });

        it('should have returned nothing' , function () {
          expect(controller.get('nextClass')).to.eql(undefined);
        });
      });

      describe('no terms', function () {
        beforeEach(function () {
          controller.get('model').terms = undefined;
        });

        it('should have returned nothing' , function () {
          expect(controller.get('nextClass')).to.eql(undefined);
        });
      });

      describe('no current term', function () {
        beforeEach(function () {
          term1.set('current', false);
        });

        it('should have returned nothing' , function () {
          expect(controller.get('nextClass')).to.eql(undefined);
        });
      });

      describe('have current term and class times', function () {
        it('should have returned correct next class' , function () {
          expect(controller.get('nextClass')).to.eql({course: course1, classTime: class2});
        });
      });

      describe('next class has already been passed this week', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [class3];
        });

        it('should have returned correct next class' , function () {
          expect(controller.get('nextClass')).to.eql({course: course1, classTime: class3});
        });
      });

      describe('next class has already been passed today', function () {
        beforeEach(function () {
          controller.get('model').classTimes = [class4];
        });

        it('should have returned correct next class' , function () {
          expect(controller.get('nextClass')).to.eql({course: course1, classTime: class4});
        });
      });
    });
  });

  describe('Actions', function () {
    describe('goToWorkFlow()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToWorkFlow.apply(controller);
      });

      it('should have transitioned to WorkFlow route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.workflow');
      });
    });

    describe('goToTerms()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToTerms.apply(controller);
      });

      it('should have transitioned to terms route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms');
      });
    });

    describe('goToCourses()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCourses.apply(controller);
      });

      it('should have transitioned to courses route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.courses');
      });
    });

    describe('goToCategories()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCategories.apply(controller);
      });

      it('should have transitioned to categories route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.categories');
      });
    });

    describe('goToCurrentTerm()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToCurrentTerm.apply(controller, [term1]);
      });

      it('should have transitioned to current term route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms.term', 67890);
      });
    });

    describe('goToTimeTable()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToTimeTable.apply(controller);
      });

      it('should have transitioned to TimeTable route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.timetable');
      });
    });

    describe('goToUserAccount()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute');
        controller.actions.goToUserAccount.apply(controller);
      });

      it('should have transitioned to user account route', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.account');
      });
    });
  });
});
