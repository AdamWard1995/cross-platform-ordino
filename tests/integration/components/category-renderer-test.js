import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('category-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders category', function () {
    let item = Ember.Object.create({label: 'Reading', icon: 'book'});
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{category-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have category-renderer class set', function() {
      expect(this.$('.category-renderer')).to.have.length(1);
    });

    it('should have correct icon rendered', function() {
      expect(this.$('.fa')).to.have.class('fa-book');
    });

    it('should have correct label rendered', function() {
      expect(this.$('.category-label').text().trim()).to.eql('Reading');
    });
  });
});
