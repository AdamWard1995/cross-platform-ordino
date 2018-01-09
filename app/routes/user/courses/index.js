import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    const model = this.modelFor('user.courses');
    return {
      courses: model.courses,
      courseWork: model.courseWork,
      terms: model.terms
    };
  }
});
