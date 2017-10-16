import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Welcome',
  model () {
    const model = this.modelFor('user');
    return {
      courseWork: model.courseWork,
      classTimes: model.classTimes,
      terms: model.terms,
      courses: model.courses,
      categories: model.categories,
      user: model.user
    }
  }
});
