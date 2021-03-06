import Ember from 'ember';
const {A} = Ember;

import moment from 'moment';

import FormModal from 'cross-platform-ordino/components/form-modal';

export default FormModal.extend({
  title: 'Create course work',
  class: 'create-course-work-modal',
  selectCategories: Ember.computed('categories.[]', function() {
    let categories = this.get('categories');
    if (categories) {
      categories = A(categories.slice());
      categories.insertAt(0, Ember.Object.create({label: '-- Select --'}));
      return categories;
    }
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
      const cgyid = this.get('category');
      const cid = this.get('course');
      const completed = this.get('completed');

      if (!label) {
        this.set('errorMessage', 'You need to enter a label.')
        return;
      }

      const dueStr = due ? moment(due).toISOString() : null;
      const onSubmit = this.get('onSubmit');
      if (onSubmit) {
        onSubmit(label, weight, grade, dueStr, cgyid, cid, completed);
      }
    }
  }
});
