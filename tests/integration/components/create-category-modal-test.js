/* global jQuery */

import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('create-category-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{create-category-modal open=true}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.create-category-modal .modal:visible')).to.have.length(1);
    });

    it('should render default title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('Create category');
    });

    it('should render label textbox', function() {
      expect(this.$('.modal-body .category-label')).to.have.length(1);
    });

    it('should render icons', function() {
      expect(this.$('.modal-body .icons')).to.have.length(1);
    });

    it('should render cancel button', function() {
      expect(this.$('.btn-danger').text().trim()).to.eql('Cancel');
    });

    it('should render confirm button', function() {
      expect(this.$('.btn-primary').text().trim()).to.eql('Submit');
    });
  });

  describe('submit with no label entered', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{create-category-modal onSubmit=onSubmit open=true}}`);
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

  describe('submit with no icon selected', function () {
    beforeEach(function () {
      this.set('onSubmit', function () {});
      this.render(hbs`{{create-category-modal label='foo' onSubmit=onSubmit open=true}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    });

    it('should make error message visible', function() {
      expect(this.$('.alert:visible')).to.have.length(1);
    });

    it('should set correct error message text', function() {
      expect(this.$('.alert').text().trim()).to.eql('Error! You need to select an icon.');
    });
  });

  describe('select icon', function () {
    let submitStub;
    beforeEach(function () {
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
      this.render(hbs`{{create-category-modal open=true}}`);
      return wait().then(() => {
        this.$('.fa-book')[0].scrollIntoView();
        this.$('.fa-book').click();
        return wait();
      });
    })

    it('should have set selectedIcon', function() {
      expect(this.$('.fa-book')).to.have.class('selected');
    });
  });

  describe('unselect icon', function () {
    let submitStub;
    beforeEach(function () {
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
      this.render(hbs`{{create-category-modal open=true selectedIcon='book'}}`);
      return wait().then(() => {
        this.$('.fa-book')[0].scrollIntoView();
        this.$('.fa-book').click();
        return wait();
      });
    })

    it('should have cleared selectedIcon', function() {
      expect(this.$('.fa-book')).to.not.have.class('selected');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{create-category-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.create-category-modal .modal:visible')).to.have.length(0);
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
      this.render(hbs`{{create-category-modal open=true onSubmit=onSubmit label='Reading' selectedIcon='book'}}`);
      return wait().then(() => {
        this.$('.btn-primary').click();
        return wait();
      });
    })

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('Reading', 'book');
    });
  });

  describe('properly submits on ENTER', function () {
    let submitStub;
    beforeEach(function () {
      submitStub = sinon.stub();
      this.set('onSubmit', submitStub);
      this.render(hbs`{{create-category-modal open=true onSubmit=onSubmit label='Reading' selectedIcon='book'}}`);
      return wait().then(() => {
        let e = jQuery.Event('keypress');
        e.which = 13;
        e.keyCode = 13;
        this.$('.category-label').trigger(e);
        return wait();
      });
    })

    it('should have called submit handler', function() {
      expect(submitStub).to.have.callCount(1);
    });

    it('Should have passed correct parameters to submit handler', function() {
      expect(submitStub).to.have.been.calledWithExactly('Reading', 'book');
    });
  });
});
