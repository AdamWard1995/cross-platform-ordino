import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    const userID = this.modelFor('user').get('id');
    if (!userID) {
      this.transitionTo('index');
      return;
    }
    return this.store.query('term', {orderBy: 'uid', equalTo: userID}).then(terms => {
      const currentTerm = terms.toArray().filterBy('current', true);
      if (currentTerm.length == 1) {
        return this.store.query('course', {orderBy: 'tid', equalTo: currentTerm[0].get('id')}).then(courses => {
          return this.store.query('course-work', {orderBy: 'uid', equalTo: userID}).then(work => {
            const data = [];
            const workArr = work.toArray();
            courses.toArray().forEach((course) => {
              data.push({
                course,
                courseWork: workArr.filterBy('cid', course.get('id'))
              });
            });
            return data;
          });
        });
      }
      return {'no-current-term': true}
    });
  }
});
