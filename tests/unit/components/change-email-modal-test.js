import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('change-email-modal');
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
    describe('Close handler provided', function () {
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

      describe('No close handler provided', function () {
        beforeEach(function () {
          component.set('onClose', undefined);
        });

        it('should have not thrown a exception', function () {
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

      describe('no email entered', function () {
        beforeEach(function () {
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('The E-mail address format you entered is invalid.');
        });
      });

      describe('no password entered', function () {
        beforeEach(function () {
          component.set('email', 'adam@ward.ca');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('Please confirm your account password.');
        });
      });

      describe('all values entered', function () {
        beforeEach(function () {
          component.set('email', 'adam@ward.ca');
          component.set('password', 'Passw0rd');
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });

        it('should have passed correct values to onSubmit handler', function () {
          expect(onSubmitStub).to.have.been.calledWithExactly('adam@ward.ca', 'Passw0rd');
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('email', 'adam@ward.ca');
          component.set('password', 'Passw0rd');
          component.set('onSubmit', undefined);
        });

        it('should have not thrown a exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });
  });
});
