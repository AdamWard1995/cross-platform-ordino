import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Courses',
  model () {
    return {
      courses: this.modelFor('user').courses,
      terms: this.modelFor('user').terms
    };
  }
});
