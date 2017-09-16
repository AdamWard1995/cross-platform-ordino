import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-menu'],
  classNameBindings: ['drawerOpen:is-open:is-closed'],
  didInsertElement () {
    this._super(...arguments);
    this.$('.app-menu-drawer').hide();
  },
  actions: {
    toggleDrawerState () {
      const opening = !this.get('drawerOpen');
      if (opening) {
        this.set('drawerOpen', opening);
        this.$('.app-menu-drawer').show('slide', {direction: 'left'}, 250);
      } else {
        this.$('.app-menu-drawer').hide('slide', {direction: 'left'}, 250, () => {
          this.set('drawerOpen', opening);
        });
      }
    }
  }
});
