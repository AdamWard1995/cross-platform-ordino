import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['filtered-list'],
  groups: [],
  filters: [],
  filteredItems: Ember.computed('groups', 'filters.@each.value', function() {
    const groups = this.get('groups');
    const filters = this.get('filters');
    const filteredItems = [];
    groups.forEach((grouping) => {
      const items = grouping.items.filter((item) => {
        return filters.reduce((accumulator, filter) => {
          return accumulator && filter.passes(grouping.group, item, filter.value);
        }, true);
      });
      if (items.length > 0) {
        filteredItems.push({group: grouping.group, items});
      }
    });
    return filteredItems;
  }),
  filterViews: Ember.computed('filters.@each.view', function() {
    return this.get('filters').map((filter) => {
      return filter.view;
    });
  }),
  actions: {
    itemSelected (item) {
      this.get('onItemSelected')(item);
    },
    clear () {
      const onClear = this.get('onClear');
      if (onClear) {
        onClear();
      }
    }
  }
});
