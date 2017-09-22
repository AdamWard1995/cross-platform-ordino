import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['multi-select'],
  items: [],
  selectedItems: [],
  actions: {
    toggleSelection (item) {
      if (this.get('selectedItems').includes(item)) {
        this.get('selectedItems').removeObject(item);
      } else {
        this.get('selectedItems').pushObject(item);
      }
    }
  }
});
