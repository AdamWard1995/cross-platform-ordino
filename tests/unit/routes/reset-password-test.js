import {expect} from 'chai'
import {beforeEach, describe, it} from 'mocha'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('reset-password');
describe(test.label, function () {
  test.setup();

  let route;
  beforeEach(function () {
    route = this.subject();
  });

  describe('model()', function () {
    it('should return empty model', function () {
      expect(route.model()).to.eql({});
    });
  });
});
