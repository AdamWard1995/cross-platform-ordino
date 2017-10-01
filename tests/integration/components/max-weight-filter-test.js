import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('max-weight-filter')
describe(test.label, function () {
  test.setup();

  describe('no weight entered', function () {
    beforeEach(function () {
      this.render(hbs`{{max-weight-filter}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have max-weight-filter class', function () {
      expect(this.$('.max-weight-filter')).to.have.length(1);
    });

    it('should have correct placeholder', function () {
      expect(this.$('.max-weight-filter .ember-text-field').attr('placeholder')).to.eql('Maximum weight (%)');
    });

    it('should be empty', function () {
      expect(this.$('.max-weight-filter .ember-text-field').val()).to.eql('');
    });
  });

  describe('no weight entered', function () {
    beforeEach(function () {
      this.render(hbs`{{max-weight-filter value=30}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have max-weight-filter class', function () {
      expect(this.$('.max-weight-filter')).to.have.length(1);
    });

    it('should be empty', function () {
      expect(this.$('.max-weight-filter .ember-text-field').val()).to.eql('30');
    });
  });

  describe('change entered weight', function () {
    beforeEach(function () {
      this.render(hbs`{{max-weight-filter value=value}}`);
      return wait().then(() => {
        this.$('.max-weight-filter .ember-text-field').val(50).change();
        return wait();
      });
    });

    it('should have set value', function () {
      expect(this.get('value')).to.eql('50');
    });
  });
});
