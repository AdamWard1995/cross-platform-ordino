import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    semesterToFilter: 'sem',
    yearToFilter: 'year',
    courseCodeToFilter: 'cc'
  },
  semesterToFilter: '',
  yearToFilter: '',
  courseCodeToFilter: '',

  listItems: Ember.computed('model', function() {
    const terms = this.get('model').terms;
    const courses = this.get('model').courses;
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
