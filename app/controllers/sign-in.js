import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-hidden';
  }),
  sendVerificationClass: Ember.computed('emailNotVerified', function() {
    return this.get('emailNotVerified') ?  'is-visible' : 'is-hidden';
  }),
  actions: {
    signIn () {
      this.set('signingIn', true);
      if (this.get('session').get('isAuthenticated')) {
        this.set('errorMessage', 'An account session is already open. Please sign out before signing in to a different account.');
        this.set('signingIn', false);
      } else {
        this.get('session').open('firebase', {
          provider: 'password',
          email: this.get('email'),
          password: this.get('password')
        }).then((data) => {
          if (!data.currentUser.emailVerified) {
            this.set('errorMessage', 'The E-mail address for this account has not been verified.');
            this.set('emailNotVerified', true);
            this.get('session').close();
            this.set('signingIn', false);
          } else {
            this.store.findRecord('user', data.currentUser.uid).then(user => {
              if (data.currentUser.email !== user.get('email')) {
                user.set('email', data.currentUser.email);
                user.save();
              }
              user.set('accountChanged', false);
              this.transitionToRoute('user', data.currentUser.uid);
            });
          }
        }, (error) => {
          this.set('errorMessage', error.message);
          this.set('signingIn', false);
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
