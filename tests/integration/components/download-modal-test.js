import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('download-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{download-modal open=true}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.download-modal .modal:visible')).to.have.length(1);
    });

    it('should render default title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('Download application');
    });

    it('should render Windows label', function() {
      expect(this.$('.modal-body .os').eq(0).find('.os-name').text().trim()).to.eql('Windows')
    });

    it('should render Windows compatible versions', function() {
      expect(this.$('.modal-body .os').eq(0).find('.os-versions').text().trim()).to.eql('Compatible versions: 7, 8, 8.1, and 10')
    });

    it('should render Windows 32-bit link', function() {
      expect(this.$('.modal-body .os').eq(0).find('.os-links a').eq(0).text().trim()).to.eql('32-bit')
    });

    it('should render Windows 64-bit link', function() {
      expect(this.$('.modal-body .os').eq(0).find('.os-links a').eq(1).text().trim()).to.eql('64-bit')
    });

    it('should render close button', function() {
      expect(this.$('.btn-danger').text().trim()).to.eql('Close');
    });
  });

  describe('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{download-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.download-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly closes', function () {
    let closeStub;
    beforeEach(function () {
      closeStub = sinon.stub();
      this.set('onClose', closeStub);
      this.render(hbs`{{download-modal open=true onClose=onClose}}`);
      return wait().then(() => {
        this.$('.btn-danger').click();
        return wait();
      });
    })

    it('should have called close handler', function() {
      expect(closeStub).to.have.callCount(1);
    });
  });
});
