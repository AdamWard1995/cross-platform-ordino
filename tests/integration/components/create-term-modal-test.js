import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('create-term-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    describe('default values used', function () {
      beforeEach(function () {
        this.render(hbs`{{create-term-modal open=true}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should be visible', function() {
        expect(this.$('.create-term-modal .modal:visible')).to.have.length(1);
      });

      it('should render supplied title', function() {
        expect(this.$('.modal-title').text().trim()).to.eql('Create term');
      });

      it('should select correct semester', function() {
        expect(this.$('.modal-body .semester').val()).to.eql('-- Select --');
      });

      it('should have correct year entered', function() {
        expect(this.$('.modal-body .year').val()).to.eql('');
      });

      it('should have current checkbox unchecked', function() {
        expect(this.$('.modal-body .current:checked')).to.have.length(0);
      });

      it('should render cancel button', function() {
        expect(this.$('.btn-danger').text().trim()).to.eql('Cancel');
      });

      it('should render confirm button', function() {
        expect(this.$('.btn-primary').text().trim()).to.eql('Submit');
      });
    });

    describe('values provided', function () {
      beforeEach(function () {
        this.render(hbs`{{create-term-modal open=true title='Create a new term' semester='Fall' year=2017 current=true}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should be visible', function() {
        expect(this.$('.create-term-modal .modal:visible')).to.have.length(1);
      });

      it('should render supplied title', function() {
        expect(this.$('.modal-title').text().trim()).to.eql('Create a new term');
      });

      it('should select correct semester', function() {
        expect(this.$('.modal-body .semester').val()).to.eql('Fall');
      });

      it('should have correct year entered', function() {
        expect(this.$('.modal-body .year').val()).to.eql('2017');
      });

      it('should have current checkbox checked', function() {
        expect(this.$('.modal-body .current:checked')).to.have.length(1);
      });

      it('should render cancel button', function() {
        expect(this.$('.btn-danger').text().trim()).to.eql('Cancel');
      });

      it('should render confirm button', function() {
        expect(this.$('.btn-primary').text().trim()).to.eql('Submit');
      });
    });
  });

  describe('submit with no course code entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-term-modal open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to select a semester.');
    });
  });

  describe('submit with no year entered', function () {
    beforeEach(function () {
      this.render(hbs`{{create-term-modal open=true semester='Fall'}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to enter a year.');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{create-term-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.create-term-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly cancels', function () {
    let cancelStub;
    beforeEach(function () {
      cancelStub = sinon.stub();
      this.set('onCancel', cancelStub);
      this.render(hbs`{{create-term-modal open=true onClose=onCancel}}`);
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
      this.render(hbs`{{create-term-modal open=true onSubmit=onSubmit semester='Fall' year=2017 current=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    })

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('Fall', 2017, true);
    });
  });
});
