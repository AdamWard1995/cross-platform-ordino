import Ember from 'ember';

export default Ember.Controller.extend({
  listItems: Ember.computed('terms', 'courses', function() {
    const terms = this.get('terms');
    const courses = this.get('courses');
    if (terms && terms.map) {
      return terms.sortBy('index').map((term) => {
        return {
          group: term,
          items: courses.filterBy('tid', term.get('id')).sortBy('index')
        };
      });
    }
    return [];
  }),
  courseCodeValidator (term, course, courseCode) {
    return !courseCode || course.get('course-code').toLowerCase().startsWith(courseCode.toLowerCase());
  },
  semesterValidator (term, course, semester) {
    return !semester || term.get('semester') === semester;
  },
  yearValidator (term, course, year) {
    return !year || `${term.get('year')}`.startsWith(year);
  },
  actions: {
    goToCourseRoute (course) {
      this.transitionToRoute('user.courses.course', course.get('id'));
    }
  }
});
