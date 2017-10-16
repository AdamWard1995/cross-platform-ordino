import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Account Details',
  model () {
    return this.modelFor('user').user;
  }
});
