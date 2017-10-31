/* global $ */

import Ember from 'ember';
import ClickOutside from 'ember-click-outside/mixins/click-outside';
import {round} from 'cross-platform-ordino/helpers/round';

export default Ember.Component.extend(ClickOutside, {
  classNames: ['percent-input', 'input-group'],
  popoverVisible: false,
  observeValues: function() {
    const numerator = parseInt(this.get('numerator'));
    const denominator = parseInt(this.get('denominator'));
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
    // let clickHandler = this.get('handleOutsideClick').bind(this);
    // return Ember.$(document).on('click', clickHandler);
    return $(document).on('click', $.proxy(this.get('handleOutsideClick'), this));
  }),
  removeOutsideClickListener: Ember.on('willDestroyElement', function() {
    // let clickHandler = this.get('handleOutsideClick').bind(this);
    // return Ember.$(document).off('click', clickHandler);
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
