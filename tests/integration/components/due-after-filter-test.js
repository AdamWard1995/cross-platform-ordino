import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

const test = integration('due-after-filter')
describe(test.label, function () {
  test.setup();

  describe('no date entered', function () {
    beforeEach(function () {
      this.render(hbs`{{due-after-filter}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have due-after-filter class', function () {
      expect(this.$('.due-after-filter')).to.have.length(1);
    });

    it('should have correct placeholder', function () {
      expect(this.$('.due-after-filter .ember-text-field').attr('placeholder')).to.eql('Due after');
    });

    it('should be empty', function () {
      expect(this.$('.due-after-filter .ember-text-field').val()).to.eql('');
    });
  });

  describe('date entered', function () {
    beforeEach(function () {
      this.render(hbs`{{due-after-filter value=(moment 'September 28th 2017' 'MMMM Do YYYY')}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have due-after-filter class', function () {
      expect(this.$('.due-after-filter')).to.have.length(1);
    });

    it('should render initial value', function () {
      expect(this.$('.due-after-filter .ember-text-field').val()).to.eql('September 28th 2017');
    });
  });

  describe('change entered date', function () {
    beforeEach(function () {
      this.set('value', moment('September 28th 2017', 'MMMM Do YYYY'));
      this.render(hbs`{{due-after-filter value=value}}`);
      return wait().then(() => {
        this.$('.due-after-filter .input-group-addon').click();
        return wait().then(() => {
          this.$('.next').click();
          return wait().then(() => {
            this.$('.day').eq(10).click();
            return wait();
          });
        });
      });
    });

    it('should have set value', function () {
      expect(this.get('value').format('MMMM Do YYYY')).to.eql('January 10th 2018');
    });
  });
});