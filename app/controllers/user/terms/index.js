import Ember from 'ember';
import {deleteTerm} from 'cross-platform-ordino/utils/cleanup';

import ChangedItemMixin from 'cross-platform-ordino/mixins/changed-item';

export default Ember.Controller.extend(ChangedItemMixin, {
  createTerm: false,
  deleteConfirmationMessage: Ember.computed('itemToDelete', function() {
    if (this.get('itemToDelete')) {
      return `Are you sure you want to delete ${this.get('itemToDelete').get('semester')} ${this.get('itemToDelete').get('year')}?`
    }
  }),
  noTerms: Ember.computed('model', function() {
    return this.get('model').length === 0;
  }),
  actions: {
    showCreateModal () {
      this.set('createTerm', true);
    },
    hideCreateModal () {
      this.set('createTerm', false);
    },
    showDeleteModal (item) {
      this.set('itemToDelete', item);
      this.set('deleteTerm', true);
    },
    hideDeleteModal () {
      this.set('deleteTerm', false);
      this.set('itemToDelete', null);
    },
    createTerm (semester, year, current) {
      const term = this.store.createRecord('term', {
        uid: this.get('session').get('currentUser').uid,
        index: this.get('model').length,
        semester,
        year,
        current
      });
      this.set('new', term);
      term.save().then(() => {
        this.send('refreshModel');
      });
      if (current) {
        this.get('model').forEach((term) => {
          if (term.get('current')) {
            term.set('current', false);
            term.save();
          }
        });
      }
      this.send('hideCreateModal');
    },
    deleteTerm () {
      const toDelete = this.get('itemToDelete');
      deleteTerm(toDelete, this.get('model').without(toDelete), this.store);
      this.send('refreshModel');
      this.send('hideDeleteModal');
    },
    goToTermRoute (item) {
      this.transitionToRoute('user.terms.term', item.get('id'));
    }
  }
});
