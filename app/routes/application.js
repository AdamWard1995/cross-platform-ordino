// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  drawerOpen: true,
  beforeModel () {
    return this.get('session').fetch().catch(function() {});
  },
  model () {
    return {};
  },
  actions: {
    accessDenied () {
      this.transitionTo('index');
    },
    signOut: function() {
      this.get('session').close();
    },
    refreshModel: function() {
      this.refresh();
    }
  }
});
