import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test';
import sinon from 'sinon';

const test = unit('confirm-modal');
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
    describe('close()', function () {
      describe('Close handler provided', function () {
        let onCloseStub;
        beforeEach(function () {
          onCloseStub = sinon.stub();
          component.set('onClose', onCloseStub);
          component.actions.close.apply(component);
        });

        it('should have called onClose handler', function () {
          expect(onCloseStub).to.have.callCount(1);
        });
      });

      describe('No close handler provided', function () {
        it('should have not thrown a exception', function () {
          expect(() => component.actions.close.apply(component)).to.not.throw();
        });
      });
    });

    describe('confirm()', function () {
      describe('Confirm handler provided', function () {
        let onConfirmStub;
        beforeEach(function () {
          onConfirmStub = sinon.stub();
          component.set('onConfirm', onConfirmStub);
          component.actions.confirm.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onConfirmStub).to.have.callCount(1);
        });
      });

      describe('No confirm handler provided', function () {
        it('should have not thrown a exception', function () {
          expect(() => component.actions.confirm.apply(component)).to.not.throw();
        });
      });
    });
  });
});
