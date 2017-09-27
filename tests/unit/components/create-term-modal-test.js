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

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('no error message set', function () {
        beforeEach(function () {
          component.set('errorMessage', '');
        });

        it('should use is-gone as class', function () {
          expect(component.get('errorMessageClass')).to.eql('is-gone');
        });
      });

      describe('an error message is set', function () {
        beforeEach(function () {
          component.set('errorMessage', 'There has been an error!');
        });

        it('should use is-visible as class', function () {
          expect(component.get('errorMessageClass')).to.eql('is-visible');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('close()', function () {
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
    });
  });
});
