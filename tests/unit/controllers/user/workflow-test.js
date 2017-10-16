import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';
import moment from 'moment';

import * as cleanup from 'cross-platform-ordino/utils/cleanup';

const test = controller('user/workflow')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, work1, work2, work3, work4, work5, course1, course2, category1, category2;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    category1 = Ember.Object.create({id: 123, label: 'Assignment'});
    category2 = Ember.Object.create({id: 456, label: 'Reading'});
    work1 = Ember.Object.create({id: 12, save: sinon.stub(), cid: 12345, due: moment('February 27th 1995, 8:00 am', 'MMMM Do YYYY, h:mm a'), index: 0, cgyid: 123});
    work2 = Ember.Object.create({id: 34, save: sinon.stub(), cid: 12345, due: moment().add(1, 'minutes'), index: 1});
    work3 = Ember.Object.create({id: 56, save: sinon.stub(), cid: 67890, due: moment('September 28th 9999, 8:00 pm', 'MMMM Do YYYY, h:mm a'), index: 1});
    work4 = Ember.Object.create({id: 78, save: sinon.stub(), cid: 12345, due: moment('September 28th 9999, 4:00 pm', 'MMMM Do YYYY, h:mm a'), index: 2, cgyid: 123});
    work5 = Ember.Object.create({id: 90, save: sinon.stub(), cid: 67890, due: moment('September 30th 9999, 11:55 pm', 'MMMM Do YYYY, h:mm a'), index: 0, cgyid: 456});
    course1 = Ember.Object.create({id: 12345});
    course2 = Ember.Object.create({id: 67890});

    [work1, work2, work3, work4, work5].forEach((work) => {
      work.get('save').returns(new Ember.RSVP.Promise(function (resolve) {
        resolve();
      }));
    });

    controller.set('model', {
      workByCourse: [
        {course: course1, courseWork: [work1, work2, work4]},
        {course: course2, courseWork: [work3, work5]}
      ],
      allWork: [work1, work2, work3, work4, work5],
      allCourses: [course1, course2],
      categories: [category1, category2]
    });
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('listItems', function () {
      describe('model is empty', function () {
        beforeEach(function () {
          controller.set('model', []);
        });

        it('should return empty array', function () {
          expect(controller.get('listItems')).to.have.length(0);
        });
      });

      describe('model has values', function () {
        it('should have 3 term groups', function () {
          expect(controller.get('listItems')).to.have.length(3);
        });

        it('should only have 3 groups', function () {
          expect(controller.get('listItems')).to.have.length(3);
        });

        it('should have correct first date group', function () {
          expect(controller.get('listItems')[0].group).to.eql(work2.get('due').format('MMMM Do YYYY'));
        });

        it('should have correct first group items', function () {
          expect(controller.get('listItems')[0].items).to.eql([{course: course1, work: work2, category: null}]);
        });

        it('should have correct second date group', function () {
          expect(controller.get('listItems')[1].group).to.eql(work3.get('due').format('MMMM Do YYYY'));
        });

        it('should have correct second group items', function () {
          expect(controller.get('listItems')[1].items).to.eql([{course: course1, work: work4, category: category1}, {course: course2, work: work3, category: null}]);
        });

        it('should have correct third date group', function () {
          expect(controller.get('listItems')[2].group).to.eql(work5.get('due').format('MMMM Do YYYY'));
        });

        it('should have correct third group items', function () {
          expect(controller.get('listItems')[2].items).to.eql([{course: course2, work: work5, category: category2}]);
        });
      });
    });
  });

  describe('dueAfterValidator', function () {
    it('should pass when work is due after selected date', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueAfterValidator('September 28th 2017', {work: Ember.Object.create({due})}, due.subtract(1, 'days'))).to.eql(true);
    });

    it('should not pass when work is due before selected date', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueAfterValidator('September 28th 2017', {work: Ember.Object.create({due})}, due.add(1, 'days'))).to.eql(false);
    });

    it('should pass when no filter value is set', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueAfterValidator('September 28th 2017', {work: Ember.Object.create({due})}, null)).to.eql(true);
    });
  });

  describe('dueBeforeValidator', function () {
    it('should pass when work is due before selected date', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueBeforeValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due})}, due.add(1, 'days'))).to.eql(true);
    });

    it('should not pass when work is due after selected date', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueBeforeValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due})}, due.subtract(1, 'days'))).to.eql(false);
    });

    it('should pass when no filter value is set', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.dueBeforeValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due})}, null)).to.eql(true);
    });
  });

  describe('minWeightValidator', function () {
    it('should pass when entered weight is less', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.minWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 40)).to.eql(true);
    });

    it('should pass when entered weight is equal', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.minWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 50)).to.eql(true);
    });

    it('should not pass when entered weight is greater', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.minWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 60)).to.eql(false);
    });

    it('should pass when no filter value is set', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.minWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, null)).to.eql(true);
    });
  });

  describe('maxWeightValidator', function () {
    it('should pass when entered weight is greater', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.maxWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 60)).to.eql(true);
    });

    it('should pass when entered weight is equal', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.maxWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 50)).to.eql(true);
    });

    it('should not pass when entered weight is less', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.maxWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, 40)).to.eql(false);
    });

    it('should pass when no filter value is set', function () {
      const due = moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a');
      expect(controller.maxWeightValidator(due.format('MMMM Do YYYY'), {work: Ember.Object.create({due, weight: 50})}, null)).to.eql(true);
    });
  });

  describe('Actions', function () {
    describe('showEditCourseWorkModal()', function () {
      beforeEach(function () {
        controller.actions.showEditCourseWorkModal.apply(controller, [{work: work2}]);
      });

      it('should ensure edit course work modal is shown', function () {
        expect(controller.get('editCourseWork')).to.eql(true);
      });

      it('should have set item to edit', function () {
        expect(controller.get('itemToEdit')).to.eql(work2);
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

    describe('editCourseWork()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'send');
        sandbox.stub(cleanup, 'normalizeIndices');
        controller.set('itemToEdit', work2);
      });

      describe('not changing course ID', function () {
        beforeEach(function () {
          controller.actions.editCourseWork.apply(controller, ['Assignment 4', 33, 87, moment('September 30th 2017, 10:30 pmZ', 'MMMM Do yyyy, h:mm aZ').toISOString(), 456, 12345]);
        });

        it('should not have normalize indices', function () {
          expect(cleanup.normalizeIndices).to.have.callCount(0);
        });

        it('should not have changed index', function () {
          expect(work2.get('index')).to.eql(1);
        });

        it('should not have changed cid', function () {
          expect(work2.get('cid')).to.eql(12345);
        });

        it('should have changed category', function () {
          expect(work2.get('cgyid')).to.eql(456);
        });

        it('should have set the item label', function () {
          expect(work2.get('label')).to.eql('Assignment 4');
        });

        it('should have set the item weight', function () {
          expect(work2.get('weight')).to.eql(33);
        });

        it('should have set the item grade', function () {
          expect(work2.get('grade')).to.eql(87);
        });

        it('should have set the item due', function () {
          expect(work2.get('due')).to.eql('2017-09-30T22:30:00.000Z');
        });

        it('should have hidden edit course work modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditCourseWorkModal');
        });

        it('should have saved changes', function () {
          expect(work2.save).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });
      });

      describe('changing course ID', function () {
        beforeEach(function () {
          controller.actions.editCourseWork.apply(controller, ['Assignment 4', 33, 87, moment('September 30th 2017, 10:30 pmZ', 'MMMM Do yyyy, h:mm aZ').toISOString(), 456, 67890]);
        });

        it('should have normalize indices', function () {
          expect(cleanup.normalizeIndices).to.have.been.calledWithExactly(work2, [work1, work2, work4]);
        });

        it('should have changed index', function () {
          expect(work2.get('index')).to.eql(2);
        });

        it('should have changed cid', function () {
          expect(work2.get('cid')).to.eql(67890);
        });

        it('should have changed category', function () {
          expect(work2.get('cgyid')).to.eql(456);
        });

        it('should have set the item label', function () {
          expect(work2.get('label')).to.eql('Assignment 4');
        });

        it('should have set the item weight', function () {
          expect(work2.get('weight')).to.eql(33);
        });

        it('should have set the item grade', function () {
          expect(work2.get('grade')).to.eql(87);
        });

        it('should have set the item due', function () {
          expect(work2.get('due')).to.eql('2017-09-30T22:30:00.000Z');
        });

        it('should have hidden edit course work modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideEditCourseWorkModal');
        });

        it('should have saved changes', function () {
          expect(work2.save).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });
      });
    });
  });
});
