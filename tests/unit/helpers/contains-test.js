import {expect} from 'chai';
import {describe, it} from 'mocha';
import {contains} from 'cross-platform-ordino/helpers/contains';

describe('Unit / helper / contains', function () {

  describe('no parameters provided', function () {
    it('should return undefined', function () {
      expect(contains()).to.eql(undefined);
    });
  });

  describe('first parameter is not an array', function () {
    it('should return undefined', function () {
      expect(contains(['abc', 'a'])).to.eql(undefined);
    });
  });

  describe('only array parameter is provided', function () {
    it('should return undefined', function () {
      expect(contains([['a', 'b', 'c']])).to.eql(undefined);
    });
  });

  describe('second parameter is in the array', function () {
    it('should return true', function () {
      expect(contains([['a', 'b', 'c'], 'a'])).to.eql(true);
    });
  });

  describe('second parameter is NOT in the array', function () {
    it('should return false', function () {
      expect(contains([['a', 'b', 'c'], 'd'])).to.eql(false);
    });
  });
});
