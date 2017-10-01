import Ember from 'ember';
const {A} = Ember;
import {deleteCourse, deleteCourseWork} from 'cross-platform-ordino/utils/cleanup';
import moment from 'moment';

export default Ember.Controller.extend({
  editCourse: false,
  deleteCourse: false,
  createCourseWork: false,
  editCourseWork: false,
  deleteCourseWork: false,
  deleteConfirmationMessage: Ember.computed('model.course.course-code', function() {
    return `Are you sure you want to delete ${this.get('model').course.get('course-code')}?`
  }),
  deleteCourseWorkConfirmationMessage: Ember.computed('itemToDelete', function() {
    if (this.get('itemToDelete')) {
      return `Are you sure you want to delete ${this.get('itemToDelete').get('label')}?`
    }
  }),
  classDays: Ember.computed('model.classTimes.[]', function() {
    return this.get('model').classTimes.map((classTime) => {
      return classTime.get('day');
    });
  }),
  createClassTimes: Ember.computed('classDays', function() {
    return this.get('classDays').length > 0;
  }),
  location: Ember.computed('model.classTimes.[]', 'createClassTimes', function() {
    if (this.get('createClassTimes')) {
      return this.get('model').classTimes[0].get('location');
    }
  }),
  startTime: Ember.computed('model.classTimes.[]', 'createClassTimes', function() {
    if (this.get('createClassTimes')) {
      return moment(this.get('model').classTimes[0].get('start-time'), 'h:mm a');
    }
  }),
  endTime: Ember.computed('model.classTimes.[]', 'createClassTimes', function() {
    if (this.get('createClassTimes')) {
      return moment(this.get('model').classTimes[0].get('end-time'), 'h:mm a');
    }
  }),
  actions: {
    showEditModal () {
      this.set('editCourse', true);
    },
    hideEditModal () {
      this.set('editCourse', false);
    },
    showDeleteModal () {
      this.set('deleteCourse', true);
    },
    hideDeleteModal () {
      this.set('deleteCourse', false);
    },
    showCreateCourseWorkModal () {
      this.set('createCourseWork', true);
    },
    hideCreateCourseWorkModal () {
      this.set('createCourseWork', false);
    },
    showEditCourseWorkModal (item) {
      this.set('itemToEdit', item);
      this.set('editCourseWork', true);
    },
    hideEditCourseWorkModal () {
      this.set('editCourseWork', false);
      this.set('itemToEdit', null);
    },
    showDeleteCourseWorkModal (item) {
      this.set('itemToDelete', item);
      this.set('deleteCourseWork', true);
    },
    hideDeleteCourseWorkModal () {
      this.set('deleteCourseWork', false);
      this.set('itemToDelete', null);
    },
    editCourse (courseCode, location, startTime, endTime, days) {
      this.get('model').course.set('course-code', courseCode);
      this.get('model').course.save();

      const initialClasses = this.get('model').classTimes;
      const daysSelected = A(days.slice());
      initialClasses.forEach((classTime) => {
        if (!days.includes(classTime.get('day'))) {
          classTime.destroyRecord().then(() => {
            this.send('refreshModel');
          });
        } else if (days.includes(classTime.get('day'))) {
          classTime.set('location', location);
          classTime.set('start-time', startTime);
          classTime.set('end-time', endTime);
          classTime.save().then(() => {
            this.send('refreshModel');
          });
          daysSelected.removeObject(classTime.get('day'));
        }
      });

      daysSelected.forEach((day) => {
        this.store.createRecord('class-time', {
          'uid': this.get('session').get('currentUser').uid,
          'cid': this.get('model').course.get('id'),
          'location': location,
          'start-time': startTime,
          'end-time': endTime,
          'day': day
        }).save().then(() => {
          this.send('refreshModel');
        });
      });

      this.send('hideEditModal');
    },
    deleteCourse () {
      const course = this.get('model').course;
      deleteCourse(course, this.get('courses'), this.store);
      this.send('hideDeleteModal');
      this.send('refreshModel');
      this.transitionToRoute('user.terms.term', course.get('tid'));
    },
    createCourseWork (label, weight, grade, due) {
      this.store.createRecord('course-work', {
        'uid': this.get('session').get('currentUser').uid,
        'cid': this.get('model').course.get('id'),
        'index': this.get('model').courseWork.length,
        'label': label,
        'weight': weight,
        'grade': grade,
        'due': due
      }).save().then(() => {
        this.send('refreshModel');
      });

      this.send('hideCreateCourseWorkModal');
    },
    editCourseWork (label, weight, grade, due) {
      const itemToEdit = this.get('itemToEdit');
      itemToEdit.set('label', label);
      itemToEdit.set('weight', weight);
      itemToEdit.set('grade', grade);
      itemToEdit.set('due', due);
      itemToEdit.save().then(() => {
        this.send('refreshModel');
      });
      this.send('hideEditCourseWorkModal');
    },
    deleteCourseWork () {
      const toDelete = this.get('itemToDelete');
      deleteCourseWork(toDelete, this.get('model').courseWork, this.store);
      this.send('refreshModel');
      this.send('hideDeleteCourseWorkModal');
    },
    goToTermRoute () {
      this.transitionToRoute('user.terms.term', this.get('model').course.get('tid'));
    },
    goToCourseReport () {
      this.transitionToRoute('user.courses.course.report', this.get('model').course.get('id'));
    }
  }
});
