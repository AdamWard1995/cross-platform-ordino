import {expect} from 'chai';
import {describe, it} from 'mocha';
import {sub} from 'cross-platform-ordino/helpers/sub';

describe('Unit / helper / sub', function () {

  describe('no parameters provided', function () {
    it('should return undefined', function () {
      expect(sub()).to.eql(undefined);
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      expect(sub([6])).to.eql(6);
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 3', function () {
      expect(sub([6, 3])).to.eql(3);
    });
    it('should return 1', function () {
      expect(sub([6, 3, 2])).to.eql(1);
    });
  });

  describe('parameters are not numbers', function () {
    it('should return NaN', function () {
      expect(sub(['a', 'b'])).to.eql(NaN);
    });
  });
});
