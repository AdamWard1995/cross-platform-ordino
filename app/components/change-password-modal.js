import Ember from 'ember';
import AccountValidatorMixin from 'cross-platform-ordino/mixins/account-validator';

export default Ember.Component.extend(AccountValidatorMixin, {
  open: false,
  title: 'Change account password',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-gone';
  }),
  actions: {
    close () {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    },
    submit () {
      if (this.get('onSubmit')) {
        if (!(this.get('current-password') && this.get('current-password').trim())) {
          this.set('errorMessage', 'Please confirm your account password.');
        } else if (this.get('password') !== this.get('confirm-password')) {
          this.set('errorMessage', 'The new passwords you entered do not match.');
        } else if (!this.get('validPassword')) {
          this.set('errorMessage', 'The password you entered does not contain at least one uppercase letter, one lowercase letter, and one number.');
        } else {
          this.get('onSubmit')(this.get('current-password'), this.get('password'));
        }
      }
    }
  }
});
