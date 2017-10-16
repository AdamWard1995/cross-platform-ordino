import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    const model = this.modelFor('user.courses');
    return {
      courses: model.courses,
      terms: model.terms
    };
  }
});
