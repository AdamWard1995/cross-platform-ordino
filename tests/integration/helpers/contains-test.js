import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration / helper / contains', function() {
  setupComponentTest('contains', {
    integration: true
  });

  describe('no parameters provided', function () {
    it('should return blank output', function () {
      this.render(hbs`{{contains}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('first parameter is not an array', function () {
    it('should return blank output', function () {
      this.render(hbs`{{contains 'abc' 'a'}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('only array parameter is provided', function () {
    it('should return blank output', function () {
      this.set('inputValue', ['a', 'b', 'c']);
      this.render(hbs`{{contains inputValue}}`);
      expect(this.$().text().trim()).to.equal('');
    });
  });

  describe('second parameter is in the array', function () {
    it('should return true', function () {
      this.set('inputValue', ['a', 'b', 'c']);
      this.render(hbs`{{contains inputValue 'a'}}`);
      expect(this.$().text().trim()).to.equal('true');
    });
  });

  describe('second parameter is NOT in the array', function () {
    it('should return false', function () {
      this.set('inputValue', ['a', 'b', 'c']);
      this.render(hbs`{{contains inputValue 'd'}}`);
      expect(this.$().text().trim()).to.equal('false');
    });
  });
});
