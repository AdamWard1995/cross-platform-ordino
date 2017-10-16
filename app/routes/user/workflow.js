import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'WorkFlow',
  model () {
    const model = this.modelFor('user');
    const currentTerm = model.terms.filterBy('current', true);
    if (currentTerm.length == 1) {
      const courses = model.courses.filterBy('tid', currentTerm[0].get('id'));
      const work = model.courseWork;
      const categories = model.categories;
      const workByCourse = [];
      courses.forEach((course) => {
        workByCourse.push({
          course,
          courseWork: work.filterBy('cid', course.get('id'))
        });
      });
      return {workByCourse, categories, allWork: model.courseWork, allCourses: model.courses};
    }
    return {'no-current-term': true}
  }
});
