import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('version-modal');
describe(test.label, function () {
  test.setup();

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{version-modal open=true}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should be visible', function() {
      expect(this.$('.version-modal .modal:visible')).to.have.length(1);
    });

    it('should render default title', function() {
      expect(this.$('.modal-title').text().trim()).to.eql('About');
    });

    it('should render app name', function() {
      expect(this.$('.app-name')).to.have.length(1);
    });

    it('should render about details', function() {
      expect(this.$('.about-details')).to.have.length(1);
    });

    it('should render app description', function() {
      expect(this.$('.about-description')).to.have.length(1);
    });

    it('should render report issue button', function() {
      expect(this.$('.btn-primary').text().trim()).to.eql('Report issue');
    });
  });

  describe.skip('properly hides modal', function () {
    beforeEach(function () {
      this.render(hbs`{{version-modal open=false}}`);
      return wait();
    });

    it('should not be visible', function() {
      expect(this.$('.version-modal .modal:visible')).to.have.length(0);
    });
  });

  describe('properly closes', function () {
    let closeStub;
    beforeEach(function () {
      closeStub = sinon.stub();
      this.set('onClose', closeStub);
      this.render(hbs`{{version-modal open=true onClose=onClose}}`);
      return wait().then(() => {
        this.$('.close').click();
        return wait();
      });
    })

    it('should have called close handler', function() {
      expect(closeStub).to.have.callCount(1);
    });
  });
});
