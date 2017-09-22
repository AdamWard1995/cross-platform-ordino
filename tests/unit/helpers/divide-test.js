import {expect} from 'chai';
import {describe, it} from 'mocha';
import {divide} from 'cross-platform-ordino/helpers/divide';

describe('Unit / helper / divide', function () {

  describe('no parameters provided', function () {
    it('should return undefined', function () {
      expect(divide()).to.eql(undefined);
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      expect(divide([6])).to.eql(6);
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 2', function () {
      expect(divide([6, 3])).to.eql(2);
    });
    it('should return 1', function () {
      expect(divide([6, 3, 2])).to.eql(1);
    });
  });

  describe('parameters are not numbers', function () {
    it('should return NaN', function () {
      expect(divide(['a', 'b'])).to.eql(NaN);
    });
  });
});
