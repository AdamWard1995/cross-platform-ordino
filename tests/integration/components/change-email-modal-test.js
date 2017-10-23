import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('change-email-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{change-email-modal open=true}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.change-email-modal .modal:visible')).to.have.length(1);
    });

    it('should render default title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('Change account E-mail');
    });

    it('should render new email textbox', function() {
      expect(this.$('.modal-body .new-email')).to.have.length(1);
    });

    it('should render confirm password textbox', function() {
      expect(this.$('.modal-body .confirm-password')).to.have.length(1);
    });

    it('should render cancel button', function() {
      expect(this.$('.btn-danger').text().trim()).to.eql('Cancel');
    });

    it('should render confirm button', function() {
      expect(this.$('.btn-primary').text().trim()).to.eql('Submit');
    });
  });

  describe('submit with no email entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-email-modal onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! The E-mail address format you entered is invalid.');
    });
  });

  describe('submit with invalid email string entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-email-modal email='foo' onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! The E-mail address format you entered is invalid.');
    });
  });

  describe('submit with no password entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-email-modal email='adam@ward.ca' onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! Please confirm your account password.');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{change-email-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.change-email-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly cancels', function () {
    let cancelStub;
    beforeEach(function () {
      cancelStub = sinon.stub();
      this.set('onCancel', cancelStub);
      this.render(hbs`{{change-email-modal open=true onClose=onCancel}}`);
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
      this.render(hbs`{{change-email-modal open=true onSubmit=onSubmit email='adam@ward.ca' password='Passw0rd'}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    })

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('adam@ward.ca', 'Passw0rd');
    });
  });
});
