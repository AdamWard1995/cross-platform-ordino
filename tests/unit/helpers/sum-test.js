import {expect} from 'chai';
import {describe, it} from 'mocha';
import {sum} from 'cross-platform-ordino/helpers/sum';

describe('Unit / helper / sum', function () {

  describe('no parameters provided', function () {
    it('should return undefined', function () {
      expect(sum()).to.eql(undefined);
    });
  });

  describe('only one number is provided', function () {
    it('should return 6', function () {
      expect(sum([6])).to.eql(6);
    });
  });

  describe('multiple numbers are provided', function () {
    it('should return 9', function () {
      expect(sum([6, 3])).to.eql(9);
    });
    it('should return 11', function () {
      expect(sum([6, 3, 2])).to.eql(11);
    });
  });
});
