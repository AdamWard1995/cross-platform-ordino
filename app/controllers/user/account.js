import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    showChangeEmailModal () {
      this.set('changeEmail', true);
    },
    hideChangeEmailModal () {
      this.set('changeEmail', false);
      this.set('errorMessage', '');
    },
    showChangePasswordModal () {
      this.set('changePassword', true);
    },
    hideChangePasswordModal () {
      this.set('changePassword', false);
      this.set('errorMessage', '');
    },
    submitChangeEmail (newEmail, password) {
      const user = this.get('session').get('currentUser');
      if (user.email === newEmail) {
        this.set('errorMessage', 'The new E-mail entered is the same as you current account E-mail.');
        return;
      }
      const credentials = this.get('firebaseApp').firebase_.auth.EmailAuthProvider.credential(user.email, password);
      user.reauthenticateWithCredential(credentials).then(() => {
        user.updateEmail(newEmail).then(() => {
          const userModel = this.get('model');
          userModel.set('email', newEmail);
          userModel.set('accountChanged', true);
          userModel.save();
          user.reload();
          user.sendEmailVerification();
          this.set('changeEmail', false);
          this.set('errorMessage', '');
          this.send('hideChangeEmailModal');
          this.get('session').close();
        }, (error) => {
          this.set('errorMessage', error.message);
        });
      }, (error) => {
        this.set('errorMessage', error.message);
      });
    },
    submitChangePassword (currentPassword, newPassword) {
      const user = this.get('session').get('currentUser');
      if (currentPassword === newPassword) {
        this.set('errorMessage', 'The new password entered is the same as you current account password.');
        return;
      }
      const credentials = this.get('firebaseApp').firebase_.auth.EmailAuthProvider.credential(user.email, currentPassword);
      user.reauthenticateWithCredential(credentials).then(() => {
        user.updatePassword(newPassword).then(() => {
          const userModel = this.get('model');
          userModel.set('accountChanged', true);
          userModel.save();
          this.set('changePassword', false);
          this.set('errorMessage', '');
          this.send('hideChangePasswordModal');
          this.get('session').close();
        }, (error) => {
          this.set('errorMessage', error.message);
        });
      }, (error) => {
        this.set('errorMessage', error.message);
      });
    }
  }
});
