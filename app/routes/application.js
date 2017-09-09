// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  drawerOpen: true,
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },
  afterModel () {
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('user', this.get('session').get('currentUser').uid);
    } else {
      this.transitionTo('index');
    }
  },
  setupController (controller, model) {
    this._super(controller, model);
    this.controller.set('forceShowContent', false);
  },
  actions: {
    signOut: function() {
      this.get('session').close();
      this.transitionTo('index');
    }
  }
});
