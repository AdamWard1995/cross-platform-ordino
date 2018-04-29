import Ember from 'ember';

import moment from 'moment';

export default Ember.Route.extend({
  titleToken: 'TimeTable',
  model () {
    const model = this.modelFor('user');
    const currentTerm = model.terms.filterBy('current', true);
    if (currentTerm.length == 1) {
      const startOfWeek = moment().startOf('day');
      const endOfWeek = moment().endOf('day');
      startOfWeek.day(0);
      endOfWeek.day(6);

      const courses = model.courses.filterBy('tid', currentTerm[0].get('id'));
      const classes = model.classTimes;
      const work = model.courseWork.filter(w => moment(w.get('due')).isAfter(startOfWeek) && moment(w.get('due')).isBefore(endOfWeek));

      const data = [];
      courses.forEach((course) => {
        data.push({
          course,
          classTimes: classes.filterBy('cid', course.get('id')),
          courseWork: work.filterBy('cid', course.get('id'))
        });
      });
      data.terms = model.terms;
      data.allCourses = model.courses;
      data.classTimes = model.classTimes;
      return data;
    }
    return {'no-current-term': true}
  }
});
