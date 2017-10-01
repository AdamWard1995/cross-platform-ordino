import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    const courses = this.modelFor('user.courses').filterBy('id', params.course);
    if (!this.get('session').get('isAuthenticated')) {
      this.transitionTo('index');
    } else if (!courses || courses.length !== 1) {
      this.transitionTo('user.courses');
    } else {
      const course = courses[0];
      const courseID = course.get('id');
      return this.store.query('course-work', {orderBy: 'cid', equalTo: courseID}).then(work => {
        return this.store.query('class-time', {orderBy: 'cid', equalTo: courseID}).then(classes => {
          return {
            course,
            courseWork: work.toArray(),
            classTimes: classes.toArray()
          };
        });
      });
    }
  },
  setupController (controller, model) {
    controller.set('courses', this.modelFor('user.courses'));
    this._super(controller, model);
  }
});
