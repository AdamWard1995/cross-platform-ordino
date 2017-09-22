import {expect} from 'chai';
import {describe, it} from 'mocha';
import {round} from 'cross-platform-ordino/helpers/round';

describe('Unit / helper / round', function () {

  describe('no parameters provided', function () {
    it('should return undefined', function () {
      expect(round()).to.eql(undefined);
    });
  });

  describe('first parameter is not a number', function () {
    it('should return undefined', function () {
      expect(round(['abc', 1])).to.eql(undefined);
    });
  });

  describe('second parameter is not a number', function () {
    it('should return 1', function () {
      expect(round([1.2345, 'a'])).to.eql('1');
    });
  });

  describe('only one parameter is provided', function () {
    it('should return 1.2345', function () {
      expect(round([1.2345])).to.eql('1');
    });
  });

  describe('round to one decimal place', function () {
    it('should return 1.2', function () {
      expect(round([1.2345, 1])).to.eql('1.2');
    });
  });

  describe('round to more decimal places than exist', function () {
    it('should return 1.200', function () {
      expect(round([1.2, 3])).to.eql('1.200');
    });
  });
});
