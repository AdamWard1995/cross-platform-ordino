import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import {route} from 'ember-test-utils/test-support/setup-test';

const test = route('user/courses/course/index');
describe(test.label, function () {
  test.setup();

  let route, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    route = this.subject();
    sandbox.stub(route, 'modelFor')
      .withArgs('user.courses.course').returns({foo: 'bar'});
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('model()', function () {
    let model;
    beforeEach(function () {
      model = route.model();
    });

    it('should have returned parent route model data', function () {
      expect(model).to.eql({foo: 'bar'});
    });
  });
});
