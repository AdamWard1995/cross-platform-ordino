import Ember from 'ember';

export default Ember.Route.extend({
  model (params, transition) {
    if (!this.get('session').get('isAuthenticated') ||
        this.get('session').get('currentUser').uid !== params.user) {
      this.accessDenied(transition);
      return;
    }
    return this.store.findRecord('user', params.user).then(response => {
      return response;
    });
  }
});
