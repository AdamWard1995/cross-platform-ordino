import Ember from 'ember';

const {A} = Ember;

export default Ember.Mixin.create({
  changed: A(),
  new: A(),
  reset: true,
  addChanged (item) {
    if (this.get('reset')) {
      const changed = this.get('changed');
      if (item) {
        if (!changed.includes(item)) {
          this.set('changed', changed.slice().addObject(item));
          Ember.run.later(() => {
            this.set('changed', this.get('changed').slice().removeObject(item));
          }, 2000);
        }
      }
    }
  },
  addNew (item) {
    if (this.get('reset')) {
      const _new = this.get('new');
      if (item) {
        if (!_new.includes(item)) {
          this.set('new', _new.slice().addObject(item));
          Ember.run.later(() => {
            this.set('new', this.get('new').slice().removeObject(item));
          }, 2000);
        }
      }
    }
  }
});
