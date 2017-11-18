import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('ordered-list');
describe(test.label, function () {
  test.setup();

  let component, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    component = this.subject();
    component.set('items', [
      Ember.Object.create({title: 'item1', index: 2}),
      Ember.Object.create({title: 'item2', index: 0}),
      Ember.Object.create({title: 'item3', index: 1})
    ]);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('Computed Properties', function () {
    describe('orderedItems', function () {
      it('should have item2 first', function () {
        expect(component.get('orderedItems')[0].title).to.eql('item2');
      });

      it('should have item3 second', function () {
        expect(component.get('orderedItems')[1].title).to.eql('item3');
      });

      it('should have item1 second', function () {
        expect(component.get('orderedItems')[2].title).to.eql('item1');
      });
    });
  });

  describe('Actions', function () {
    describe('incrementIndex()', function () {
      beforeEach(function () {
        sandbox.stub(component, 'swapIndices');
        sandbox.stub(component, 'addChanged');
      });

      describe('already last on list', function () {
        beforeEach(function () {
          component.actions.incrementIndex.apply(component, [component.get('items')[0]]);
        });

        it('should not have swapped any indices', function () {
          expect(component.swapIndices).to.have.callCount(0);
        });

        it('should not have added changed item', function () {
          expect(component.addChanged).to.have.callCount(0);
        });

        it('should have entered arranging state', function () {
          expect(component.get('arranging')).to.eql(true);
        });
      });

      describe('not last on list', function () {
        beforeEach(function () {
          component.actions.incrementIndex.apply(component, [component.get('items')[1]]);
        });

        it('should have called swapped indices', function () {
          expect(component.swapIndices).to.have.callCount(1);
        });

        it('should have swapped item2 with item3', function () {
          expect(component.swapIndices).to.have.been.calledWithExactly(component.get('items')[1], component.get('items')[2]);
        });

        it('should have added two changed items', function () {
          expect(component.addChanged).to.have.callCount(2);
        });

        it('should have added first changed item', function () {
          expect(component.addChanged).to.have.been.calledWithExactly(component.get('items')[1]);
        });

        it('should have added second changed item', function () {
          expect(component.addChanged).to.have.been.calledWithExactly(component.get('items')[2]);
        });

        it('should have entered arranging state', function () {
          expect(component.get('arranging')).to.eql(true);
        });
      });
    });

    describe('decrementIndex()', function () {
      beforeEach(function () {
        sandbox.stub(component, 'swapIndices');
        sandbox.stub(component, 'addChanged');
      });

      describe('already first on list', function () {
        beforeEach(function () {
          component.actions.decrementIndex.apply(component, [component.get('items')[1]]);
        });

        it('should not have swapped any indices', function () {
          expect(component.swapIndices).to.have.callCount(0);
        });

        it('should not have added changed item', function () {
          expect(component.addChanged).to.have.callCount(0);
        });

        it('should have entered arranging state', function () {
          expect(component.get('arranging')).to.eql(true);
        });
      });

      describe('not first on list', function () {
        beforeEach(function () {
          component.actions.decrementIndex.apply(component, [component.get('items')[0]]);
        });

        it('should have called swapped indices', function () {
          expect(component.swapIndices).to.have.callCount(1);
        });

        it('should have swapped item1 with item3', function () {
          expect(component.swapIndices).to.have.been.calledWithExactly(component.get('items')[0], component.get('items')[2]);
        });

        it('should have added two changed items', function () {
          expect(component.addChanged).to.have.callCount(2);
        });

        it('should have added first changed item', function () {
          expect(component.addChanged).to.have.been.calledWithExactly(component.get('items')[0]);
        });

        it('should have added second changed item', function () {
          expect(component.addChanged).to.have.been.calledWithExactly(component.get('items')[2]);
        });

        it('should have entered arranging state', function () {
          expect(component.get('arranging')).to.eql(true);
        });
      });
    });

    describe('itemSelected()', function () {
      describe('already in arranging state', function () {
        let onSelectStub;
        beforeEach(function () {
          onSelectStub = sinon.stub();
          component.set('arranging', true);
          component.set('onItemSelected', onSelectStub);
          component.actions.itemSelected.apply(component, [component.get('items')[0]]);
        });

        it('should not have called selection handler', function () {
          expect(component.onItemSelected).to.have.callCount(0);
        });

        it('should have left arranging state', function () {
          expect(component.get('arranging')).to.eql(false);
        });
      });

      describe('already in deleting state', function () {
        let onSelectStub;
        beforeEach(function () {
          onSelectStub = sinon.stub();
          component.set('deleting', true);
          component.set('onItemSelected', onSelectStub);
          component.actions.itemSelected.apply(component, [component.get('items')[0]]);
        });

        it('should not have called selection handler', function () {
          expect(component.onItemSelected).to.have.callCount(0);
        });

        it('should have left deleting state', function () {
          expect(component.get('deleting')).to.eql(false);
        });
      });

      describe('not in arranging or deleting state', function () {
        let onSelectStub;
        beforeEach(function () {
          onSelectStub = sinon.stub();
          component.set('onItemSelected', onSelectStub);
          component.actions.itemSelected.apply(component, [component.get('items')[0]]);
        });

        it('should have called selection handler', function () {
          expect(component.onItemSelected).to.have.callCount(1);
        });

        it('should have passed correct item to delete handler', function () {
          expect(onSelectStub).to.have.been.calledWithExactly(component.get('items')[0]);
        });
      });

      describe('No selection handler provided', function () {
        it('should have not thrown a exception', function () {
          expect(() => component.actions.itemSelected.apply(component)).to.not.throw();
        });
      });
    });

    describe('deleteItem()', function () {
      describe('Selection handler provided', function () {
        let onDeleteStub;
        beforeEach(function () {
          onDeleteStub = sinon.stub();
          component.set('onItemDeleted', onDeleteStub);
          component.actions.deleteItem.apply(component, [component.get('items')[0]]);
        });

        it('should have called delete handler', function () {
          expect(onDeleteStub).to.have.callCount(1);
        });

        it('should have passed correct item to delete handler', function () {
          expect(onDeleteStub).to.have.been.calledWithExactly(component.get('items')[0]);
        });

        it('should have entered the deleting state', function () {
          expect(component.get('deleting')).to.eql(true);
        });
      });

      describe('No selection handler provided', function () {
        it('should have not thrown a exception', function () {
          expect(() => component.actions.deleteItem.apply(component)).to.not.throw();
        });
      });
    });
  });

  describe('swapIndices()', function () {
    let item1, item2;
    beforeEach(function () {
      item1 = component.get('items')[0];
      item2 = component.get('items')[1];
      item1.save = sinon.stub();
      item2.save = sinon.stub();
      component.swapIndices(item1, item2);
    });

    it('should have updated item1 index', function () {
      expect(item1.get('index')).to.eql(0);
    });

    it('should have updated item2 index', function () {
      expect(item2.get('index')).to.eql(2);
    });

    it('should have saved changes to item1', function () {
      expect(item1.save).to.have.callCount(1);
    });

    it('should have saved changes to item2', function () {
      expect(item2.save).to.have.callCount(1);
    });
  });
});
