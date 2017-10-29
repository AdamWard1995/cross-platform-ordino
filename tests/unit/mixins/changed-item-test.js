import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import ChangedItem from 'cross-platform-ordino/mixins/changed-item';

describe('Unit / mixins / changed-item', function () {

  let mixin, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    mixin = Ember.Object.extend(ChangedItem).create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('observeChanged', function () {
    beforeEach(function () {
      sandbox.stub(Ember.run, 'later');
    });

    describe('changed and reset', function () {
      beforeEach(function () {
        mixin.set('changed', 'foo');
        Ember.run.later.getCall(0).args[0]();
      });

      it('should reset changed item in 2 seconds', function () {
        expect(Ember.run.later).to.have.been.calledWithExactly(sinon.match.func, 2000);
      });

      it('should reset changed item to null', function () {
        expect(mixin.get('changed')).to.eql(null);
      });
    });

    describe('changed and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.set('changed', 'foo');
      });

      it('should not reset changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not changed and reset', function () {
      beforeEach(function () {
        mixin.set('changed', null);
      });

      it('should not reset changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not changed and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.set('changed', null);
      });

      it('should not reset changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });
  });

  describe('observeNew', function () {
    beforeEach(function () {
      sandbox.stub(Ember.run, 'later');
    });

    describe('new and reset', function () {
      beforeEach(function () {
        mixin.set('new', 'foo');
        Ember.run.later.getCall(0).args[0]();
      });

      it('should reset new item in 2 seconds', function () {
        expect(Ember.run.later).to.have.been.calledWithExactly(sinon.match.func, 2000);
      });

      it('should reset new item to null', function () {
        expect(mixin.get('new')).to.eql(null);
      });
    });

    describe('new and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.set('new', 'foo');
      });

      it('should not reset new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not new and reset', function () {
      beforeEach(function () {
        mixin.set('new', null);
      });

      it('should not reset new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not new and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.set('new', null);
      });

      it('should not reset new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });
  });
});
