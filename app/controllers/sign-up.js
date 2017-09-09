// app/controllers/sign-up.js

import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  errorMessage: '',
  signedUp: false,
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-hidden';
  }),
  passwordHasDigit: Ember.computed('password', function() {
    return this.get('password') && /\d/.test(this.get('password'));
  }),
  passwordHas6Characters: Ember.computed('password', function() {
    return this.get('password') && this.get('password').length >= 6;
  }),
  passwordHasLowercaseLetter: Ember.computed('password', function() {
    return this.get('password') && /[a-z]/.test(this.get('password'));
  }),
  passwordHasUppercaseLetter: Ember.computed('password', function() {
    return this.get('password') && /[A-Z]/.test(this.get('password'));
  }),
  validEmail: Ember.computed('email', function() {
    const email = this.get('email')
    const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    return email && regex.test(email);
  }),
  validPassword () {
    return this.get('passwordHas6Characters') && this.get('passwordHasDigit') && this.get('passwordHasLowercaseLetter') && this.get('passwordHasUppercaseLetter');
  },
  actions: {
    signUp () {
      if (!(this.get('first-name') && this.get('first-name').trim())) {
        this.set('errorMessage', 'The \'First name\' field is empty.');
      } else if (!(this.get('last-name') && this.get('last-name').trim())) {
        this.set('errorMessage', 'The \'Last name\' field is empty.');
      } else if (!this.get('validEmail')) {
        this.set('errorMessage', 'The email address format you entered is invalid.');
      } else if (this.get('password') !== this.get('confirm-password')) {
        this.set('errorMessage', 'The passwords you entered do not match.');
      } else if (!this.validPassword()) {
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
