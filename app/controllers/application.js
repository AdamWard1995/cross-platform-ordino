import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    toggleDrawerState () {
      this.set('drawerOpen', !this.get('drawerOpen'));
    },
    goToAccountPage () {
      this.transitionToRoute('user', this.get('session').get('currentUser').uid);
    }
  }
});
