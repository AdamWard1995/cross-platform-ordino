import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('change-password-modal');
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

      describe('no current password entered', function () {
        beforeEach(function () {
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('Please confirm your account password.');
        });
      });

      describe('no new password entered', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('The new passwords you entered do not match.');
        });
      });

      describe('no confirmed new password entered', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.set('password', 'F00Bar');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('The new passwords you entered do not match.');
        });
      });

      describe('no confirmed and new password entered', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.set('password', 'F00Bar');
          component.set('confirm-password', 'FooBar');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('The new passwords you entered do not match.');
        });
      });

      describe('invalid password entered', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.set('password', 'foobar');
          component.set('confirm-password', 'foobar');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('The password you entered does not contain at least one uppercase letter, one lowercase letter, and one number.');
        });
      });

      describe('all values entered', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.set('password', 'F00Bar');
          component.set('confirm-password', 'F00Bar');
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });

        it('should have passed correct values to onSubmit handler', function () {
          expect(onSubmitStub).to.have.been.calledWithExactly('Passw0rd', 'F00Bar');
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('current-password', 'Passw0rd');
          component.set('password', 'F00Bar');
          component.set('confirm-password', 'F00Bar');
          component.set('onSubmit', undefined);
        });

        it('should have not thrown a exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });
  });
});
