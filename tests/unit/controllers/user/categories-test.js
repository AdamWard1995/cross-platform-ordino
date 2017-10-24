import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import moment from 'moment';
import sinon from 'sinon';

import * as cleanup from 'cross-platform-ordino/utils/cleanup';

const test = controller('user/categories')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, category1, category2, category3, work1, work2, save;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    controller = this.subject();

    category1 = Ember.Object.create({id: 987, label: 'Assignment', icon: 'file-text', save: sinon.stub()});
    category2 = Ember.Object.create({id: 654, label: 'Reading', icon: 'book'});
    category3 = Ember.Object.create({id: 321, label: 'Exam', icon: 'flag'});
    category1.get('save').returns(new Ember.RSVP.Promise(function(resolve) {
      resolve();
    }));

    work1 = Ember.Object.create({save: sinon.stub(), id: 123, index: 1, cid: 12345, label: 'Assignment 2', weight: 25, grade: 95, due: moment('October 17th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a')});
    work2 = Ember.Object.create({save: sinon.stub(), id: 456, index: 0, cid: 12345, label: 'Assignment 1', weight: 25, grade: 90, due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a')});

    save = sinon.stub();
    save.returns(new Ember.RSVP.Promise(function(resolve) {
      resolve();
    }));
    sandbox.stub(controller, 'send');

    controller.set('model', {
      categories: [category1, category2, category3],
      courseWork: [work1, work2]
    });
    controller.set('session', Ember.Object.create({currentUser: {uid: 680}}));
    controller.store = {createRecord: sinon.stub()};
    controller.store.createRecord.returns({save})
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Computed Properties', function () {
    describe('deleteConfirmationMessage', function () {
      describe('itemToDelete is set', function () {
        beforeEach(function () {
          controller.set('itemToDelete', category1);
        });

        it('should have the correct confirmation message' , function () {
          expect(controller.get('deleteConfirmationMessage')).to.eql('Are you sure you want to delete Assignment?');
        });
      });

      describe('itemToDelete not set', function () {
        it('should have no confirmation message' , function () {
          expect(controller.get('deleteConfirmationMessage')).to.eql(undefined);
        });
      });
    });
  });

  describe('Actions', function () {
    describe('showEditModal()', function () {
      beforeEach(function () {
        controller.actions.showEditModal.apply(controller, [category1]);
      });

      it('should ensure edit category modal is shown', function () {
        expect(controller.get('editCategory')).to.eql(true);
      });

      it('should have set item to edit', function () {
        expect(controller.get('itemToEdit')).to.eql(category1);
      });
    });

    describe('hideEditModal()', function () {
      beforeEach(function () {
        controller.actions.hideEditModal.apply(controller);
      });

      it('should ensure edit category modal is hidden', function () {
        expect(controller.get('editCategory')).to.eql(false);
      });

      it('should have set item to edit', function () {
        expect(controller.get('itemToEdit')).to.eql(null);
      });
    });

    describe('showDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.showDeleteModal.apply(controller, [category1]);
      });

      it('should ensure confirm delete category modal is shown', function () {
        expect(controller.get('deleteCategory')).to.eql(true);
      });

      it('should have set item to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(category1);
      });
    });

    describe('hideDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteModal.apply(controller);
      });

      it('should ensure confirm delete category modal is hidden', function () {
        expect(controller.get('deleteCategory')).to.eql(false);
      });

      it('should have set item to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(null);
      });
    });

    describe('showCreateModal()', function () {
      beforeEach(function () {
        controller.actions.showCreateModal.apply(controller);
      });

      it('should ensure create category modal is shown', function () {
        expect(controller.get('createCategory')).to.eql(true);
      });
    });

    describe('hideCreateModal()', function () {
      beforeEach(function () {
        controller.actions.hideCreateModal.apply(controller);
      });

      it('should ensure create category modal is hidden', function () {
        expect(controller.get('createCategory')).to.eql(false);
      });
    });

    describe('createCategory()', function () {
      beforeEach(function () {
        controller.actions.createCategory.apply(controller, ['Reading', 'book']);
      });

      it('should have created new category record', function () {
        expect(controller.store.createRecord).to.have.been.calledWithExactly('category', {
          uid: 680,
          index: 3,
          label: 'Reading',
          icon: 'book'
        });
      });

      it('should have saved new record', function () {
        expect(save).to.have.callCount(1);
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should ensure create category modal is hidden', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideCreateModal');
      });
    });

    describe('editCategory()', function () {
      beforeEach(function () {
        controller.set('itemToEdit', category1);
        controller.actions.editCategory.apply(controller, ['Quiz', 'monitor']);
      });

      it('should have updated label', function () {
        expect(category1.get('label')).to.eql('Quiz');
      });

      it('should have updated icon', function () {
        expect(category1.get('icon')).to.eql('monitor');
      });

      it('should have saved changes', function () {
        expect(category1.get('save')).to.have.callCount(1);
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should ensure edit category modal is hidden', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideEditModal');
      });
    });

    describe('deleteCategory()', function () {
      beforeEach(function () {
        controller.set('itemToDelete', category1);
        sandbox.stub(cleanup, 'deleteCategory');
        controller.actions.deleteCategory.apply(controller);
      });

      it('should have deleted the category', function () {
        expect(cleanup.deleteCategory).to.have.been.calledWithExactly(category1, [category1, category2, category3], [work1, work2]);
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should ensure delete category modal is hidden', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteModal');
      });
    });
  });
});
