import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/categories')
describe(test.label, function () {
  test.setup()

  let route, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    let model;
    beforeEach(function () {
      sandbox.stub(route, 'modelFor')
        .withArgs('user').returns({
          categories: 'foo',
          courseWork: 'bar'
        });
      model = route.model();
    });

    it('should have returned all user categories and course work', function () {
      expect(model).to.eql({categories: 'foo', courseWork: 'bar'});
    });
  });
});
