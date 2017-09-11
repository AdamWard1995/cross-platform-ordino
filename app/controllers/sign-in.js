import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  errorMessage: '',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-hidden';
  }),
  emailNotVerified: false,
  sendVerificationClass: Ember.computed('emailNotVerified', function() {
    return this.get('emailNotVerified') ?  'is-visible' : 'is-hidden';
  }),
  sendingVerification: false,
  actions: {
    signIn (email, password) {
      if (this.get('session').get('isAuthenticated')) {
        this.set('errorMessage', 'An account session is already open. Please sign out before signing in to a different account.');
      } else {
        this.get('session').open('firebase', {
          provider: 'password',
          email,
          password
        }).then((data) => {
          if (!data.currentUser.emailVerified) {
            this.set('errorMessage', 'The E-mail address for this account has not been verified.');
            this.set('emailNotVerified', true);
            this.get('session').close();
          } else {
            this.transitionToRoute('user', data.currentUser.uid);
          }
        }, (error) => {
          this.set('errorMessage', error.message);
        });
      }
    },
    sendVerification (email, password) {
      this.set('sendingVerification', true);
      this.get('session').open('firebase', {
        provider: 'password',
        email,
        password
      }).then((data) => {
        data.currentUser.sendEmailVerification();
        this.set('emailNotVerified', false);
        this.get('session').close();
        this.set('sendingVerification', false);
      }, (error) => {
        this.set('errorMessage', error.message);
        this.set('sendingVerification', false);
      });
    }
  }
});
