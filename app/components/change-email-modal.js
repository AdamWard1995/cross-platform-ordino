import FormModal from 'cross-platform-ordino/components/form-modal';
import AccountValidatorMixin from 'cross-platform-ordino/mixins/account-validator';

export default FormModal.extend(AccountValidatorMixin, {
  title: 'Change account E-mail',
  class: 'change-email-modal',
  actions: {
    close () {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    },
    submit () {
      if (this.get('onSubmit')) {
        if (!this.get('validEmail')) {
          this.set('errorMessage', 'The E-mail address format you entered is invalid.');
        } else if (!(this.get('password') && this.get('password').trim())) {
          this.set('errorMessage', 'Please confirm your account password.');
        } else {
          this.get('onSubmit')(this.get('email'), this.get('password'));
        }
      }
    }
  }
});
