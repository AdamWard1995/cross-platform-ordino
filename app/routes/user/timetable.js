import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'TimeTable',
  model () {
    const model = this.modelFor('user');
    const currentTerm = model.terms.filterBy('current', true);
    if (currentTerm.length == 1) {
      const courses = model.courses.filterBy('tid', currentTerm[0].get('id'));
      const classes = model.classTimes;
      const data = [];
      courses.forEach((course) => {
        data.push({
          course,
          classTimes: classes.filterBy('cid', course.get('id'))
        });
      });
      return data;
    }
    return {'no-current-term': true}
  }
});
