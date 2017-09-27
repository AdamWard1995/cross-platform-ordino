import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('term-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders non-current term', function () {
    let item = Ember.Object.create({semester: 'Fall', year: 2017, current: false});
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{term-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have term-renderer class set', function() {
      expect(this.$('.term-renderer')).to.have.length(1);
    });

    it('should have correct text rendered', function() {
      expect(this.$('.term-label').text().trim()).to.eql('Fall 2017');
    });
  });

  describe('properly renders current term', function () {
    let item = Ember.Object.create({semester: 'Fall', year: 2017, current: true});
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{term-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have term-renderer class set', function() {
      expect(this.$('.term-renderer')).to.have.length(1);
    });

    it('should have correct text rendered', function() {
      expect(this.$('.term-label').text().trim()).to.eql('Fall 2017**');
    });
  });
});
