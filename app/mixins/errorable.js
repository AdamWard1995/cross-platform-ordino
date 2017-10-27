import Ember from 'ember';

export default Ember.Mixin.create({
  errorMessage: '',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-gone';
  })
});
