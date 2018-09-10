import Ember from 'ember';
import moment from 'moment';

import {normalizeIndices} from 'cross-platform-ordino/utils/cleanup';

const {A} = Ember;

export default Ember.Controller.extend({
  showCourseWork: true,
  timelineString: `${moment().startOf('week').format('MMMM Do YYYY')} - ${moment().endOf('week').format('MMMM Do YYYY')}`,
  haveCurrentTerm: Ember.computed('model.no-current-term', function() {
    return !this.get('model')['no-current-term'];
  }),
  timeslots: Ember.computed('model', 'showCourseWork', function() {
    const model = this.get('model');
    const timeslots = [];
    model.forEach(course => {
      course.classTimes.forEach(classTime => {
        timeslots.push({
          item: course.course,
          day: classTime.get('day'),
          start: classTime.get('start-time'),
          end: classTime.get('end-time'),
          label: course.course.get('course-code'),
          location: classTime.get('location'),
          class: 'class-time',
          contextClick: true
        });
      });
      if (this.get('showCourseWork')) {
        course.courseWork.forEach(work => {
          timeslots.push({
            item: course.course,
            day: moment(work.get('due')).format('dddd'),
            start: moment(work.get('due')).format('hh:mm a'),
            end: moment(work.get('due')).add(20, 'minutes').format('hh:mm a'),
            label: work.get('label'),
            location: '',
            class: 'work',
            contextClick: false
          });
        });
      }
    });
    return timeslots;
  }),
  classDays: Ember.computed('itemToEdit', 'model.[].classTimes', function() {
    const itemToEdit = this.get('itemToEdit');
    if (itemToEdit) {
      return this.get('model').filter(item => item.course.get('id') == itemToEdit.get('id'))[0].classTimes.map((classTime) => {
        return classTime.get('day');
      });
    }
  }),
  createClassTimes: Ember.computed('classDays', function() {
    return this.get('classDays').length > 0;
  }),
  location: Ember.computed('itemToEdit', 'model.[].classTimes', 'createClassTimes', function() {
    const itemToEdit = this.get('itemToEdit');
    if (itemToEdit && this.get('createClassTimes')) {
      return this.get('model').filter(item => item.course.get('id') == itemToEdit.get('id'))[0].classTimes[0].get('location');
    }
  }),
  startTime: Ember.computed('itemToEdit', 'model.[].classTimes', 'createClassTimes', function() {
    const itemToEdit = this.get('itemToEdit');
    if (itemToEdit && this.get('createClassTimes')) {
      return moment(this.get('model').filter(item => item.course.get('id') == itemToEdit.get('id'))[0].classTimes[0].get('start-time'), 'h:mm a');
    }
  }),
  endTime: Ember.computed('itemToEdit', 'model.classTimes.[]', 'createClassTimes', function() {
    const itemToEdit = this.get('itemToEdit');
    if (itemToEdit && this.get('createClassTimes')) {
      return moment(this.get('model').filter(item => item.course.get('id') == itemToEdit.get('id'))[0].classTimes[0].get('end-time'), 'h:mm a');
    }
  }),
  actions: {
    timeSlotSelected (course) {
      this.transitionToRoute('user.courses.course', course.get('id'))
    },
    timeSlotRightClicked (course) {
      this.set('itemToEdit', course);
      this.set('editCourse', true);
    },
    hideEditModal () {
      this.set('editCourse', false);
    },
    editCourse (courseCode, location, startTime, endTime, days, tid) {
      const course = this.get('itemToEdit');
      if (course.get('tid') !== tid) {
        normalizeIndices(course, this.get('model').map(item => item.course));
        course.set('index', this.get('model').allCourses.filterBy('tid', tid).length);
      }
      course.set('course-code', courseCode);
      course.set('tid', tid);
      course.save();

      const initialClasses = this.get('model').classTimes.filterBy('cid', course.get('id'));
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
          'cid': course.get('id'),
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
  }
});
