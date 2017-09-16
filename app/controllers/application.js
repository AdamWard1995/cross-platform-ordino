import Ember from 'ember';

export default Ember.Controller.extend({
  observeSession: function() {
    if (this.get('session').get('isClosing') &&
        this.get('session').get('isAuthenticated')) {
      Ember.run.next(this, function () {
        this.send('accessDenied');
      });
    }
  }.observes('session.isAuthenticated', 'session.isClosing'),
  actions: {
    goToAccountDashboard () {
      this.transitionToRoute('user', this.get('session').get('currentUser').uid);
    },
    goToAccountDetails () {
      this.transitionToRoute('user.account', this.get('session').get('currentUser').uid);
    }
  }
});
