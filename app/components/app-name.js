import Ember from 'ember';

export default Ember.Component.extend({
  filteredItems: Ember.computed('backgroundTransparent', '', function() {
    if (this.get('backgroundTransparent')) {
      return 'background-transparent';
    }
  })
});
