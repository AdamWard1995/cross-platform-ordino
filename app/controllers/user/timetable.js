import Ember from 'ember';

export default Ember.Controller.extend({
  haveCurrentTerm: Ember.computed('model.no-current-term', function() {
    return !this.get('model')['no-current-term'];
  }),
  timeslots: Ember.computed('model', function() {
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
          location: classTime.get('location')
        });
      });
    });
    return timeslots;
  }),
  actions: {
    timeSlotSelected (course) {
      this.transitionToRoute('user.courses.course', course.get('id'))
    }
  }
});
