// app/routes/index.js
import Ember from 'ember';

export default Ember.Route.extend({
  // session: Ember.inject.service(), TODO determine if can delete
  model () {
    return {};
  },
  beforeModel () {
    if (this.get('session').get('isAuthenticated')) {
      this.controllerFor('application').send('goToAccountDashboard');
    }
  }
});
