import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('confirm-modal')
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    beforeEach(function () {
      this.render(hbs`{{confirm-modal open=true title='Confirm this...' confirmationMessage='You sure?'}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.confirm-modal .modal:visible')).to.have.length(1);
    });

    it('should render supplied title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('Confirm this...');
    });

    it('should render supplied confirmation message', function() {
      expect(this.$('.modal-body').text().trim()).to.eql('You sure?');
    });

    it('should render cancel button', function() {
      expect(this.$('.btn-danger').text().trim()).to.eql('No');
    });

    it('should render confirm button', function() {
      expect(this.$('.btn-success').text().trim()).to.eql('Yes');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{confirm-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.confirm-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly cancels', function () {
    let cancelStub;
    beforeEach(function () {
      cancelStub = sinon.stub();
      this.set('onCancel', cancelStub);
      this.render(hbs`{{confirm-modal open=true onClose=onCancel}}`);
      return wait().then(() => {
        this.$('.btn-danger').click();
        return wait();
      });
    })

    it('should have called cancel handler', function() {
      expect(cancelStub).to.have.callCount(1);
    });
  });

  describe('properly confirms', function () {
    let confirmStub;
    beforeEach(function () {
      confirmStub = sinon.stub();
      this.set('onConfirm', confirmStub);
      this.render(hbs`{{confirm-modal open=true onConfirm=onConfirm}}`);
      return wait().then(() => {
        this.$('.btn-success').click();
        return wait();
      });
    })

    it('should have called confirm handler', function() {
      expect(confirmStub).to.have.callCount(1);
    });
  });
});
