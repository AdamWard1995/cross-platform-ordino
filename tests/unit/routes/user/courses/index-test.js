import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/courses/index')
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
        .withArgs('user.courses').returns({foo: 'bar'});
      model = route.model();
    });

    it('should have returned parent route model', function () {
      expect(model).to.eql({foo: 'bar'});
    });
  });

  describe('setupController()', function () {
    let controller;
    beforeEach(function () {
      sandbox.stub(route, 'modelFor')
        .withArgs('user').returns(Ember.Object.create({id: 12345}));
      route.store = {
        query: sinon.stub()
      };
      route.store.query.returns(new Ember.RSVP.Promise(function(resolve) {
        resolve({
          toArray: function () {
            return ['baz', 'que'];
          }
        });
      }));
      controller = {set: sinon.stub()};
      route.setupController(controller, ['foo', 'bar', 'qux']);
    });

    it('should have queried for list of terms', function () {
      expect(route.store.query).to.have.been.calledWithExactly('term', {orderBy: 'uid', equalTo: 12345});
    });

    it('should have set list of courses', function () {
      expect(controller.set).to.have.been.calledWithExactly('courses', ['foo', 'bar', 'qux']);
    });

    it('should have set list of terms', function () {
      expect(controller.set).to.have.been.calledWithExactly('terms', ['baz', 'que']);
    });
  });
});
