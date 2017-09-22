import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration / helper / sum', function() {
  setupComponentTest('sum', {
    integration: true
  });

  describe('no parameters provided', function () {
    it('should return blank output', function () {
      this.render(hbs`{{sum}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      this.render(hbs`{{sum 6}}`);
      expect(this.$().text().trim()).to.equal('6');
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 9', function () {
      this.render(hbs`{{sum 6 3}}`);
      expect(this.$().text().trim()).to.equal('9');
    });
    it('should return 11', function () {
      this.render(hbs`{{sum 6 3 2}}`);
      expect(this.$().text().trim()).to.equal('11');
    });
  });
});
