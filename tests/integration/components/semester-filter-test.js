import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('semester-filter')
describe(test.label, function () {
  test.setup();

  describe('no semester selected', function () {
    beforeEach(function () {
      this.render(hbs`{{semester-filter}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have default option selected', function () {
      expect(this.$('.semester-filter select :selected').text()).to.eql('Semester');
    });
  });

  describe('a semester is selected', function () {
    beforeEach(function () {
      this.render(hbs`{{semester-filter value='Fall'}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have default option selected', function () {
      expect(this.$('.semester-filter select :selected').text()).to.eql('Fall');
    });
  });

  describe('change semester selection', function () {
    beforeEach(function () {
      this.render(hbs`{{semester-filter value=value}}`);
      return wait().then(() => {
        this.$('.semester-filter select').val('Winter').change();
        return wait();
      });
    });

    it('should have \'Winter\' option selected', function () {
      expect(this.$('.semester-filter select :selected').text()).to.eql('Winter');
    });

    it('should have set filter value', function () {
      expect(this.get('value')).to.eql('Winter');
    });
  });
});
