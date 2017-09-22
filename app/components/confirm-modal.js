import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['confirm-modal'],
  open: false,
  title: 'Confirm',
  actions: {
    close () {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    },
    confirm () {
      if (this.get('onConfirm')) {
        this.get('onConfirm')();
      }
    }
  }
});
