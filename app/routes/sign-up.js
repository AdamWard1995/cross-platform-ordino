import Ember from 'ember';

export default Ember.Route.extend({
  parentController: Ember.computed(function() {
    return this.controllerFor('application');
  }),

  setupController (controller, model) {
    this._super(controller, model);
    this.get('parentController').set('forceShowContent', true);
  },

  actions: {
    willTransition () {
      this.get('parentController').set('forceShowContent', false);
      return true;
    }
  }
});
