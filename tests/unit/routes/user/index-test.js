import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/index')
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
          courses: 'foo',
          terms: 'bar',
          courseWork: 'baz',
          classTimes: 'qux',
          categories: 'boo',
          user: 'cdr'
        });
      model = route.model();
    });

    it('should have returned all user courses, terms, course work, class times, categories, and personal information for the user', function () {
      expect(model).to.eql({
        courses: 'foo',
        terms: 'bar',
        courseWork: 'baz',
        classTimes: 'qux',
        categories: 'boo',
        user: 'cdr'
      });
    });
  });
});
