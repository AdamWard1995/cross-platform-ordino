import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Terms',
  model () {
    return this.modelFor('user').terms;
  }
});
