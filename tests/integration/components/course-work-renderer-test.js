import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

const test = integration('course-work-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders course work with completed checkmark, weight and grade', function () {
    let item = Ember.Object.create({
      label: 'Assignment 1',
      weight: 40,
      grade: 100,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a').toISOString(),
      completed: true
    });
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-work-renderer class set', function() {
      expect(this.$('.course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have correct weight rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('40%');
    });

    it('should have correct grade rendered', function() {
      expect(this.$('.grade-value').text().trim()).to.eql('100%');
    });

    it('should have rendered completed checkmark', function() {
      expect(this.$('.completed')).to.have.length(1);
    });
  });

  describe('properly renders course work without weight', function () {
    let item = Ember.Object.create({
      label: 'Assignment 1',
      grade: 100,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a').toISOString(),
      completed: true
    });
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-work-renderer class set', function() {
      expect(this.$('.course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have null weight string rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('---%');
    });

    it('should have correct grade rendered', function() {
      expect(this.$('.grade-value').text().trim()).to.eql('100%');
    });

    it('should have rendered completed checkmark', function() {
      expect(this.$('.completed')).to.have.length(1);
    });
  });

  describe('properly renders course work without grade', function () {
    let item = Ember.Object.create({
      label: 'Assignment 1',
      weight: 40,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a').toISOString(),
      completed: true
    });
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-work-renderer class set', function() {
      expect(this.$('.course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have correct weight rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('40%');
    });

    it('should have null grade string rendered', function() {
      expect(this.$('.grade-value').text().trim()).to.eql('---%');
    });

    it('should have rendered completed checkmark', function() {
      expect(this.$('.completed')).to.have.length(1);
    });
  });

  describe('properly renders course work completed checkmark', function () {
    let item = Ember.Object.create({
      label: 'Assignment 1',
      weight: 40,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do yyyy, h:mm a').toISOString(),
      completed: false
    });
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have course-work-renderer class set', function() {
      expect(this.$('.course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have correct weight rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('40%');
    });

    it('should have null grade string rendered', function() {
      expect(this.$('.grade-value').text().trim()).to.eql('---%');
    });

    it('should not have rendered completed checkmark', function() {
      expect(this.$('.completed')).to.have.length(0);
    });
  });
});
