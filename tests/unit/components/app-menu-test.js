import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

import {createSelectorStub} from '../../helpers/selector-stub';

const test = unit('app-menu');
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
    describe('toggleDrawerState()', function () {
      describe('drawerOpen initially false', function () {
        let drawerStub;
        beforeEach(function () {
          drawerStub = createSelectorStub('show');
          sandbox.stub(component, '$')
            .withArgs('.app-menu-drawer').returns(drawerStub);
          component.set('drawerOpen', false);
          component.actions.toggleDrawerState.apply(component);
        });

        it('should set drawerOpen to true', function () {
          expect(component.get('drawerOpen')).to.eql(true);
        });

        it('should slide drawer into visibility from left to right', function () {
          expect(drawerStub.show).to.have.been.calledWithExactly('slide', {direction: 'left'}, 250);
        });
      });

      describe('drawerOpen initially true', function () {
        let drawerStub;
        beforeEach(function () {
          drawerStub = createSelectorStub('hide');
          sandbox.stub(component, '$')
            .withArgs('.app-menu-drawer').returns(drawerStub);
          component.set('drawerOpen', true);
          component.actions.toggleDrawerState.apply(component);
          drawerStub.hide.callArg(3);
        });

        it('should set drawerOpen to false', function () {
          expect(component.get('drawerOpen')).to.eql(false);
        });

        it('should slide drawer out of visibility from right to left', function () {
          expect(drawerStub.hide).to.have.been.calledWith('slide', {direction: 'left'}, 250);
        });
      });
    });
  });
});
