import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('create-course-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    describe('default values used', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-modal open=true}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should be visible', function() {
        expect(this.$('.create-course-modal .modal:visible')).to.have.length(1);
      });

      it('should render default title', function() {
        expect(this.$('.modal-title').text().trim()).to.eql('Create course');
      });

      it('should have no entered course code', function() {
        expect(this.$('.modal-body .course-code').val()).to.eql('');
      });

      it('should not have create class times checkbox checked', function() {
        expect(this.$('.modal-body .create-class-times:checked')).to.have.length(0);
      });

      it('should not render location textbox', function() {
        expect(this.$('.modal-body .location')).to.have.length(0);
      });

      it('should not render start time picker', function() {
        expect(this.$('.modal-body .start-time-picker')).to.have.length(0);
      });

      it('should not render end time picker', function() {
        expect(this.$('.modal-body .end-time-picker')).to.have.length(0);
      });

      it('should not render selected days selector', function() {
        expect(this.$('.modal-body .selected-days')).to.have.length(0);
      });
    });

    describe('values provided', function () {
      describe('no class times', function () {
        beforeEach(function () {
          this.render(hbs`{{create-course-modal open=true title='Create a new course' course-code='COMP 4004' createClassTimes=false}}`);
          return wait();
        });

        it('should render', function() {
          expect(this.$()).to.have.length(1);
        });

        it('should be visible', function() {
          expect(this.$('.create-course-modal .modal:visible')).to.have.length(1);
        });

        it('should render default title', function() {
          expect(this.$('.modal-title').text().trim()).to.eql('Create a new course');
        });

        it('should have no entered course code', function() {
          expect(this.$('.modal-body .course-code').val()).to.eql('COMP 4004');
        });

        it('should not have create class times checkbox checked', function() {
          expect(this.$('.modal-body .create-class-times:checked')).to.have.length(0);
        });

        it('should not render location textbox', function() {
          expect(this.$('.modal-body .location')).to.have.length(0);
        });

        it('should not render start time picker', function() {
          expect(this.$('.modal-body .start-time-picker')).to.have.length(0);
        });

        it('should not render end time picker', function() {
          expect(this.$('.modal-body .end-time-picker')).to.have.length(0);
        });

        it('should not render selected days selector', function() {
          expect(this.$('.modal-body .selected-days')).to.have.length(0);
        });
      });

      describe('are selected class times', function () {
        beforeEach(function () {
          this.render(hbs`{{create-course-modal open=true title='Create a new course' course-code='COMP 4004' createClassTimes=true location='TB 238' start-time='10:05 am' end-time='11:25 am' selectedDays=(array 'Tuesday' 'Thursday')}}`);
          return wait();
        });

        it('should render', function() {
          expect(this.$()).to.have.length(1);
        });

        it('should be visible', function() {
          expect(this.$('.create-course-modal .modal:visible')).to.have.length(1);
        });

        it('should render default title', function() {
          expect(this.$('.modal-title').text().trim()).to.eql('Create a new course');
        });

        it('should have no entered course code', function() {
          expect(this.$('.modal-body .course-code').val()).to.eql('COMP 4004');
        });

        it('should have create class times checkbox checked', function() {
          expect(this.$('.modal-body .create-class-times:checked')).to.have.length(1);
        });

        it('should render correct location', function() {
          expect(this.$('.modal-body .location'), 'Should have rendered location checkbox').to.have.length(1);
          expect(this.$('.modal-body .location').val().trim(), 'Should have entered location').to.eql('TB 238');
        });

        it('should have rendered start time', function() {
          expect(this.$('.modal-body .start-time-picker .ember-text-field'), 'Should have rendered start time picker').to.have.length(1);
          expect(this.$('.modal-body .start-time-picker .ember-text-field').val().trim(), 'Should have entered correct start time').to.eql('10:05 am');
        });

        it('should have rendered end time', function() {
          expect(this.$('.modal-body .end-time-picker .ember-text-field'), 'Should have rendered end time picker').to.have.length(1);
          expect(this.$('.modal-body .end-time-picker .ember-text-field').val().trim(), 'Should have entered correct end time').to.eql('11:25 am');
        });

        it('should have rendered selected days', function() {
          expect(this.$('.modal-body .selected-days')).to.have.length(1);
        });

        it('should have Tuesday selected', function() {
          expect(this.$('.modal-body label[for=\'Tuesday-checkbox\'] :checked')).to.have.length(1);
        });

        it('should have Thursday selected', function() {
          expect(this.$('.modal-body label[for=\'Thursday-checkbox\'] :checked')).to.have.length(1);
        });
      });
    });
  });

  describe('submit with no course code entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a course code.');
    });
  });

  describe('submit with no start time entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true course-code='COMP 4004' createClassTimes=true end-time=(moment '10:05 am' 'hh:mm a')}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a start time that is before the end time.');
    });
  });

  describe('submit with no end time entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true course-code='COMP 4004' createClassTimes=true start-time=(moment '10:05 am' 'hh:mm a')}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a start time that is before the end time.');
    });
  });

  describe('submit with a start time that is after end time', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true course-code='COMP 4004' createClassTimes=true start-time=(moment '11:25 am' 'hh:mm a') end-time=(moment '10:05 am' 'hh:mm a')}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a start time that is before the end time.');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.create-course-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('select start time', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true createClassTimes=true start-time=(moment '10:05 am' 'hh:mm a') end-time=(moment '11:25 am' 'hh:mm a')}}`);
      return wait().then(() => {
        this.$('.start-time-picker .input-group-addon').click();
        return wait();
      });
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-hour').text().trim()).to.eql('10');
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-minute').text().trim()).to.eql('05');
    });

    describe('select start hour', function () {
      beforeEach(function () {
        this.$('.timepicker-hour').click();
        return wait().then(() => {
          this.$('.hour').eq(5).click();
        });
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .start-time-picker .ember-text-field').val().trim()).to.eql('05:05 am');
      });
    });

    describe('select start minute', function () {
      beforeEach(function () {
        this.$('.timepicker-minute').click();
        return wait().then(() => {
          this.$('.minute').eq(5).click();
        });
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .start-time-picker .ember-text-field').val().trim()).to.eql('10:25 am');
      });
    });

    describe('select period', function () {
      beforeEach(function () {
        this.$('.start-time-picker .btn-primary').click();
        return wait();
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .start-time-picker .ember-text-field').val().trim()).to.eql('10:05 pm');
      });
    });
  });

  describe('select end time', function () {
    beforeEach(function () {
      this.render(hbs`{{create-course-modal open=true createClassTimes=true start-time=(moment '10:05 am' 'hh:mm a') end-time=(moment '11:25 am' 'hh:mm a')}}`);
      return wait().then(() => {
        this.$('.end-time-picker .input-group-addon').click();
        return wait();
      });
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-hour').text().trim()).to.eql('11');
    });

    it('should have initially selected hour', function() {
      expect(this.$('.timepicker-minute').text().trim()).to.eql('25');
    });

    describe('select start hour', function () {
      beforeEach(function () {
        this.$('.timepicker-hour').click();
        return wait().then(() => {
          this.$('.hour').eq(5).click();
        });
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .end-time-picker .ember-text-field').val().trim()).to.eql('05:25 am');
      });
    });

    describe('select start minute', function () {
      beforeEach(function () {
        this.$('.timepicker-minute').click();
        return wait().then(() => {
          this.$('.minute').eq(4).click();
        });
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .end-time-picker .ember-text-field').val().trim()).to.eql('11:20 am');
      });
    });

    describe('select period', function () {
      beforeEach(function () {
        this.$('.end-time-picker .btn-primary').click();
        return wait();
      });

      it('should have initially selected hour', function() {
        expect(this.$('.modal-body .end-time-picker .ember-text-field').val().trim()).to.eql('11:25 pm');
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
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
    });

    describe('are selected class times', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-modal open=true onSubmit=onSubmit title='Create a new course' course-code='COMP 4004' createClassTimes=true location='TB 238' start-time=(moment '10:05 am' 'hh:mm a') end-time=(moment '11:25 am' 'hh:mm a') selectedDays=(array 'Tuesday' 'Thursday')}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      })

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('COMP 4004', 'TB 238', '10:05 am', '11:25 am', ['Tuesday', 'Thursday']);
      });
    });

    describe('no entered location', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-modal open=true onSubmit=onSubmit title='Create a new course' course-code='COMP 4004' createClassTimes=true start-time=(moment '10:05 am' 'hh:mm a') end-time=(moment '11:25 am' 'hh:mm a') selectedDays=(array 'Tuesday' 'Thursday')}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      })

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('COMP 4004', 'N/A', '10:05 am', '11:25 am', ['Tuesday', 'Thursday']);
      });
    });

    describe('no selected class times', function () {
      beforeEach(function () {
        this.render(hbs`{{create-course-modal open=true onSubmit=onSubmit title='Create a new course' course-code='COMP 4004'}}`);
        return wait().then(() => {
          this.$('.btn-primary').click();
          return wait();
        });
      })

      it('should have called submit handler', function() {
        expect(submitStub).to.have.callCount(1);
      });

      it('should have passed correct parameters to submit handler', function() {
        expect(submitStub).to.have.been.calledWithExactly('COMP 4004', 'N/A', null, null, []);
      });
    });
  });
});
