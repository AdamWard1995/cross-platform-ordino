import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration / helper / divide', function() {
  setupComponentTest('divide', {
    integration: true
  });

  describe('no parameters provided', function () {
    it('should return blank output', function () {
      this.render(hbs`{{divide}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      this.render(hbs`{{divide 6}}`);
      expect(this.$().text().trim()).to.equal('6');
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 2', function () {
      this.render(hbs`{{divide 6 3}}`);
      expect(this.$().text().trim()).to.equal('2');
    });
    it('should return 1', function () {
      this.render(hbs`{{divide 6 3 2}}`);
      expect(this.$().text().trim()).to.equal('1');
    });
  });

  describe('parameters are not numbers', function () {
    it('should return NaN', function () {
      this.render(hbs`{{divide 'a' 'b'}}`);
      expect(this.$().text().trim()).to.equal('NaN');
    });
  });
});
