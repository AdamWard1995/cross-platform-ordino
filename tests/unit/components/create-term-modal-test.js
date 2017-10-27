import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('create-term-modal');
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
        beforeEach(function () {
          component.set('onClose', undefined);
        });

        it('should have not thrown an exception', function () {
          expect(() => component.actions.close.apply(component)).to.not.throw();
        });
      });
    });

    describe('submit()', function () {
      let onSubmitStub;
      beforeEach(function () {
        onSubmitStub = sinon.stub();
        component.set('onSubmit', onSubmitStub);
      });

      describe('no semester selected', function () {
        beforeEach(function () {
          component.set('semester', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to select a semester.');
        });
      });

      describe('no year entered', function () {
        beforeEach(function () {
          component.set('semester', 'Fall');
          component.set('year', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a year.');
        });
      });

      describe('all values entered', function () {
        beforeEach(function () {
          component.set('semester', 'Fall');
          component.set('year', 2017);
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('semester', 'Fall');
          component.set('year', 2017);
          component.set('onSubmit', undefined);
        });

        it('should have not thrown an exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });
  });
});
