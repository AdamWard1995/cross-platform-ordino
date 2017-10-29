import Ember from 'ember';
import Filter from './filter';
import moment from 'moment';

export default Filter.extend({
  classNames: ['date-filter'],
  momentValue: Ember.computed('value', function() {
    const value = this.get('value');
    if (value) {
      return moment(parseInt(value));
    }
  }),
  actions: {
    updateDate (date) {
      if (date) {
        this.set('value', date.valueOf());
      } else {
        this.set('value', '');
      }
    }
  }
});
