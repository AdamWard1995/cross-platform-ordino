import Ember from 'ember';
import {expect} from 'chai';
import {stubService} from 'ember-test-utils/test-support/stub';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {controller} from 'ember-test-utils/test-support/setup-test';
import sinon from 'sinon';

const test = controller('sign-up')
describe(test.label, function () {
  test.setup();

  let controller, sandbox, store, authStub;
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    store = stubService(this, sandbox, 'store')
    authStub = sinon.stub();
    const service = Ember.Service.extend({auth: authStub});
    this.register('service:firebaseApp', service);
    controller = this.subject();
  });

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('no error message', function () {
        beforeEach(function () {
          controller.set('errorMessage', '');
        });

        it('should return is-hidden class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-hidden');
        });
      });

      describe('is an error message', function () {
        beforeEach(function () {
          controller.set('errorMessage', 'error message!');
        });

        it('should return is-visible class', function () {
          expect(controller.get('errorMessageClass')).to.eql('is-visible');
        });
      });
    });

    describe('passwordHasDigit', function () {
      describe('password does have a digit', function () {
        beforeEach(function () {
          controller.set('password', 'abc123');
        });

        it('should return true', function () {
          expect(controller.get('passwordHasDigit')).to.eql(true);
        });
      });

      describe('password does not have a digit', function () {
        beforeEach(function () {
          controller.set('password', 'abc');
        });

        it('should return false', function () {
          expect(controller.get('passwordHasDigit')).to.eql(false);
        });
      });
    });

    describe('passwordHas6Characters', function () {
      describe('password does have 6 characters', function () {
        beforeEach(function () {
          controller.set('password', 'abc123');
        });

        it('should return true', function () {
          expect(controller.get('passwordHas6Characters')).to.eql(true);
        });
      });

      describe('password does not have 6 characters', function () {
        beforeEach(function () {
          controller.set('password', 'abc');
        });

        it('should return false', function () {
          expect(controller.get('passwordHas6Characters')).to.eql(false);
        });
      });
    });

    describe('passwordHasLowercaseLetter', function () {
      describe('password does have lowercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'abc123');
        });

        it('should return true', function () {
          expect(controller.get('passwordHasLowercaseLetter')).to.eql(true);
        });
      });

      describe('password does not have lowercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'ABC123');
        });

        it('should return false', function () {
          expect(controller.get('passwordHasLowercaseLetter')).to.eql(false);
        });
      });
    });

    describe('passwordHasUppercaseLetter', function () {
      describe('password does have uppercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'ABC123');
        });

        it('should return true', function () {
          expect(controller.get('passwordHasUppercaseLetter')).to.eql(true);
        });
      });

      describe('password does not have uppercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'abc123');
        });

        it('should return false', function () {
          expect(controller.get('passwordHasUppercaseLetter')).to.eql(false);
        });
      });
    });

    describe('validPassword', function () {
      describe('password is valid', function () {
        beforeEach(function () {
          controller.set('password', 'Abc123');
        });

        it('should return true', function () {
          expect(controller.get('validPassword')).to.eql(true);
        });
      });

      describe('password does not have uppercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'abc123');
        });

        it('should return false', function () {
          expect(controller.get('validPassword')).to.eql(false);
        });
      });

      describe('password does not have lowercase letter', function () {
        beforeEach(function () {
          controller.set('password', 'ABC123');
        });

        it('should return false', function () {
          expect(controller.get('validPassword')).to.eql(false);
        });
      });

      describe('password does not have digits', function () {
        beforeEach(function () {
          controller.set('password', 'Abcdef');
        });

        it('should return false', function () {
          expect(controller.get('validPassword')).to.eql(false);
        });
      });

      describe('password does not have 6 characters', function () {
        beforeEach(function () {
          controller.set('password', 'Abc12');
        });

        it('should return false', function () {
          expect(controller.get('validPassword')).to.eql(false);
        });
      });
    });
  });

  describe('Actions', function () {
    describe('signUp()', function () {
      describe('a session is already open', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: true}));
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('An account session is already open. Please sign out before creating a new account.');
        })
      });

      describe('no first name entered', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: false}));
          controller.set('first-name', '');
          controller.set('last-name', 'Ward');
          controller.set('email', 'adam@ward.ca');
          controller.set('password', 'Passw0rd');
          controller.set('confirm-password', 'Passw0rd');
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('The \'First name\' field is empty.');
        })
      });

      describe('no last name entered', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: false}));
          controller.set('first-name', 'Adam');
          controller.set('last-name', '');
          controller.set('email', 'adam@ward.ca');
          controller.set('password', 'Passw0rd');
          controller.set('confirm-password', 'Passw0rd');
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('The \'Last name\' field is empty.');
        })
      });

      describe('no email entered', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: false}));
          controller.set('first-name', 'Adam');
          controller.set('last-name', 'Ward');
          controller.set('email', '');
          controller.set('password', 'Passw0rd');
          controller.set('confirm-password', 'Passw0rd');
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('The E-mail address format you entered is invalid.');
        })
      });

      describe('passwords don\'t match', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: false}));
          controller.set('first-name', 'Adam');
          controller.set('last-name', 'Ward');
          controller.set('email', 'adam@ward.ca');
          controller.set('password', 'Passw0rd');
          controller.set('confirm-password', 'Password');
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('The passwords you entered do not match.');
        })
      });

      describe('passwords format invalid ', function () {
        beforeEach(function () {
          controller.set('session', Ember.Object.create({isAuthenticated: false}));
          controller.set('first-name', 'Adam');
          controller.set('last-name', 'Ward');
          controller.set('email', 'adam@ward.ca');
          controller.set('password', 'Password');
          controller.set('confirm-password', 'Password');
          controller.actions.signUp.apply(controller);
        });

        it('should have set correct error message', function () {
          expect(controller.get('errorMessage')).to.eql('The password you entered does not contain at least one uppercase letter, one lowercase letter, and one number.');
        })
      });

      describe('try to create new account', function () {
        let createUserStub, closeStub;
        beforeEach(function () {
          createUserStub = sinon.stub();
          closeStub = sinon.stub();
          authStub.returns({createUserWithEmailAndPassword: createUserStub});
          controller.set('session', Ember.Object.create({isAuthenticated: false, close: closeStub}));
          controller.set('first-name', 'Adam');
          controller.set('last-name', 'Ward');
          controller.set('email', 'adam@ward.ca');
          controller.set('password', 'Passw0rd');
          controller.set('confirm-password', 'Passw0rd');
        });

        describe('error occurred', function () {
          beforeEach(function () {
            createUserStub.returns(new Ember.RSVP.Promise(function(resolve, reject) {
              reject({message: 'Error message!'});
            }));
            controller.actions.signUp.apply(controller);
          });

          it('should have called open with right parameters', function () {
            expect(createUserStub).to.have.been.calledWithExactly('adam@ward.ca', 'Passw0rd');
          });

          it('should have set the correct error message', function () {
            expect(controller.get('errorMessage')).to.eql('Error message!');
          });
        });

        describe('successfully created user', function () {
          let sendVerificationStub, saveStub;
          beforeEach(function () {
            sendVerificationStub = sinon.stub();
            saveStub = sinon.stub();
            createUserStub.returns(new Ember.RSVP.Promise(function(resolve) {
              resolve({
                sendEmailVerification: sendVerificationStub,
                email: 'adam@ward.ca',
                uid: 12345
              });
            }));
            store.createRecord.returns({save: saveStub})
            controller.actions.signUp.apply(controller);
          });

          it('should have called open with right parameters', function () {
            expect(createUserStub).to.have.been.calledWithExactly('adam@ward.ca', 'Passw0rd');
          });

          it('should have sent email verification', function () {
            expect(sendVerificationStub).to.have.callCount(1);
          });

          it('should have created new user record', function () {
            expect(store.createRecord).to.have.been.calledWithExactly('user', {
              'id': 12345,
              'email': 'adam@ward.ca',
              'first-name': 'Adam',
              'last-name': 'Ward'
            });
          });

          it('should have saved new user record', function () {
            expect(saveStub).to.have.callCount(1);
          });

          it('should have removed any error message', function () {
            expect(controller.get('errorMessage')).to.eql('');
          });

          it('should ensure success message is shown', function () {
            expect(controller.get('signedUp')).to.eql(true);
          });

          it('should close session', function () {
            expect(controller.get('session').get('close')).to.have.callCount(1);
          });
        });
      });
    });
  });
});
