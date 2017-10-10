import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('reset-password')
describe(test.label, function () {
  test.setup();

  let controller, sendEmailStub;
  beforeEach(function () {
    sendEmailStub = sinon.stub();
    const service = Ember.Service.extend({auth: function () {return {sendPasswordResetEmail: sendEmailStub}}});
    this.register('service:firebaseApp', service);
    controller = this.subject();
    controller.set('email', 'adam@ward.ca');
  });

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('error message set', function () {
        beforeEach(function () {
          controller.set('errorMessage', 'Error message');
        });

        it('should return is-visible class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-visible');
        });
      });

      describe('no error message set', function () {
        beforeEach(function () {
          controller.set('errorMessage', '');
        });

        it('should return is-hidden class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-hidden');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('sendPasswordReset()', function () {
      describe('password reset email was sent', function () {
        beforeEach(function () {
          sendEmailStub.returns(new Ember.RSVP.Promise(function(resolve) {
            resolve();
          }));
        });

        describe('session already authenticated', function () {
          let closeStub;
          beforeEach(function () {
            closeStub = sinon.stub();
            controller.set('session', Ember.Object.create({close: closeStub, isAuthenticated: true}));
            controller.actions.sendPasswordReset.apply(controller);
          });

          it('should have close session', function () {
            expect(closeStub).to.have.callCount(1);
          });

          it('should have set emailSent to true', function () {
            expect(controller.get('emailSent')).to.eql(true);
          });

          it('should have reset email to null', function () {
            expect(controller.get('email')).to.eql(null);
          });
        });

        describe('session not authenticated', function () {
          let closeStub;
          beforeEach(function () {
            closeStub = sinon.stub();
            controller.set('session', Ember.Object.create({close: closeStub, isAuthenticated: false}));
            controller.actions.sendPasswordReset.apply(controller);
          });

          it('should have not closed session', function () {
            expect(closeStub).to.have.callCount(0);
          });

          it('should have set emailSent to true', function () {
            expect(controller.get('emailSent')).to.eql(true);
          });

          it('should have reset email to null', function () {
            expect(controller.get('email')).to.eql(null);
          });
        });
      });
    });

    describe('email failed to send', function () {
      beforeEach(function () {
        sendEmailStub.returns(new Ember.RSVP.Promise(function(resolve, reject) {
          reject({message: 'Error message'});
        }));
        controller.actions.sendPasswordReset.apply(controller);
      });

      it('should have set errorMessage', function () {
        expect(controller.get('errorMessage')).to.eql('Error message');
      });
    });
  });
});
