import Ember from 'ember';
const {A} = Ember;

import Filter from './filter';

export default Filter.extend({
  classNames: ['category-filter'],
  filterCategories: Ember.computed('categories.[]', function() {
    const categories = A(this.get('categories').slice());
    categories.insertAt(0, Ember.Object.create({label: '-- Category --', id: ''}));
    return categories
  })
});
