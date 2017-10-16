import Ember from 'ember';

export default Ember.Component.extend({
  title: 'About',
  actions: {
    close () {
      const onClose = this.get('onClose');
      if (onClose) {
        onClose();
      }
    }
  }
});
