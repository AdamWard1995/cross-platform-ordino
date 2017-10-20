import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    close () {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    }
  }
});
