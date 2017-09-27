import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    const terms = this.modelFor('user.terms').filterBy('id', params.term);
    if (!this.get('session').get('isAuthenticated')) {
      this.transitionTo('index');
    } else if (!terms || terms.length !== 1) {
      this.transitionTo('user.terms');
    } else {
      const term = terms[0];
      const termID = term.get('id');
      return this.store.query('course', {orderBy: 'tid', equalTo: termID}).then(response => {
        return {
          term,
          courses: response.toArray()
        };
      });
    }
  },
  setupController (controller, model) {
    controller.set('terms', this.modelFor('user.terms'));
    this._super(controller, model);
  }
});
