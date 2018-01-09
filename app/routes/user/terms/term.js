import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    const model = this.modelFor('user');
    const terms = model.terms.filterBy('id', params.term);
    if (!terms || terms.length !== 1) {
      this.transitionTo('user.terms');
    } else {
      const term = terms[0];
      const termID = term.get('id');
      this.set('titleToken', `${term.get('semester')} ${term.get('year')}`);
      return {
        term,
        terms: model.terms,
        allCourses: model.courses,
        courses: model.courses.filterBy('tid', termID),
        courseWork: model.courseWork
      };
    }
  }
});
