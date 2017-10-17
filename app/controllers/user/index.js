import Ember from 'ember';
import moment from 'moment';

import Day from 'cross-platform-ordino/enums/day';

export default Ember.Controller.extend({
  dueNextWeek: Ember.computed('model.courseWork', function() {
    const model = this.get('model');
    if (model && model.courseWork) {
      const nextWeek = moment().add(7, 'days');
      const dueThisWeek = model.courseWork.filter((work) => {
        return moment(work.get('due')).isBefore(nextWeek) && moment(work.get('due')).isAfter(moment());
      });
      const data = [];
      dueThisWeek.forEach((work) => {
        const course = model.courses.filterBy('id', work.get('cid'));
        if (course.length === 1) {
          data.push({course: course[0], work});
        }
      });
      return data;
    }
  }),
  numTerms: Ember.computed('model.terms', function() {
    const model = this.get('model');
    if (model && model.terms) {
      return model.terms.length;
    }
    return 0;
  }),
  createFirstTerm: Ember.computed('numTerms', function() {
    return this.get('numTerms') === 0;
  }),
  numCourses: Ember.computed('model.courses', function() {
    const model = this.get('model');
    if (model && model.courses) {
      return model.courses.length;
    }
    return 0;
  }),
  numCategories: Ember.computed('model.categories', function() {
    const model = this.get('model');
    if (model && model.categories) {
      return model.categories.length;
    }
    return 0;
  }),
  currentTerm: Ember.computed('model.terms', function() {
    const model = this.get('model');
    if (model && model.terms) {
      const currentTerm = model.terms.filterBy('current', true);
      if (currentTerm.length === 1) {
        return currentTerm[0];
      }
    }
  }),
  nextClass: Ember.computed('model.classTimes', 'model.terms', function() {
    const model = this.get('model');
    if (model && model.terms && model.classTimes) {
      const currentTerm = model.terms.filterBy('current', true);
      if (currentTerm.length === 1) {
        const courses = model.courses.filterBy('tid', currentTerm[0].get('id'));
        const classes = model.classTimes;
        const data = {};
        courses.forEach((course) => {
          const classTimes = classes.filterBy('cid', course.get('id'));
          classTimes.forEach((classTime) => {
            const day = classTime.get('day');
            if (!data[day]) {
              data[day] = [];
            }
            data[day].push({
              course,
              classTime
            });
          });
        });
        const days = Object.values(Day);
        let dayOfWeek = moment().weekday();
        for (let i = 0; i < 8; ++i) {
          let dayData = data[days[dayOfWeek++ % 6]];
          if (i == 0) {
            dayData = dayData.filter((day) => {
              return moment(day.classTime.get('start-time'), 'hh:mm a').isAfter(moment());
            });
          }
          if (dayData && dayData.length > 0) {
            return dayData.sort((a, b) => {
              return moment(a.classTime.get('start-time'), 'hh:mm a') - moment(b.classTime.get('start-time'), 'hh:mm a');
            })[0];
          }
        }
      }
    }
  }),
  actions: {
    goToWorkFlow () {
      this.transitionToRoute('user.workflow');
    },
    goToTerms () {
      this.transitionToRoute('user.terms');
    },
    goToCourses () {
      this.transitionToRoute('user.courses');
    },
    goToCategories () {
      this.transitionToRoute('user.categories');
    },
    goToCurrentTerm (term) {
      this.transitionToRoute('user.terms.term', term.get('id'));
    },
    goToTimeTable () {
      this.transitionToRoute('user.timetable');
    },
    goToUserAccount () {
      this.transitionToRoute('user.account');
    }
  }
});
