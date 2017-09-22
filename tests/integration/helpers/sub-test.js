import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration / helper / sub', function() {
  setupComponentTest('sub', {
    integration: true
  });

  describe('no parameters provided', function () {
    it('should return blank output', function () {
      this.render(hbs`{{sub}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      this.render(hbs`{{sub 6}}`);
      expect(this.$().text().trim()).to.equal('6');
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 3', function () {
      this.render(hbs`{{sub 6 3}}`);
      expect(this.$().text().trim()).to.equal('3');
    });
    it('should return 1', function () {
      this.render(hbs`{{sub 6 3 2}}`);
      expect(this.$().text().trim()).to.equal('1');
    });
  });

  describe('parameters are not numbers', function () {
    it('should return NaN', function () {
      this.render(hbs`{{sub 'a' 'b'}}`);
      expect(this.$().text().trim()).to.equal('NaN');
    });
  });
});
