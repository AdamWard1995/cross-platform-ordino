/* global window */

import Ember from 'ember';

export default Ember.Controller.extend({
  router: Ember.inject.service('-routing'),
  observeSession: function() {
    if (this.get('session').get('isClosing') &&
        this.get('session').get('isAuthenticated')) {
      const currentRoute = this.get('router').get('currentRouteName');
      if (currentRoute.startsWith('user')) {
        Ember.run.next(this, function () {
          this.send('accessDenied');
        });
      }
    }
  }.observes('session.isAuthenticated', 'session.isClosing'),
  routeChanged: function() {
    this.set('drawerOpen', false);
  },
  electron: false || (window.process && window.process.versions.electron),
  init() {
    this._super(...arguments);
    let router = this.get('router');
    router.addObserver('currentRouteName', this, 'routeChanged');
  },
  actions: {
    goToAccountDashboard () {
      this.transitionToRoute('user', this.get('session').get('currentUser').uid);
    },
    goToAccountDetails () {
      this.transitionToRoute('user.account', this.get('session').get('currentUser').uid);
    },
    goToIndex () {
      this.transitionToRoute('index');
    },
    toggleShowVersionModal () {
      this.set('showVersionModal', !this.get('showVersionModal'));
    },
    toggleShowDownloadModal () {
      this.set('showDownloadModal', !this.get('showDownloadModal'));
    }
  }
});
