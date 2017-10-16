import Ember from 'ember';

import {deleteCategory} from 'cross-platform-ordino/utils/cleanup';

export default Ember.Controller.extend({
  deleteConfirmationMessage: Ember.computed('itemToDelete', function() {
    if (this.get('itemToDelete')) {
      return `Are you sure you want to delete ${this.get('itemToDelete').get('label')}?`
    }
  }),
  actions: {
    showCreateModal () {
      this.set('createCategory', true);
    },
    hideCreateModal () {
      this.set('createCategory', false);
    },
    showEditModal (item) {
      this.set('itemToEdit', item);
      this.set('editCategory', true);
    },
    hideEditModal () {
      this.set('itemToEdit', null);
      this.set('editCategory', false);
    },
    showDeleteModal (item) {
      this.set('itemToDelete', item);
      this.set('deleteCategory', true);
    },
    hideDeleteModal () {
      this.set('deleteCategory', false);
      this.set('itemToDelete', null);
    },
    createCategory (label, icon) {
      this.store.createRecord('category', {
        uid: this.get('session').get('currentUser').uid,
        index: this.get('model').categories.length,
        label,
        icon
      }).save().then(() => {
        this.send('refreshModel');
      });
      this.send('hideCreateModal');
    },
    editCategory (label, icon) {
      const itemToEdit = this.get('itemToEdit');
      itemToEdit.set('label', label);
      itemToEdit.set('icon', icon);
      itemToEdit.save().then(() => {
        this.send('refreshModel');
      });
      this.send('hideEditModal');
    },
    deleteCategory () {
      const toDelete = this.get('itemToDelete');
      deleteCategory(toDelete, this.get('model').categories, this.get('model').courseWork);
      this.send('refreshModel');
      this.send('hideDeleteModal');
    }
  }
});
