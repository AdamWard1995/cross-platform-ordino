import Ember from 'ember';

export default Ember.Mixin.create({
  changed: null,
  new: null,
  reset: true,
  observeChanged: function() {
    if (this.get('changed') && this.get('reset')) {
      Ember.run.later(() => {
        this.set('changed', null);
      }, 2000);
    }
  }.observes('changed'),
  observeNew: function() {
    if (this.get('new') && this.get('reset')) {
      Ember.run.later(() => {
        this.set('new', null);
      }, 2000);
    }
  }.observes('new')
});
