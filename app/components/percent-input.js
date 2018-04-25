/* global $ */

import Ember from 'ember';
import {round} from 'cross-platform-ordino/helpers/round';

export default Ember.Component.extend({
  classNames: ['percent-input', 'input-group'],
  popoverVisible: false,
  observeValues: function() {
    const numerator = parseFloat(this.get('numerator'));
    const denominator = parseFloat(this.get('denominator'));
    if (!isNaN(numerator) && !isNaN(denominator) && numerator >= 0 && denominator > 0) {
      this.set('percent', round([numerator / denominator * 100, 1]));
    }
  }.observes('numerator', 'denominator'),
  handleOutsideClick (event) {
    let $element = this.$();
    let $popover = $('.fraction-popover:visible');
    let $target = $(event.target);

    if (!($target.closest($element).length || $target.closest($popover).length)) {
      this.set('popoverVisible', false);
    }
  },
  setupOutsideClickListener: Ember.on('didInsertElement', function() {
    return $(document).on('click', $.proxy(this.get('handleOutsideClick'), this));
  }),
  removeOutsideClickListener: Ember.on('willDestroyElement', function() {
    return $(document).off('click', $.proxy(this.get('handleOutsideClick'), this));
  }),
  actions: {
    onShow () {
      this.set('numerator', null);
      this.set('denominator', null);
    },
    togglePopoverVisible () {
      this.set('popoverVisible', !this.get('popoverVisible'));
    }
  }
});
