import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-menu'],
  classNameBindings: ['drawerOpen:is-open:is-closed'],
  observeToggle: function() {
    if (this.get('toggle')) {
      this.actions.toggleDrawerState.apply(this);
      this.set('toggle', false);
    }
  }.observes('toggle'),
  didRender () {
    this._super(...arguments);
    if (!this.get('drawerOpen') && this.$('.app-menu-drawer:visible').length == 1) {
      this.$('.app-menu-drawer').hide();
    }
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
    },
    navViewClicked () {
      const onNavViewClicked = this.get('onNavViewClicked');
      if (onNavViewClicked) {
        onNavViewClicked();
      }
    }
  }
});
