/* global jQuery */

import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('change-password-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{change-password-modal open=true}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.change-password-modal .modal:visible')).to.have.length(1);
    });

    it('should render default title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('Change account password');
    });

    it('should render current password textbox', function() {
      expect(this.$('.modal-body .current-password')).to.have.length(1);
    });

    it('should render new password textbox', function() {
      expect(this.$('.modal-body .new-password')).to.have.length(1);
    });

    it('should render confirm new password textbox', function() {
      expect(this.$('.modal-body .confirm-password')).to.have.length(1);
    });

    it('should render cancel button', function() {
      expect(this.$('.btn-danger').text().trim()).to.eql('Cancel');
    });

    it('should render confirm button', function() {
      expect(this.$('.btn-primary').text().trim()).to.eql('Submit');
    });
  });

  describe('submit with no current password entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-password-modal onSubmit=onSubmit open=true}}`);
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

  describe('submit with new password not matching', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-password-modal current-password='foo' password='bar' confirm-password='baz' onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! The new passwords you entered do not match.');
    });
  });

  describe('submit with non-valid password entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{change-password-modal current-password='foo' password='bar' confirm-password='bar' onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! The password you entered does not contain at least one uppercase letter, one lowercase letter, and one number.');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{change-password-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.change-password-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly cancels', function () {
    let cancelStub;
    beforeEach(function () {
      cancelStub = sinon.stub();
      this.set('onCancel', cancelStub);
      this.render(hbs`{{change-password-modal open=true onClose=onCancel}}`);
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
      this.render(hbs`{{change-password-modal open=true onSubmit=onSubmit current-password='F00bar' password='Passw0rd' confirm-password='Passw0rd'}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('F00bar', 'Passw0rd');
    });
  });

  describe('properly submits on ENTER', function () {
    let submitStub;
    beforeEach(function () {
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
      this.render(hbs`{{change-password-modal open=true onSubmit=onSubmit current-password='F00bar' password='Passw0rd' confirm-password='Passw0rd'}}`);
      return wait().then(() => {
        let e = jQuery.Event('keypress');
        e.which = 13;
        e.keyCode = 13;
        this.$('.new-password').trigger(e);
        return wait();
      });
    });

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('F00bar', 'Passw0rd');
    });
  });
});
