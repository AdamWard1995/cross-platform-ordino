/* global jQuery */

import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('create-course-work-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    describe('default values used', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-work-modal open=true}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should be visible', function() {
        expect(this.$('.create-course-work-modal .modal:visible')).to.have.length(1);
      });

      it('should render default title', function() {
        expect(this.$('.modal-title').text().trim()).to.eql('Create course work');
      });

      it('should have no selected course', function() {
        expect(this.$('.modal-body .select-course').val()).to.eql(null);
      });

      it('should have no selected category', function() {
        expect(this.$('.modal-body .category').val()).to.eql(null);
      });

      it('should have no entered label', function() {
        expect(this.$('.modal-body .work-label').val()).to.eql('');
      });

      it('should not have no entered weight', function() {
        expect(this.$('.modal-body .weight .percent').val()).to.eql('');
      });

      it('should have no entered grade', function() {
        expect(this.$('.modal-body .grade .percent').val()).to.eql('');
      });

      it('should no have no set due time', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val()).to.eql('');
      });
    });

    describe('values provided', function () {
      beforeEach(function () {
        const category = Ember.Object.create({id: 13579, label: 'Reading'});
        const course = Ember.Object.create({id: 12345, 'course-code': 'COMP 4107'});
        this.set('course', course.get('id'));
        this.set('courses', [course]);
        this.set('category', category.get('id'));
        this.set('categories', [category]);
        this.render(hbs`{{create-course-work-modal open=true label='Assignment 1' weight=30 grade=95 due=(moment 'September 28 2017, 11:59 pm' 'MMMM Do YYYY, h:mm a') category=category categories=categories course=course courses=courses}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should be visible', function() {
        expect(this.$('.create-course-work-modal .modal:visible')).to.have.length(1);
      });

      it('should render default title', function() {
        expect(this.$('.modal-title').text().trim()).to.eql('Create course work');
      });

      it('should have selected course', function() {
        expect(this.$('.select-course').val()).to.eql('12345');
      });

      it('should have selected course label', function() {
        expect(this.$('.select-course option[value=\'12345\']').text()).to.eql('COMP 4107');
      });

      it('should have selected category', function() {
        expect(this.$('.category').val()).to.eql('13579');
      });

      it('should have selected category label', function() {
        expect(this.$('.category option[value=\'13579\']').text()).to.eql('Reading');
      });

      it('should have no entered label', function() {
        expect(this.$('.modal-body .work-label').val()).to.eql('Assignment 1');
      });

      it('should not have no entered weight', function() {
        expect(this.$('.modal-body .weight .percent').val()).to.eql('30');
      });

      it('should have no entered grade', function() {
        expect(this.$('.modal-body .grade .percent').val()).to.eql('95');
      });

      it('should no have no set due time', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val()).to.eql('September 28th 2017, 11:59 pm');
      });
    });
  });

  describe('submit with no work label entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-work-modal open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a label.');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-work-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.create-course-work-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('select due time', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-work-modal open=true due=(moment 'September 28th 2017, 10:05 am' 'MMMM Do YYYY, hh:mm a')}}`);
      return wait().then(() => {
        this.$('.due-time-picker .input-group-addon').click();
        return wait();
      });
    });

    it('should have initially selected month', function() {
      expect(this.$('.picker-switch').eq(0).text().trim()).to.eql('September 2017');
    });

    it('should have initially selected day', function() {
      expect(this.$('.day.active').text().trim()).to.eql('28');
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-hour').text().trim()).to.eql('10');
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-minute').text().trim()).to.eql('05');
    });

    describe('select date', function () {
      beforeEach(function () {
        this.$('.next').click();
        return wait().then(() => {
          this.$('.day').eq(10).click();
          return wait();
        });
      });

      it('should have newly selected date', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val().trim()).to.eql('January 10th 2018, 10:05 am');
      });
    });

    describe('select hour', function () {
      beforeEach(function () {
        this.$('.table-condensed a').click();
        return wait().then(() => {
          this.$('.timepicker-hour').click();
          return wait().then(() => {
            this.$('.hour').eq(5).click();
          });
        });
      });

      it('should have newly selected hour', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val().trim()).to.eql('September 28th 2017, 5:05 am');
      });
    });

    describe('select minute', function () {
      beforeEach(function () {
        this.$('.table-condensed a').click();
        return wait().then(() => {
          this.$('.timepicker-minute').click();
          return wait().then(() => {
            this.$('.minute').eq(5).click();
          });
        });
      });

      it('should have newly selected minute', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val().trim()).to.eql('September 28th 2017, 10:25 am');
      });
    });

    describe('select period', function () {
      beforeEach(function () {
        this.$('.due-time-picker .btn-primary').click();
        return wait();
      });

      it('should have newly selected period', function() {
        expect(this.$('.modal-body .due-time-picker .ember-text-field').val().trim()).to.eql('September 28th 2017, 10:05 pm');
      });
    });
  });

  describe('properly cancels', function () {
    let cancelStub;
    beforeEach(function () {
      cancelStub = sinon.stub();
      this.set('onCancel', cancelStub);
      this.render(hbs`{{create-course-modal open=true onClose=onCancel}}`);
      return wait().then(() => {
        this.$('.btn-danger').click();
        return wait();
      });
    })

    it('should have called cancel handler', function() {
      expect(cancelStub).to.have.callCount(1);
    });
  });

  describe('properly submits', function () {
    let submitStub;
    beforeEach(function () {
      const category = Ember.Object.create({id: 13579, label: 'Reading'});
      const course = Ember.Object.create({id: 12345, 'course-code': 'COMP 4107'});
      this.set('course', course.get('id'));
      this.set('courses', [course]);
      this.set('category', category.get('id'));
      this.set('categories', [category]);
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
    });

    describe('no label is provided', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-work-modal open=true onSubmit=onSubmit weight=30 grade=95 due=(moment 'September 28 2017, 11:59 pm' 'MMMM Do YYYY, h:mm a') category=category categories=categories course=course courses=courses}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      });

      it('should not have called submit handler', function() {
        expect(submitStub).to.have.callCount(0);
      });

      it('should displayed error message', function() {
        expect(this.$('.alert:visible')).to.have.length(1);
      });

      it('should have set correct error message', function() {
        expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a label.');
      });
    });

    describe('no entered due date', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-work-modal open=true onSubmit=onSubmit label='Assignment 1' weight=30 grade=95 category=category categories=categories  courses=courses course=course}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      });

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('Assignment 1', 30, 95, null, 13579, 12345);
      });
    });

    describe('all values are provided', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-work-modal open=true onSubmit=onSubmit label='Assignment 1' weight=30 grade=95 due=(moment 'September 28 2017, 11:59 pmZ' 'MMMM Do YYYY, h:mm aZ') category=category categories=categories course=course courses=courses}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      });

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('Assignment 1', 30, 95, '2017-09-28T23:59:00.000Z', 13579, 12345);
      });
    });

    describe('properly submits on ENTER', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-work-modal open=true onSubmit=onSubmit label='Assignment 1' weight=30 grade=95 due=(moment 'September 28 2017, 11:59 pmZ' 'MMMM Do YYYY, h:mm aZ') category=category categories=categories course=course courses=courses}}`);
        return wait().then(() => {
          let e = jQuery.Event('keypress');
          e.which = 13;
          e.keyCode = 13;
          this.$('.work-label').trigger(e);
          return wait();
        });
      });

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('Assignment 1', 30, 95, '2017-09-28T23:59:00.000Z', 13579, 12345);
      });
    });
  });
});
