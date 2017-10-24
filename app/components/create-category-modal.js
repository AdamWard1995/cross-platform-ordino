/* global $ */

import Ember from 'ember';

export default Ember.Component.extend({
  title: 'Create category',
  icons: [
    'address-book-o', 'handshake-o', 'thermometer', 'anchor', 'archive', 'area-chart', 'asterisk',
    'at', 'automobile', 'balance-scale', 'ban', 'bank', 'bar-chart', 'battery', 'bed', 'beer',
    'bell', 'bicycle', 'binoculars', 'birthday-cake', 'bolt', 'book', 'bookmark', 'briefcase', 'bug',
    'bullhorn', 'calculator', 'calendar', 'camera', 'check', 'child', 'clock-o', 'cloud', 'code',
    'coffee', 'cog', 'comment', 'compass', 'cutlery', 'database', 'desktop', 'diamond', 'edit',
    'exclamation', 'eye', 'eyedropper', 'file-text', 'film', 'fire', 'flag', 'flask', 'folder', 'frown-o',
    'gamepad', 'gavel', 'gift', 'globe', 'graduation-cap', 'headphones', 'image', 'key', 'keyboard-o',
    'leaf', 'lightbulb-o', 'line-chart', 'lock', 'map-o', 'mobile', 'moon-o', 'paw', 'paint-brush',
    'pencil', 'percent', 'pie-chart', 'print', 'quote-left', 'recycle', 'rocket', 'server', 'smile-o',
    'snowflake-o', 'star', 'sun-o', 'thumbs-up', 'ticket', 'tint', 'tree', 'trophy', 'umbrella', 'video-camera'
  ],
  errorMessageClass: Ember.computed('errorMessage', function() {
    return this.get('errorMessage') ?  'is-visible' : 'is-gone';
  }),
  actions: {
    iconSelected (icon) {
      if (icon) {
        if (icon === this.get('selectedIcon')) {
          this.set('selectedIcon', undefined);
        } else {
          this.set('selectedIcon', icon);
        }
      }
    },
    close () {
      const onClose = this.get('onClose');
      if (onClose) {
        onClose();
      }
    },
    submit () {
      const label = this.get('label');
      const icon = this.get('selectedIcon');

      if (!(label && label.trim())) {
        this.set('errorMessage', 'You need to enter a label.');
        return;
      }

      if (!icon) {
        this.set('errorMessage', 'You need to select an icon.');
        return;
      }

      const onSubmit = this.get('onSubmit');
      if (onSubmit) {
        onSubmit(label, icon);
      }
    },
    show () {
      const selected = $('.create-category-modal .selected')[0];
      if (selected) {
        selected.scrollIntoView();
      }
    }
  }
});
