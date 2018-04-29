import Ember from 'ember';
const {get, set} = Ember;

import ChangedItemMixin from 'cross-platform-ordino/mixins/changed-item';

export default Ember.Component.extend(ChangedItemMixin, {
  classNames: ['ordered-list'],
  items: [],
  orderedItems: Ember.computed('items.@each.index', function() {
    const items = this.get('items');
    return items.sortBy('index');
  }),
  updateIndex: function (item, index) {
    set(item, 'index', index);
    if (item.save) {
      item.save();
    }
  },
  swapIndices (item1, item2) {
    const index1 = get(item1, 'index');
    const index2 = get(item2, 'index');
    this.get('updateIndex')(item1, index2);
    this.get('updateIndex')(item2, index1);
  },
  actions: {
    incrementIndex (item) {
      this.set('arranging', true);
      const items = this.get('orderedItems');
      const index = get(item, 'index');
      if (index === items.length - 1) {
        return;
      }
      this.addChanged(items[index]);
      this.addChanged(items[index + 1]);
      this.swapIndices(items[index], items[index + 1]);
    },
    decrementIndex (item) {
      this.set('arranging', true);
      const index = get(item, 'index');
      if (index === 0) {
        return;
      }
      const items = this.get('orderedItems');
      this.addChanged(items[index]);
      this.addChanged(items[index - 1]);
      this.swapIndices(items[index], items[index - 1]);
    },
    itemSelected (item) {
      if (this.get('arranging')) {
        this.set('arranging', false);
      } else if (this.get('deleting')) {
        this.set('deleting', false);
      } else if (this.get('duplicating')) {
        this.set('duplicating', false);
      } else if (this.get('onItemSelected')) {
        this.get('onItemSelected')(item);
      }
    },
    deleteItem (item) {
      this.set('deleting', true);

      if (this.get('onItemDeleted')) {
        this.get('onItemDeleted')(item);
      }
    },
    duplicateItem (item) {
      this.set('duplicating', true);

      if (this.get('onItemDuplicated')) {
        this.get('onItemDuplicated')(item);
      }
    },
    rightClickHandler (itemNum, event) {
      this.$().click();
      this.$(`#menu-button-${itemNum}`).click();
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }
});
