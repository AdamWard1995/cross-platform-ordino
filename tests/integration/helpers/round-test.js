import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration / helper / round', function() {
  setupComponentTest('round', {
    integration: true
  });

  describe('no parameters provided', function () {
    it('should return blank output', function () {
      this.render(hbs`{{round}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('first parameter is not a number', function () {
    it('should return undefined', function () {
      this.render(hbs`{{round 'abc' 1}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('second parameter is not a number', function () {
    it('should return 1', function () {
      this.render(hbs`{{round 1.2345 'a'}}`);
      expect(this.$().text().trim()).to.equal('1');
    });
  });

  describe('only one number is provided', function () {
    it('should return 1', function () {
      this.render(hbs`{{round 1.2345}}`);
      expect(this.$().text().trim()).to.equal('1');
    });
  });

  describe('round to one decimal place', function () {
    it('should return 1.2', function () {
      this.render(hbs`{{round 1.2345 1}}`);
      expect(this.$().text().trim()).to.equal('1.2');
    });
  });

  describe('round to more decimal places than exist', function () {
    it('should return 1.200', function () {
      this.render(hbs`{{round 1.2 3}}`);
      expect(this.$().text().trim()).to.equal('1.200');
    });
  });
});
