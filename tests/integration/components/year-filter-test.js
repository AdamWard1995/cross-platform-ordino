import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('year-filter')
describe(test.label, function () {
  test.setup();

  describe('no year entered', function () {
    beforeEach(function () {
      this.render(hbs`{{year-filter}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have correct placeholder', function () {
      expect(this.$('.year-filter .ember-text-field').attr('placeholder')).to.eql('Year');
    });

    it('should be empty', function () {
      expect(this.$('.year-filter .ember-text-field').val()).to.eql('');
    });
  });

  describe('year entered', function () {
    beforeEach(function () {
      this.render(hbs`{{year-filter value=2017}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render initial value', function () {
      expect(this.$('.year-filter .ember-text-field').val()).to.eql('2017');
    });
  });

  describe('change entered year', function () {
    beforeEach(function () {
      this.render(hbs`{{year-filter value=value}}`);
      return wait().then(() => {
        this.$('.year-filter .ember-text-field').val(2017).change();
        return wait();
      });
    });

    it('should have set value', function () {
      expect(this.get('value')).to.eql('2017');
    });
  });
});
