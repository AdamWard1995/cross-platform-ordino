import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('sign-in')
describe(test.label, function () {
  test.setup();

  let controller;
  beforeEach(function () {
    const service = Ember.Service.extend({});
    this.register('service:firebaseApp', service);
    controller = this.subject();
  });

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('no error message', function () {
        beforeEach(function () {
          controller.set('errorMessage', '');
        });

        it('should set return is-hidden class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-hidden');
        });
      });

      describe('is an error message', function () {
        beforeEach(function () {
          controller.set('errorMessage', 'error message!');
        });

        it('should set return is-visible class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-visible');
        });
      });
    });

    describe('sendVerificationClass', function () {
      describe('email is verified', function () {
        beforeEach(function () {
          controller.set('emailNotVerified', false);
        });

        it('should set return is-hidden class', function () {
          expect(controller.get('sendVerificationClass')).to.eql('is-hidden');
        });
      });

      describe('email is not verified', function () {
        beforeEach(function () {
          controller.set('emailNotVerified', true);
        });

        it('should set return is-visible class', function () {
          expect(controller.get('sendVerificationClass')).to.eql('is-visible');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('signIn()', function () {
      let sessionStub;
      beforeEach(function () {
        sessionStub = sinon.stub();
        controller.set('session', sessionStub);
      });

      describe('already a session open', function () {
        beforeEach(function () {
          sessionStub.get = sinon.stub();
          sessionStub.get.withArgs('isAuthenticated').returns(true);
          controller.actions.signIn.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('An account session is already open. Please sign out before signing in to a different account.')
        })
      });

      describe('no session open yet', function () {
        beforeEach(function () {
          sessionStub.get = sinon.stub();
          sessionStub.get.withArgs('isAuthenticated').returns(false);
          sessionStub.open = sinon.stub();
        });

        describe('try to open session', function () {
          beforeEach(function () {
            sessionStub.open.returns({
              then: sinon.stub()
            });
            controller.actions.signIn.apply(controller, ['adam@ward.ca', 'abc123']);
          });

          it('should have called open with right parameters', function () {
            expect(sessionStub.open).to.have.been.calledWithExactly('firebase', {
              provider: 'password',
              email: 'adam@ward.ca',
              password: 'abc123'
            });
          });
        });

        describe('email not verified yet', function () {
          beforeEach(function () {
            sessionStub.close = sinon.stub();
            /*eslint no-unused-vars: ["error", { "args": "none" }]*/
            sessionStub.open.returns(new Ember.RSVP.Promise(function(resolve, reject) {
              resolve({currentUser: {emailVerified: false}});
            }));
            controller.actions.signIn.apply(controller, ['adam@ward.ca', 'abc123']);
          });

          it('should have set the right error message', function () {
            expect(controller.get('errorMessage')).to.eql('The E-mail address for this account has not been verified.');
          });

          it('should ensure resend email verification link is displayed', function () {
            expect(controller.get('emailNotVerified')).to.eql(true);
          });

          it('should have closed off session', function () {
            expect(sessionStub.close).to.have.callCount(1);
          });
        });

        describe('successfully signed in', function () {
          beforeEach(function () {
            sessionStub.close = sinon.stub();
            /*eslint no-unused-vars: ["error", { "args": "none" }]*/
            sessionStub.open.returns(new Ember.RSVP.Promise(function(resolve, reject) {
              resolve({currentUser: {emailVerified: true, uid: 12345}});
            }));
            controller.transitionToRoute = sinon.stub();
            controller.actions.signIn.apply(controller, ['adam@ward.ca', 'abc123']);
          });

          it('should have transitioned to user account page', function () {
            expect(controller.transitionToRoute).to.be.calledWithExactly('user', 12345);
          });
        });

        describe('error occured while trying to open session', function () {
          beforeEach(function () {
            /*eslint no-unused-vars: ["error", { "args": "none" }]*/
            sessionStub.open.returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Error message!'});
            }));
            controller.actions.signIn.apply(controller);
          });

          it('should have set the right error message', function () {
            expect(controller.get('errorMessage')).to.eql('Error message!');
          });
        });
      });
    });

    describe('sendVerification()', function () {
      let sessionStub;
      beforeEach(function () {
        sessionStub = sinon.stub();
        controller.set('session', sessionStub);
        sessionStub.get = sinon.stub();
        sessionStub.get.withArgs('isAuthenticated').returns(false);
        sessionStub.open = sinon.stub();
        sessionStub.close = sinon.stub();
      });

      describe('Re-send verification email', function () {
        let sendVerificationEmailStub;
        beforeEach(function () {
          sendVerificationEmailStub = sinon.stub();
          /*eslint no-unused-vars: ["error", { "args": "none" }]*/
          sessionStub.open.returns(new Ember.RSVP.Promise(function(resolve, reject) {
            resolve({currentUser: {sendEmailVerification: sendVerificationEmailStub}});
          }));
          controller.actions.sendVerification.apply(controller);
        });

        it('should have called sendEmailVerification() method', function () {
          expect(sendVerificationEmailStub).to.have.callCount(1);
        });

        it('should have hidden \'Re-send Verification E-mail\' link', function () {
          expect(controller.get('emailNotVerified')).to.eql(false);
        });

        it('should have closed off session', function () {
          expect(sessionStub.close).to.have.callCount(1);
        });
      });

      describe('error occured while trying to open session', function () {
        beforeEach(function () {
          /*eslint no-unused-vars: ["error", { "args": "none" }]*/
          sessionStub.open.returns(new Ember.RSVP.Promise(function(resolve, reject) {
            reject({message: 'Error message!'});
          }));
          controller.actions.sendVerification.apply(controller);
        });

        it('should have set the right error message', function () {
          expect(controller.get('errorMessage')).to.eql('Error message!');
        });
      });
    });
  });
});
