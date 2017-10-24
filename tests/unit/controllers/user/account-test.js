import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('user/account')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, credential, reauthenticateWithCredential, updateEmail, updatePassword, sendEmailVerification, reload, save, close;
  beforeEach(function () {
    credential = sinon.stub();
    reauthenticateWithCredential = sinon.stub();
    updateEmail = sinon.stub();
    updatePassword = sinon.stub();
    sendEmailVerification = sinon.stub();
    reload = sinon.stub();
    save = sinon.stub();
    close = sinon.stub();

    credential.withArgs('adam@carleton.ca', 'Passw0rd').returns({email: 'adam@carleton.ca', password: 'Passw0rd'});
    const service = Ember.Service.extend({
      firebase_: {
        auth: {
          EmailAuthProvider: {
            credential
          }
        }
      }
    });
    this.register('service:firebaseApp', service);

    controller = this.subject();
    controller.set('model', Ember.Object.create({email: 'adam@carleton.ca', save}));
    controller.set('session', Ember.Object.create({
      currentUser: {
        email: 'adam@carleton.ca',
        reauthenticateWithCredential,
        updateEmail,
        updatePassword,
        sendEmailVerification,
        reload
      },
      close
    }));

    sandbox = sinon.sandbox.create();
    sandbox.stub(controller, 'send');
  });

  afterEach(function () {
    sandbox.restore()
  });

  describe('Actions', function () {
    describe('showChangeEmailModal()', function () {
      beforeEach(function () {
        controller.actions.showChangeEmailModal.apply(controller);
      });

      it('should have set changeEmail to true', function () {
        expect(controller.get('changeEmail')).to.eql(true);
      });
    });

    describe('hideChangeEmailModal()', function () {
      beforeEach(function () {
        controller.actions.hideChangeEmailModal.apply(controller);
      });

      it('should have set changeEmail to false', function () {
        expect(controller.get('changeEmail')).to.eql(false);
      });

      it('should have wiped out errorMessage', function () {
        expect(controller.get('errorMessage')).to.eql('');
      });
    });

    describe('showChangePasswordModal()', function () {
      beforeEach(function () {
        controller.actions.showChangePasswordModal.apply(controller);
      });

      it('should have set changePassword to true', function () {
        expect(controller.get('changePassword')).to.eql(true);
      });
    });

    describe('hideChangePasswordModal()', function () {
      beforeEach(function () {
        controller.actions.hideChangePasswordModal.apply(controller);
      });

      it('should have set changePassword to false', function () {
        expect(controller.get('changePassword')).to.eql(false);
      });

      it('should have wiped out errorMessage', function () {
        expect(controller.get('errorMessage')).to.eql('');
      });
    });

    describe('submitChangeEmail()', function () {
      describe('successfully changes email', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          updateEmail.withArgs('adam@ward.ca')
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          controller.actions.submitChangeEmail.apply(controller, ['adam@ward.ca', 'Passw0rd']);
        });

        it('should have set got credential with old email', function () {
          expect(credential).to.have.been.calledWithExactly('adam@carleton.ca', 'Passw0rd');
        });

        it('should have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.been.calledWithExactly({email: 'adam@carleton.ca', password: 'Passw0rd'});
        });

        it('should have updated authentication email', function () {
          expect(updateEmail).to.have.been.calledWithExactly('adam@ward.ca');
        });

        it('should have updated model email', function () {
          expect(controller.get('model').get('email')).to.eql('adam@ward.ca');
        });

        it('should have set accountChanged flag', function () {
          expect(controller.get('model').get('accountChanged')).to.eql(true);
        });

        it('should have saved model changes', function () {
          expect(save).to.have.callCount(1);
        });

        it('should have reloaded session user', function () {
          expect(reload).to.have.callCount(1);
        });

        it('should have sent email verification to new email', function () {
          expect(sendEmailVerification).to.have.callCount(1);
        });

        it('should have closed change email modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideChangeEmailModal');
        });

        it('should have closed the session', function () {
          expect(close).to.have.callCount(1);
        });
      });

      describe('failed to reauthenticate account', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Failed reauthentication'});
            }));
          controller.actions.submitChangeEmail.apply(controller, ['adam@ward.ca', 'Passw0rd']);
        });

        it('should not have updated account email', function () {
          expect(updateEmail).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('Failed reauthentication');
        });
      });

      describe('failed to update email', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          updateEmail.withArgs('adam@ward.ca')
            .returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Failed to update email'});
            }));
          controller.actions.submitChangeEmail.apply(controller, ['adam@ward.ca', 'Passw0rd']);
        });

        it('should have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.been.calledWithExactly({email: 'adam@carleton.ca', password: 'Passw0rd'});
        });

        it('should have tried to update authentication email', function () {
          expect(updateEmail).to.have.been.calledWithExactly('adam@ward.ca');
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('Failed to update email');
        });
      });

      describe('new email is same as old email', function () {
        beforeEach(function () {
          controller.actions.submitChangeEmail.apply(controller, ['adam@carleton.ca', 'Passw0rd']);
        });

        it('should not have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.callCount(0);
        });

        it('should not have updated authentication email', function () {
          expect(updateEmail).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('The new E-mail entered is the same as you current account E-mail.');
        });
      });
    });

    describe('submitChangePassword()', function () {
      describe('successfully changes password', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          updatePassword.withArgs('F00bar')
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          controller.actions.submitChangePassword.apply(controller, ['Passw0rd', 'F00bar']);
        });

        it('should have set got credential with old password', function () {
          expect(credential).to.have.been.calledWithExactly('adam@carleton.ca', 'Passw0rd');
        });

        it('should have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.been.calledWithExactly({email: 'adam@carleton.ca', password: 'Passw0rd'});
        });

        it('should have updated authentication password', function () {
          expect(updatePassword).to.have.been.calledWithExactly('F00bar');
        });

        it('should have set accountChanged flag', function () {
          expect(controller.get('model').get('accountChanged')).to.eql(true);
        });

        it('should have saved model changes', function () {
          expect(save).to.have.callCount(1);
        });

        it('should have closed change email modal', function () {
          expect(controller.send).to.have.been.calledWithExactly('hideChangePasswordModal');
        });

        it('should have closed the session', function () {
          expect(close).to.have.callCount(1);
        });
      });

      describe('failed to reauthenticate account', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Failed reauthentication'});
            }));
          controller.actions.submitChangePassword.apply(controller, ['Passw0rd', 'F00bar']);
        });

        it('should not have updated account password', function () {
          expect(updatePassword).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('Failed reauthentication');
        });
      });

      describe('failed to update password', function () {
        beforeEach(function () {
          reauthenticateWithCredential.withArgs({email: 'adam@carleton.ca', password: 'Passw0rd'})
            .returns(new Ember.RSVP.Promise(function(resolve) {
              resolve();
            }));
          updatePassword.withArgs('F00bar')
            .returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Failed to update password'});
            }));
          controller.actions.submitChangePassword.apply(controller, ['Passw0rd', 'F00bar']);
        });

        it('should have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.been.calledWithExactly({email: 'adam@carleton.ca', password: 'Passw0rd'});
        });

        it('should have tried to update authentication password', function () {
          expect(updatePassword).to.have.been.calledWithExactly('F00bar');
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('Failed to update password');
        });
      });

      describe('new password is same as old password', function () {
        beforeEach(function () {
          controller.actions.submitChangePassword.apply(controller, ['Passw0rd', 'Passw0rd']);
        });

        it('should not have reauthenticated session', function () {
          expect(reauthenticateWithCredential).to.have.callCount(0);
        });

        it('should not have updated authentication password', function () {
          expect(updatePassword).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(controller.get('errorMessage')).to.eql('The new password entered is the same as you current account password.');
        });
      });
    });
  });
});
