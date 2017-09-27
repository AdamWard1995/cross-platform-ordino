import Ember from 'ember';
import Semester from '../enums/semester';

export default Ember.Component.extend({
  open: false,
  errorMessage: '',
  title: 'Create term',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-gone';
  }),
  semesters: [
    {
      label: '-- Select --',
      value: null
    },
    {
      label: Semester.FALL,
      value: Semester.FALL
    },
    {
      label: Semester.WINTER,
      value: Semester.WINTER
    },
    {
      label: Semester.SUMMER,
      value: Semester.SUMMER
    },
  ],
  actions: {
    close () {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    },
    submit () {
      const semester = this.get('semester');
      const year = this.get('year');
      const current = this.get('current') && true;
      if (!semester) {
        this.set('errorMessage', 'You need to select a semester.')
        return;
      } else if (!year) {
        this.set('errorMessage', 'You need to enter a year.')
        return;
      }
      if (this.get('onSubmit')) {
        this.get('onSubmit')(semester, year, current);
      }
    }
  }
});
