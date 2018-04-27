import Ember from 'ember';

const {A} = Ember;

export default Ember.Mixin.create({
  changed: A(),
  new: A(),
  timers: A(),
  reset: true,
  addChanged (item) {
    if (this.get('reset')) {
      const changed = this.get('changed');
      if (item) {
        if (!changed.includes(item)) {
          this.set('changed', changed.slice().addObject(item));
        } else {
          // Reset timer
          const itemObj = this.get('timers').filter(obj => obj.item == item)[0];
          Ember.run.cancel(itemObj.timer);
          this.set('timers', this.get('timers').slice().removeObject(itemObj));
        }
        const timer = Ember.run.later(() => {
          this.set('changed', this.get('changed').slice().removeObject(item));
        }, 2000);
        this.set('timers', this.get('timers').slice().addObject({item, timer}));
      }
    }
  },
  addNew (item) {
    if (this.get('reset')) {
      const _new = this.get('new');
      if (item) {
        if (!_new.includes(item)) {
          this.set('new', _new.slice().addObject(item));
        } else {
          // Reset timer
          const itemObj = this.get('timers').filter(obj => obj.item == item)[0];
          Ember.run.cancel(itemObj.timer);
          this.set('timers', this.get('timers').slice().removeObject(itemObj));
        }
        const timer = Ember.run.later(() => {
          this.set('new', this.get('new').slice().removeObject(item));
        }, 2000);
        this.set('timers', this.get('timers').slice().addObject({item, timer}));
      }
    }
  }
});
