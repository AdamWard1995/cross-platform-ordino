import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  open: false,
  errorMessage: '',
  title: 'Create course work',
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-gone';
  }),
  actions: {
    close () {
      const onClose = this.get('onClose');
      if (onClose) {
        onClose();
      }
    },
    submit () {
      const label = this.get('label');
      const weight = this.get('weight');
      const grade = this.get('grade');
      const due = this.get('due');

      if (!label) {
        this.set('errorMessage', 'You need to enter a label.')
        return;
      }

      const dueStr = due ? moment(due).toISOString() : null;
      const onSubmit = this.get('onSubmit');
      if (onSubmit) {
        onSubmit(label, weight, grade, dueStr);
      }
    }
  }
});
