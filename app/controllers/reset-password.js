import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  errorMessage: '',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-hidden';
  }),
  emailSent: false,
  actions: {
    sendPasswordReset () {
      const email = this.get('email');
      this.get('firebaseApp').auth().sendPasswordResetEmail(email).then(() => {
        if (this.get('session').get('isAuthenticated')) {
          this.get('session').close();
        }
        this.set('emailSent', true);
        this.set('email', null);
      }, (error) => {
        this.set('errorMessage', error.message);
      });
    }
  }
});
