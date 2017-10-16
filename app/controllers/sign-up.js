// app/controllers/sign-up.js

import Ember from 'ember';
import AccountValidatorMixin from 'cross-platform-ordino/mixins/account-validator';

export default Ember.Controller.extend(AccountValidatorMixin, {
  firebaseApp: Ember.inject.service(),
  errorMessage: '',
  signedUp: false,
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-hidden';
  }),
  actions: {
    signUp () {
      if (this.get('session').get('isAuthenticated')) {
        this.set('errorMessage', 'An account session is already open. Please sign out before creating a new account.');
      } else if (!(this.get('first-name') && this.get('first-name').trim())) {
        this.set('errorMessage', 'The \'First name\' field is empty.');
      } else if (!(this.get('last-name') && this.get('last-name').trim())) {
        this.set('errorMessage', 'The \'Last name\' field is empty.');
      } else if (!this.get('validEmail')) {
        this.set('errorMessage', 'The E-mail address format you entered is invalid.');
      } else if (this.get('password') !== this.get('confirm-password')) {
        this.set('errorMessage', 'The passwords you entered do not match.');
      } else if (!this.get('validPassword')) {
        this.set('errorMessage', 'The password you entered does not contain at least one uppercase letter, one lowercase letter, and one number.');
      } else {
        this.get('firebaseApp').auth().createUserWithEmailAndPassword(this.get('email'), this.get('password')).then((userResponse) => {
          userResponse.sendEmailVerification();
          this.store.createRecord('user', {
            'id': userResponse.uid,
            'email': userResponse.email,
            'first-name': this.get('first-name'),
            'last-name': this.get('last-name')
          }).save();
          this.set('errorMessage', '');
          this.set('signedUp', true);
        }).catch((error) => {
          this.set('errorMessage', error.message);
        });
      }
    }
  }
});
