import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ordered-list'],
  items: [],
  orderedItems: Ember.computed('items.@each.index', function() {
    const items = this.get('items');
    return items.sortBy('index');
  }),
  swapIndices (item1, item2) {
    const index1 = item1.get('index');
    const index2 = item2.get('index');
    item1.set('index', index2);
    item2.set('index', index1);
    item1.save();
    item2.save();
  },
  actions: {
    incrementIndex (item) {
      this.set('arranging', true);
      const items = this.get('orderedItems');
      const index = item.get('index');
      if (index === items.length - 1) {
        return;
      }
      this.set('changed', item);
      this.swapIndices(items[index], items[index + 1]);
    },
    decrementIndex (item) {
      this.set('arranging', true);
      const index = item.get('index');
      if (index === 0) {
        return;
      }
      const items = this.get('orderedItems');
      this.set('changed', item);
      this.swapIndices(items[index], items[index - 1]);
    },
    itemSelected (item) {
      if (this.get('arranging')) {
        this.set('arranging', false);
      } else if (this.get('deleting')) {
        this.set('deleting', false);
      } else if (this.get('onItemSelected')) {
        this.get('onItemSelected')(item);
      }
    },
    deleteItem (item) {
      this.set('deleting', true);

      if (this.get('onItemDeleted')) {
        this.get('onItemDeleted')(item);
      }
    }
  }
});
