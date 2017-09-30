import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.modelFor('user.courses');
  },
  setupController (controller, model) {
    const userID = this.modelFor('user').get('id');
    this.store.query('term', {orderBy: 'uid', equalTo: userID}).then(response => {
      controller.set('terms', response.toArray());
    });
    controller.set('courses', model);
    this._super(controller, model);
  }
});
