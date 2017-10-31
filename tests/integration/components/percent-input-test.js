import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('percent-input');
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    describe('no value provided', function () {
      beforeEach(function () {
        this.render(hbs`{{percent-input}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should not display popover initially', function() {
        expect(this.$('.fraction-popover:visible')).to.have.length(0);
      });

      it('should render percent text box', function() {
        expect(this.$('.percent')).to.have.length(1);
      });

      it('should have percent text box empty', function() {
        expect(this.$('.percent').text().trim()).to.eql('');
      });

      it('should render popover button', function() {
        expect(this.$('.popover-button')).to.have.length(1);
      });

      describe('open popover', function () {
        beforeEach(function () {
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait();
          });
        });

        it('should display popover', function() {
          expect(this.$('.fraction-popover:visible')).to.have.length(1);
        });

        it('should render numerator text box', function() {
          expect(this.$('.fraction-popover .numerator')).to.have.length(1);
        });

        it('should render denominator text box', function() {
          expect(this.$('.fraction-popover .denominator')).to.have.length(1);
        });
      });
    });

    describe('value provided', function () {
      beforeEach(function () {
        this.render(hbs`{{percent-input percent=90}}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should not display popover initially', function() {
        expect(this.$('.fraction-popover:visible')).to.have.length(0);
      });

      it('should render percent text box', function() {
        expect(this.$('.percent')).to.have.length(1);
      });

      it('should have rendered value in percent text box', function() {
        expect(this.$('.percent').val().trim()).to.eql('90');
      });

      it('should render popover button', function() {
        expect(this.$('.popover-button')).to.have.length(1);
      });

      describe('open popover', function () {
        beforeEach(function () {
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait();
          });
        });

        it('should display popover', function() {
          expect(this.$('.fraction-popover:visible')).to.have.length(1);
        });

        it('should render numerator text box', function() {
          expect(this.$('.fraction-popover .numerator')).to.have.length(1);
        });

        it('should render denominator text box', function() {
          expect(this.$('.fraction-popover .denominator')).to.have.length(1);
        });
      });
    });
  });

  describe('enter value', function () {
    describe('enter into textbox', function () {
      beforeEach(function () {
        this.set('percent', null);
        this.render(hbs`{{percent-input percent=percent}}`);
        return wait().then(() => {
          this.$('.percent').val('90').change();
          return wait();
        });
      });

      it('should have updated parameter value', function() {
        expect(this.get('percent')).to.eql('90');
      });
    });

    describe('enter into fraction popover', function () {
      describe('no numerator entered', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.denominator').val('5').change();
              return wait();
            });
          });
        });

        it('should not have updated parameter value', function() {
          expect(this.get('percent')).to.eql(null);
        });
      });

      describe('no denominator entered', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('4').change();
              return wait();
            });
          });
        });

        it('should not have updated parameter value', function() {
          expect(this.get('percent')).to.eql(null);
        });
      });

      describe('numerator entered is negative', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('-1').change();
              this.$('.denominator').val('5').change();
              return wait();
            });
          });
        });

        it('should not have updated parameter value', function() {
          expect(this.get('percent')).to.eql(null);
        });
      });

      describe('denominator entered is negative', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('4').change();
              this.$('.denominator').val('-1').change();
              return wait();
            });
          });
        });

        it('should not have updated parameter value', function() {
          expect(this.get('percent')).to.eql(null);
        });
      });

      describe('denominator entered is 0', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('4').change();
              this.$('.denominator').val('0').change();
              return wait();
            });
          });
        });

        it('should not have updated parameter value', function() {
          expect(this.get('percent')).to.eql(null);
        });
      });

      describe('numerator entered is 0', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('0').change();
              this.$('.denominator').val('5').change();
              return wait();
            });
          });
        });

        it('should have updated parameter value to 0.0', function() {
          expect(this.get('percent')).to.eql('0.0');
        });
      });

      describe('numerator and denominator are positive', function () {
        beforeEach(function () {
          this.set('percent', null);
          this.render(hbs`{{percent-input percent=percent}}`);
          return wait().then(() => {
            this.$('.popover-button').click();
            return wait().then(() => {
              this.$('.numerator').val('4').change();
              this.$('.denominator').val('5').change();
              return wait();
            });
          });
        });

        it('should have updated parameter to 80.0', function() {
          expect(this.get('percent')).to.eql('80.0');
        });
      });
    });
  });
});
