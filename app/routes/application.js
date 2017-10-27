/* global window */

import Ember from 'ember';
import isOnline from 'npm:is-online';

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
    isOnline().then((online) => {
      if (!online) {
        alert('Error! Ordino requires an Internet connection to function correctly.');
      }
    });
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
