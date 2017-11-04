/* global window */

import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  drawerOpen: true,
  title (tokens) {
    if (window.process && window.process.versions.electron) {
      return 'Ordino';
    } else {
      return (tokens.length > 0 ? `${tokens[tokens.length - 1]} - ` : '') + 'Ordino';
    }
  },
  beforeModel () {
    return this.get('session').fetch().catch(() => {});
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
