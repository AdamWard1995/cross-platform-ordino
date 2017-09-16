import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return {};
  },
  resetController (controller) {
    controller.set('email', null);
    controller.set('password', null);
    controller.set('errorMessage', null);
    controller.set('emailNotVerified', false);
  }
});
