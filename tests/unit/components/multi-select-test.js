import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

import {createSelectorStub} from '../../helpers/selector-stub';

const test = unit('multi-select');
describe(test.label, function () {
  test.setup();

  let component, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    component = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('Actions', function () {
    describe('toggleSelection()', function () {
      describe('add selection', function () {
        let drawerStub;
        beforeEach(function () {
          drawerStub = createSelectorStub('show');
          sandbox.stub(component, '$')
            .withArgs('.app-menu-drawer').returns(drawerStub);
          component.set('selectedItems', []);
          component.actions.toggleSelection.apply(component, ['a']);
        });

        it('should have added \'a\' to selectedItems', function () {
          expect(component.get('selectedItems')).to.contain('a');
        });
      });

      describe('remove selection', function () {
        let drawerStub;
        beforeEach(function () {
          drawerStub = createSelectorStub('show');
          sandbox.stub(component, '$')
            .withArgs('.app-menu-drawer').returns(drawerStub);
          component.set('selectedItems', ['a']);
          component.actions.toggleSelection.apply(component, ['a']);
        });

        it('should have removed \'a\' fro, selectedItems', function () {
          expect(component.get('selectedItems')).to.not.contain('a');
        });
      });
    });
  });
});
