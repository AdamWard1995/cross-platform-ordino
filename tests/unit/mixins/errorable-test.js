import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';

import Errorable from 'cross-platform-ordino/mixins/errorable';

describe('Unit / mixins / errorable', function () {

  let mixin;
  beforeEach(function () {
    mixin = Ember.Object.extend(Errorable).create();
  });

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('no error message set', function () {
        beforeEach(function () {
          mixin.set('errorMessage', '');
        });

        it('should use is-gone as class', function () {
          expect(mixin.get('errorMessageClass')).to.eql('is-gone');
        });
      });

      describe('an error message is set', function () {
        beforeEach(function () {
          mixin.set('errorMessage', 'There has been an error!');
        });

        it('should use is-visible as class', function () {
          expect(mixin.get('errorMessageClass')).to.eql('is-visible');
        });
      });
    });
  });
});
