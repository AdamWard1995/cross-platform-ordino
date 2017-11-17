import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const groupings = [
  {
    group: 'A',
    items: [{name: 'Adam', age: 22}, {name: 'Arthur', age: 15}]
  },
  {
    group: 'B',
    items: [{name: 'Brad', age: 31}]
  }
];

const test = unit('filtered-list');
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
    describe('filteredItems', function () {
      beforeEach(function () {
        component.set('groups', groupings);
        component.set('filters', [
          {
            value: 'A',
            passes: function (group, item, name) { return item.name.startsWith(name); }
          },
          {
            value: 18,
            passes: function (group, item, age) { return item.age > age; }
          }
        ]);
      });

      it('should have only have 1st group left', function () {
        expect(component.get('filteredItems'), 'Should only have one group').to.have.length(1);
        expect(component.get('filteredItems')[0].group, 'Should be the \'A\' group').to.eql('A');
      });

      it('should have only have 1st item of first group left', function () {
        expect(component.get('filteredItems')[0].items, 'Should only have one item').to.have.length(1);
        expect(component.get('filteredItems')[0].items[0].name, 'Should be the \'Adam\' item').to.eql('Adam');
      });
    });

    describe('filterViews', function () {
      let view1, view2;
      beforeEach(function () {
        view1 = {foo: 'bar'};
        view2 = {foo: 'baz'};
        component.set('filters', [
          {
            view: view1
          },
          {
            view: view2
          }
        ]);
      });

      it('should have 2 filter views', function () {
        expect(component.get('filterViews')).to.have.length(2);
      });

      it('should have view1 first', function () {
        expect(component.get('filterViews')[0]).to.eql(view1);
      });

      it('should have view1 second', function () {
        expect(component.get('filterViews')[1]).to.eql(view2);
      });
    });
  });

  describe('Actions', function () {
    describe('itemSelected()', function () {
      let onSelect, item;
      beforeEach(function () {
        onSelect = sinon.stub();
        item = {foo: 'bar'};
        component.set('onItemSelected', onSelect);
        component.actions.itemSelected.apply(component, [item]);
      });

      it('should have called selection handler', function () {
        expect(onSelect).to.have.callCount(1);
      });

      it('should have passed correct parameter to the selection handler', function () {
        expect(onSelect).to.have.been.calledWithExactly(item);
      });
    });

    describe('clear()', function () {
      describe('clear handler provided', function () {
        let onClear;
        beforeEach(function () {
          onClear = sinon.stub();
          component.set('onClear', onClear);
          component.actions.clear.apply(component);
        });

        it('should have called selection handler', function () {
          expect(onClear).to.have.callCount(1);
        });
      });

      describe('no clear handler provided', function () {
        beforeEach(function () {
          component.set('onClear', undefined);
        });

        it('should have not thrown an exception', function () {
          expect(() => component.actions.clear.apply(component)).to.not.throw();
        });
      });
    });
  });
});
