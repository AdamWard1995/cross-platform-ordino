import Ember from 'ember';
const {A} = Ember;
import {deleteCourse, deleteCourseWork, normalizeIndices} from 'cross-platform-ordino/utils/cleanup';
import moment from 'moment';

import ChangedItemMixin from 'cross-platform-ordino/mixins/changed-item';

import {getStatistics} from 'cross-platform-ordino/utils/course-statistics';

export default Ember.Controller.extend(ChangedItemMixin, {
  editCourse: false,
  deleteCourse: false,
  createCourseWork: false,
  editCourseWork: false,
  deleteCourseWork: false,
  currentAvg: Ember.computed('model.course', function () {
    return getStatistics(this.get('model').courseWork).currentAvg;
  }),
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
  categories: Ember.computed.alias('model.categories'),
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
    editCourse (courseCode, location, startTime, endTime, days, tid) {
      const course = this.get('model').course;
      if (course.get('tid') !== tid) {
        normalizeIndices(course, this.get('model').termCourses);
        course.set('index', this.get('model').allCourses.filterBy('tid', tid).length);
      }
      course.set('course-code', courseCode);
      course.set('tid', tid);
      course.save();

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
      const model = this.get('model');
      const course = model.course;
      deleteCourse(course, model.termCourses, this.store);
      this.send('hideDeleteModal');
      this.send('refreshModel');
      this.transitionToRoute('user.terms.term', course.get('tid'));
    },
    createCourseWork (label, weight, grade, due, cgyid, cid, completed) {
      const model = this.get('model');
      const index = model.course.get('id') === cid ? model.courseWork.length : model.allWork.filterBy('cid', cid).length;
      const work = this.store.createRecord('course-work', {
        'uid': this.get('session').get('currentUser').uid,
        'cid': cid,
        'index': index,
        'label': label,
        'weight': weight,
        'grade': grade,
        'due': due,
        'cgyid': cgyid,
        'completed': false || completed
      });
      this.addNew(work);
      work.save().then(() => {
        this.send('refreshModel');
      });

      this.send('hideCreateCourseWorkModal');
    },
    editCourseWork (label, weight, grade, due, cgyid, cid, completed) {
      const itemToEdit = this.get('itemToEdit');
      const model = this.get('model');
      if (itemToEdit.get('cid') !== cid) {
        const newIndex = model.allWork.filterBy('cid', cid).length
        itemToEdit.set('cid', cid);
        normalizeIndices(itemToEdit, this.get('model').courseWork);
        itemToEdit.set('index', newIndex);
      }
      itemToEdit.set('label', label);
      itemToEdit.set('weight', weight);
      itemToEdit.set('grade', grade);
      itemToEdit.set('due', due);
      itemToEdit.set('cgyid', cgyid);
      itemToEdit.set('completed', false || completed);

      if (Object.keys(itemToEdit.changedAttributes()).length > 0) {
        this.addChanged(itemToEdit);
      }

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
