import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

import * as cleanup from 'cross-platform-ordino/utils/cleanup';

const test = controller('user/terms/index')
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
      describe('is item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', Ember.Object.create({semester: 'Fall', year: 2017}));
        });

        it('should return correct confirmation message', function () {
          expect(controller.get('deleteConfirmationMessage')).to.eql(
            'Are you sure you want to delete Fall 2017?'
          );
        });
      });

      describe('no item to delete', function () {
        beforeEach(function () {
          controller.set('itemToDelete', undefined);
        });

        it('should return correct confirmation message', function () {
          expect(controller.get('deleteConfirmationMessage')).to.eql(undefined);
        });
      });
    });

    describe('noTerms', function () {
      beforeEach(function () {
        controller.set('model', []);
      });

      describe('no terms', function () {
        it('should return true', function () {
          expect(controller.get('noTerms')).to.eql(true);
        });
      });

      describe('one term', function () {
        beforeEach(function () {
          controller.set('model', ['foo']);
        });

        it('should return false', function () {
          expect(controller.get('noTerms')).to.eql(false);
        });
      });

      describe('multiple terms', function () {
        beforeEach(function () {
          controller.set('model', ['foo', 'bar', 'baz']);
        });

        it('should return false', function () {
          expect(controller.get('noTerms')).to.eql(false);
        });
      });
    });
  });

  describe('Actions', function () {
    describe('showCreateModal()', function () {
      beforeEach(function () {
        controller.actions.showCreateModal.apply(controller);
      });

      it('should make sure create term modal is shown', function () {
        expect(controller.get('createTerm')).to.eql(true);
      });
    });

    describe('hideCreateModal()', function () {
      beforeEach(function () {
        controller.actions.hideCreateModal.apply(controller);
      });

      it('should make sure create term modal is hidden', function () {
        expect(controller.get('createTerm')).to.eql(false);
      });
    });

    describe('showDeleteModal()', function () {
      let item = {foo: 'bar'};
      beforeEach(function () {
        controller.actions.showDeleteModal.apply(controller, [item]);
      });

      it('should make sure delete term confirmation modal is shown', function () {
        expect(controller.get('deleteTerm')).to.eql(true);
      });

      it('should have stored the term to delete on confirmation', function () {
        expect(controller.get('itemToDelete')).to.eql(item);
      });
    });

    describe('hideDeleteModal()', function () {
      beforeEach(function () {
        controller.actions.hideDeleteModal.apply(controller);
      });

      it('should make sure delete term confirmation modal is hidden', function () {
        expect(controller.get('deleteTerm')).to.eql(false);
      });

      it('should have wiped the term to delete', function () {
        expect(controller.get('itemToDelete')).to.eql(null);
      });
    });

    describe('createTerm()', function () {
      let item1, item2, item3, save, session, store, user;
      beforeEach(function () {
        item1 = Ember.Object.create({current: false, save: sinon.stub()});
        item2 = Ember.Object.create({current: true, save: sinon.stub()});
        item3 = Ember.Object.create({current: false, save: sinon.stub()});
        user = Ember.Object.create({uid: 12345});
        session = Ember.Object.create({currentUser: user});
        store = {createRecord: sinon.stub()};
        save = sinon.stub();
        store.createRecord.returns({save});
        save.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve();
        }));
        sandbox.stub(cleanup, 'deleteTerm');
        sandbox.stub(controller, 'send');
        controller.store = store;
        controller.set('model', [item1, item2, item3]);
        controller.set('itemToDelete', item1);
        controller.set('session', session);
      });

      describe('create new current term', function () {
        beforeEach(function () {
          controller.actions.createTerm.apply(controller, ['Fall', 2017, true]);
        });

        it('should have created new term record', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('term', {
            uid: 12345,
            index: 3,
            semester: 'Fall',
            year: 2017,
            current: true
          });
        });

        it('should have saved new term record', function () {
          expect(save).to.have.callCount(1);
        });

        it('should have made old current term a non-current term', function () {
          expect(item2.get('current'), 'Should have set current to false').to.eql(false);
          expect(item2.save, 'Should have saved change').to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should have closed term creation modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideCreateModal');
        });
      });

      describe('create new non-current term', function () {
        beforeEach(function () {
          controller.actions.createTerm.apply(controller, ['Fall', 2017, false]);
        });

        it('should have created new term record', function () {
          expect(store.createRecord).to.have.been.calledWithExactly('term', {
            uid: 12345,
            index: 3,
            semester: 'Fall',
            year: 2017,
            current: false
          });
        });

        it('should have saved new term record', function () {
          expect(save).to.have.callCount(1);
        });

        it('should have refreshed the model', function () {
          expect(controller.send).to.have.been.calledWithExactly('refreshModel');
        });

        it('should have closed term creation modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideCreateModal');
        });
      });
    });

    describe('deleteTerm()', function () {
      let item1, item2, item3, store;
      beforeEach(function () {
        item1 = {foo: 'bar'};
        item2 = {foo: 'baz'};
        item3 = {foo: 'qux'};
        store = {foo: 'voo'};
        sandbox.stub(cleanup, 'deleteTerm');
        sandbox.stub(controller, 'send');
        controller.store = store;
        controller.set('model', [item1, item2, item3]);
        controller.set('itemToDelete', item1);
        controller.actions.deleteTerm.apply(controller);
      });

      it('should have called deleteTerm cleanup utility', function () {
        expect(cleanup.deleteTerm).to.have.been.calledWithExactly(item1, [item2, item3], store);
      });

      it('should have refreshed the model', function () {
        expect(controller.send).to.have.been.calledWithExactly('refreshModel');
      });

      it('should have closed delete confirmation modal', function () {
        expect(controller.send).to.have.been.calledWithExactly('hideDeleteModal');
      });
    });

    describe('goToTermRoute()', function () {
      beforeEach(function () {
        sandbox.stub(controller, 'transitionToRoute')
        controller.actions.goToTermRoute.apply(controller, [Ember.Object.create({id: 12345})]);
      });

      it('should have transition to the route for the selected term', function () {
        expect(controller.transitionToRoute).to.have.been.calledWithExactly('user.terms.term', 12345);
      });
    });
  });
});
