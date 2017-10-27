import Ember from 'ember';

import Errorable from 'cross-platform-ordino/mixins/errorable';

export default Ember.Component.extend(Errorable, {
  open: false,
  didInsertElement() {
    this._super(...arguments);
    this.$('.modal-content').keypress((e) => {
      // On ENTER key pressed
      if(e.which == 13 && this.get('submit')) {
        this.get('submit')();
      }
    });
  },
  closeButton: {
    label: 'Cancel',
    type: 'danger'
  },
  submitButton: {
    label: 'Submit',
    type: 'primary'
  }
});
