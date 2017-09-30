import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    const userID = this.modelFor('user').get('id');
    if (!userID) {
      this.transitionTo('index');
      return;
    }
    return this.store.query('course', {orderBy: 'uid', equalTo: userID}).then(response => {
      return response.toArray();
    });
  }
});
