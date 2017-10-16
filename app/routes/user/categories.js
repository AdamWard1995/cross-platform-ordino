import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Categories',
  model () {
    return {
      categories: this.modelFor('user').categories,
      courseWork: this.modelFor('user').courseWork
    };
  }
});
