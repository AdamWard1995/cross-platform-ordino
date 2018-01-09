import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('course-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders course and no average', function () {
    let item = {course: Ember.Object.create({'course-code': 'COMP 4905'})};
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-renderer class set', function() {
      expect(this.$('.course-renderer')).to.have.length(1);
    });

    it('should have correct course label rendered', function() {
      expect(this.$('.course-label').text().trim()).to.eql('COMP 4905');
    });

    it('should have blank average rendered', function() {
      expect(this.$('.course-average-value').text().trim()).to.eql('---%');
    });
  });

  describe('properly renders course and average', function () {
    let item = {course: Ember.Object.create({'course-code': 'COMP 4905'}), average: 95};
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-renderer class set', function() {
      expect(this.$('.course-renderer')).to.have.length(1);
    });

    it('should have correct course label rendered', function() {
      expect(this.$('.course-label').text().trim()).to.eql('COMP 4905');
    });

    it('should have correct average rendered', function() {
      expect(this.$('.course-average-value').text().trim()).to.eql('95.0%');
    });
  });

  describe('properly renders course and rounded average', function () {
    let item = {course: Ember.Object.create({'course-code': 'COMP 4905'}), average: 95.6345};
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-renderer class set', function() {
      expect(this.$('.course-renderer')).to.have.length(1);
    });

    it('should have correct course label rendered', function() {
      expect(this.$('.course-label').text().trim()).to.eql('COMP 4905');
    });

    it('should have correct rounded average rendered', function() {
      expect(this.$('.course-average-value').text().trim()).to.eql('95.6%');
    });
  });
});
