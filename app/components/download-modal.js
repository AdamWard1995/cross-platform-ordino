import Ember from 'ember';

export default Ember.Component.extend({
  computedClass: Ember.computed('isMobile', function() {
    if (this.get('isMobile')) {
      return 'is-mobile';
    }
    return 'is-desktop';
  }),
  actions: {
    close () {
      if (!this.get('isMobile') && this.get('onClose')) {
        this.get('onClose')();
      }
    }
  }
});
