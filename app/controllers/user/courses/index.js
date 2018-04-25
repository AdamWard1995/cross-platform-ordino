import Ember from 'ember';

import {getStatistics} from 'cross-platform-ordino/utils/course-statistics';

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
    const courseWork = this.get('model').courseWork;
    if (terms && terms.map) {
      return terms.sortBy('index').map((term) => {
        return {
          group: term,
          items: courses.filterBy('tid', term.get('id')).sortBy('index').map((course) => {
            return {
              course,
              average: courseWork ? getStatistics(courseWork.filter(work => work.get('cid') === course.get('id'))).currentAvg : null
            };
          })
        };
      });
    }
    return [];
  }),
  courseCodeValidator (term, course, courseCode) {
    return !courseCode || course.course.get('course-code').toLowerCase().startsWith(courseCode.toLowerCase());
  },
  semesterValidator (term, course, semester) {
    return !semester || term.get('semester') === semester;
  },
  yearValidator (term, course, year) {
    return !year || `${term.get('year')}`.startsWith(year);
  },
  actions: {
    goToCourseRoute (item) {
      this.transitionToRoute('user.courses.course', item.course.get('id'));
    },
    clearFilters () {
      this.set('semesterToFilter', '');
      this.set('yearToFilter', '');
      this.set('courseCodeToFilter', '');
    }
  }
});
