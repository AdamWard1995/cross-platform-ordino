import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('download-modal');
describe(test.label, function () {
  test.setup();

  let component;
  beforeEach(function () {
    component = this.subject();
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
        beforeEach(function () {
          component.set('onClose', undefined);
        });

        it('should have not thrown an exception', function () {
          expect(() => component.actions.close.apply(component)).to.not.throw();
        });
      });
    });
  });
});
