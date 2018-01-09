import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

const test = integration('workflow-course-work-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders course work with weight and grade', function () {
    let work = Ember.Object.create({
      label: 'Assignment 1',
      weight: 40,
      grade: 100,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a').toISOString()
    });
    let course = Ember.Object.create({
      'course-code': 'COMP 4004'
    });
    beforeEach(function () {
      this.set('item', {course, work});
      this.render(hbs`{{workflow-course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have workflow-course-work-renderer class set', function() {
      expect(this.$('.workflow-course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have correct course code rendered', function() {
      expect(this.$('.work-course').text().trim()).to.eql('COMP 4004');
    });

    it('should have correct weight rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('40.0%');
    });

    it('should have correct due time rendered', function() {
      expect(this.$('.due-value').text().trim()).to.eql('11:59 pm');
    });
  });

  describe('properly renders course work without weight', function () {
    let work = Ember.Object.create({
      label: 'Assignment 1',
      grade: 100,
      due: moment('September 28th 2017, 11:59 pm', 'MMMM Do YYYY, h:mm a').toISOString()
    });
    let course = Ember.Object.create({
      'course-code': 'COMP 4004'
    });
    beforeEach(function () {
      this.set('item', {course, work});
      this.render(hbs`{{workflow-course-work-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have workflow-course-work-renderer class set', function() {
      expect(this.$('.workflow-course-work-renderer')).to.have.length(1);
    });

    it('should have correct label rendered', function() {
      expect(this.$('.label').text().trim()).to.eql('Assignment 1');
    });

    it('should have correct course code rendered', function() {
      expect(this.$('.work-course').text().trim()).to.eql('COMP 4004');
    });

    it('should have null weight string rendered', function() {
      expect(this.$('.weight-value').text().trim()).to.eql('---%');
    });

    it('should have correct due time rendered', function() {
      expect(this.$('.due-value').text().trim()).to.eql('11:59 pm');
    });
  });
});
