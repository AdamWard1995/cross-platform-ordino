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

  describe('addChanged', function () {
    beforeEach(function () {
      sandbox.stub(Ember.run, 'later');
    });

    describe('changed item and reset', function () {
      beforeEach(function () {
        mixin.addChanged('foo');
      });

      it('should only have one changed item', function () {
        expect(mixin.get('changed')).to.have.length(1);
      });

      it('should add changed item', function () {
        expect(mixin.get('changed').includes('foo')).to.eql(true);
      });

      describe('item removed from changed items', function () {
        beforeEach(function () {
          Ember.run.later.getCall(0).args[0]();
        });

        it('should remove changed item in 2 seconds', function () {
          expect(Ember.run.later).to.have.been.calledWithExactly(sinon.match.func, 2000);
        });

        it('should remove changed item', function () {
          expect(mixin.get('changed')).to.have.length(0);
        });
      });
    });

    describe('changed item and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.addChanged('foo');
      });

      it('should have no changed items', function () {
        expect(mixin.get('changed')).to.have.length(0);
      });

      it('should not have added changed item', function () {
        expect(mixin.get('changed').includes('foo')).to.eql(false);
      });

      it('should not have removed changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not changed item and reset', function () {
      beforeEach(function () {
        mixin.addChanged(null);
      });

      it('should have no changed items', function () {
        expect(mixin.get('changed')).to.have.length(0);
      });

      it('should not have added changed item', function () {
        expect(mixin.get('changed').includes(null)).to.eql(false);
      });

      it('should not have removed changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not changed item and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.addChanged(null);
      });

      it('should have no changed items', function () {
        expect(mixin.get('changed')).to.have.length(0);
      });

      it('should not have added changed item', function () {
        expect(mixin.get('changed').includes(null)).to.eql(false);
      });

      it('should not reset changed item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });
  });

  describe('addNew', function () {
    beforeEach(function () {
      sandbox.stub(Ember.run, 'later');
    });

    describe('new item and reset', function () {
      beforeEach(function () {
        mixin.addNew('foo');
      });

      it('should only have one new item', function () {
        expect(mixin.get('new')).to.have.length(1);
      });

      it('should add new item', function () {
        expect(mixin.get('new').includes('foo')).to.eql(true);
      });

      describe('item removed from changed items', function () {
        beforeEach(function () {
          Ember.run.later.getCall(0).args[0]();
        });

        it('should removed new item in 2 seconds', function () {
          expect(Ember.run.later).to.have.been.calledWithExactly(sinon.match.func, 2000);
        });

        it('should removed new item to null', function () {
          expect(mixin.get('new')).to.have.length(0);
        });
      });
    });

    describe('new item and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.addNew('foo');
      });

      it('should have no new items', function () {
        expect(mixin.get('new')).to.have.length(0);
      });

      it('should not have added new item', function () {
        expect(mixin.get('new').includes('foo')).to.eql(false);
      });

      it('should not removed new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not new item and reset', function () {
      beforeEach(function () {
        mixin.addNew(null);
      });

      it('should have no new items', function () {
        expect(mixin.get('new')).to.have.length(0);
      });

      it('should not have added new item', function () {
        expect(mixin.get('new').includes('foo')).to.eql(false);
      });

      it('should not remove new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });

    describe('not new item and not reset', function () {
      beforeEach(function () {
        mixin.set('reset', false);
        mixin.addNew(null);
      });

      it('should have no new items', function () {
        expect(mixin.get('new')).to.have.length(0);
      });

      it('should not have added new item', function () {
        expect(mixin.get('new').includes('foo')).to.eql(false);
      });

      it('should not removed new item', function () {
        expect(Ember.run.later).to.have.callCount(0);
      });
    });
  });
});
