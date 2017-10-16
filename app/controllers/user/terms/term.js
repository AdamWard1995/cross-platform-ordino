import Ember from 'ember';
import {deleteCourse, deleteTerm} from 'cross-platform-ordino/utils/cleanup';

export default Ember.Controller.extend({
  editTerm: false,
  deleteTerm: false,
  createCourse: false,
  deleteCourse: false,
  deleteConfirmationMessage: Ember.computed('model.semester', 'model.year', function() {
    return `Are you sure you want to delete ${this.get('model').term.get('semester')} ${this.get('model').term.get('year')}?`
  }),
  deleteCourseConfirmationMessage: Ember.computed('itemToDelete', function() {
    if (this.get('itemToDelete')) {
      return `Are you sure you want to delete ${this.get('itemToDelete').get('course-code')}?`
    }
  }),
  actions: {
    showEditModal () {
      this.set('editTerm', true);
    },
    hideEditModal () {
      this.set('editTerm', false);
    },
    showDeleteModal () {
      this.set('deleteTerm', true);
    },
    hideDeleteModal () {
      this.set('deleteTerm', false);
    },
    showCreateCourseModal () {
      this.set('createCourse', true);
    },
    hideCreateCourseModal () {
      this.set('createCourse', false);
    },
    showDeleteCourseModal (item) {
      this.set('itemToDelete', item);
      this.set('deleteCourse', true);
    },
    hideDeleteCourseModal () {
      this.set('deleteCourse', false);
      this.set('itemToDelete', null);
    },
    editTerm (semester, year, current) {
      if (current) {
        this.get('model').terms.forEach((term) => {
          if (term.get('current')) {
            term.set('current', false);
            term.save();
          }
        });
      }
      this.get('model').term.set('semester', semester);
      this.get('model').term.set('year', year);
      this.get('model').term.set('current', current);
      this.get('model').term.save();
      this.send('hideEditModal');
      this.send('refreshModel');
    },
    deleteTerm () {
      const term = this.get('model').term;
      deleteTerm(term, this.get('model').terms, this.store);
      this.send('hideDeleteModal');
      this.send('refreshModel');
      this.transitionToRoute('user.terms');
    },
    createCourse (courseCode, location, startTime, endTime, days, tid) {
      const model = this.get('model');
      const index = model.term.get('id') === tid ? model.courses.length : model.allCourses.filterBy('tid', tid).length;
      const course = this.store.createRecord('course', {
        'uid': this.get('session').get('currentUser').uid,
        'tid': tid,
        'index': index,
        'course-code': courseCode
      });
      course.save().then(() => {
        this.send('refreshModel');
      });

      days.forEach((day) => {
        this.store.createRecord('class-time', {
          'uid': this.get('session').get('currentUser').uid,
          'cid': course.get('id'),
          'location': location,
          'start-time': startTime,
          'end-time': endTime,
          'day': day
        }).save();
      });

      this.send('hideCreateCourseModal');
    },
    deleteCourse () {
      const course = this.get('itemToDelete');
      deleteCourse(course, this.get('model').courses, this.store);
      this.send('hideDeleteCourseModal');
      this.send('refreshModel');
    },
    goToTermsRoute () {
      this.transitionToRoute('user.terms');
    },
    goToCourseRoute (course) {
      this.transitionToRoute('user.courses.course', course.get('id'));
    }
  }
});
