import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    const model = this.modelFor('user');
    const courses = model.courses.filterBy('id', params.course);
    if (!courses || courses.length !== 1) {
      this.transitionTo('user.courses');
    } else {
      const course = courses[0];
      const courseID = course.get('id');
      this.set('titleToken', course.get('course-code'));
      return {
        course,
        courseWork: model.courseWork.filterBy('cid', courseID),
        allWork: model.courseWork,
        classTimes: model.classTimes.filterBy('cid', courseID),
        categories: model.categories,
        termCourses: model.courses.filterBy('tid', course.get('tid')),
        allCourses: model.courses,
        terms: model.terms
      };
    }
  }
});
