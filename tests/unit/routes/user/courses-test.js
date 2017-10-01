import Ember from 'ember';
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {route} from 'ember-test-utils/test-support/setup-test'

const test = route('user/courses')
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
    describe('user is not logged in', function () {
      beforeEach(function () {
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns(Ember.Object.create({}));
        sandbox.stub(route, 'transitionTo');
        route.model();
      });

      it('should have transitioned to home page', function () {
        expect(route.transitionTo).to.have.been.calledWithExactly('index');
      });
    });

    describe('user is logged in', function () {
      let model, user;
      beforeEach(function () {
        user = Ember.Object.create({id: 12345});
        sandbox.stub(route, 'modelFor')
          .withArgs('user').returns(user);
        route.store = {
          query: sinon.stub()
        };
        route.store.query.returns(new Ember.RSVP.Promise(function(resolve) {
          resolve({
            toArray: function () {
              return ['foo', 'bar', 'qux'];
            }
          });
        }));
        model = route.model();
      });

      it('should have queried for all user courses', function () {
        expect(route.store.query).to.have.been.calledWithExactly('course', {
          orderBy: 'uid',
          equalTo: 12345
        });
      });

      it('should have returned all the reponse courses', function () {
        expect(model._result).to.eql(['foo', 'bar', 'qux']);
      });
    });
  });
});
