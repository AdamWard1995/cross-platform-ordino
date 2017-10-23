import Ember from 'ember';
const {A} = Ember;

import Filter from './filter';

export default Filter.extend({
  classNames: ['course-filter'],
  filterCourses: Ember.computed('courses.[]', function() {
    const courses = A(this.get('courses').slice());
    courses.insertAt(0, Ember.Object.create({'course-code': '-- Course --', id: ''}));
    return courses;
  })
});
