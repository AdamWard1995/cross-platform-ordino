import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    if (!this.get('session').get('isAuthenticated') ||
        this.get('session').get('currentUser').uid !== params.user) {
      this.transitionTo('index');
    }
    return this.store.findRecord('user', params.user).then(response => {
      return response;
    });
  }
});
