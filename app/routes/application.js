/* global window */

import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  drawerOpen: true,
  title: function(tokens) {
    if (!(window.process && window.process.versions.electron)) {
      return (tokens.length > 0 ? `${tokens[tokens.length - 1]} - ` : '') + 'Ordino';
    } else {
      return 'Ordino';
    }
  },
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
