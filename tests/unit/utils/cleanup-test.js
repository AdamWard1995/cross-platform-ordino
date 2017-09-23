import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import sinon from 'sinon';

import cleanup from 'cross-platform-ordino/utils/cleanup';

describe('Unit / utils / cleanup', function () {

  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('deleteTerm()', function () {
    let item, otherItems, store;
    beforeEach(function () {
      item = {foo: 'foo'};
      otherItems = {bar: 'bar'};
      store = {qux: 'qux'};
      sandbox.stub(cleanup, 'normalizeIndices');
      sandbox.stub(cleanup, 'cleanupTerm');
      cleanup.deleteTerm(item, otherItems, store);
    });

    it('should normalize other term indices', function () {
      expect(cleanup.normalizeIndices).to.have.been.calledWithExactly(item, otherItems);
    });

    it('should have cleaned up child data of the term', function () {
      expect(cleanup.cleanupTerm).to.have.been.calledWithExactly(item, store);
    });
  });

  describe('cleanupTerm()', function () {
    let course1, course2, term, store;
    beforeEach(function () {
      course1 = {foo: 'foo'};
      course2 = {bar: 'bar'};
      term = Ember.Object.create({id: 12345, destroyRecord: sinon.stub()});
      store = {query: sinon.stub()};
      store.query.returns(new Ember.RSVP.Promise(function(resolve) {
        resolve({toArray: function () {return [course1, course2]}});
      }));
      sandbox.stub(cleanup, 'cleanupCourse');
      cleanup.cleanupTerm(term, store);
    });

    it('should have queried for courses belonging to the term', function () {
      expect(store.query).to.have.been.calledWithExactly('course', {orderBy: 'tid', equalTo: 12345});
    });

    it('should have cleaned up each course belonging to the term', function () {
      expect(cleanup.cleanupCourse, 'Should clean up first course').to.have.been.calledWithExactly(course1, store);
      expect(cleanup.cleanupCourse, 'Should clean up second course').to.have.been.calledWithExactly(course2, store);
    });

    it('should have destroyed the term record', function () {
      expect(term.get('destroyRecord')).to.have.callCount(1);
    });
  });

  describe('deleteCourse()', function () {
    let item, otherItems, store;
    beforeEach(function () {
      item = {foo: 'foo'};
      otherItems = {bar: 'bar'};
      store = {qux: 'qux'};
      sandbox.stub(cleanup, 'normalizeIndices');
      sandbox.stub(cleanup, 'cleanupCourse');
      cleanup.deleteCourse(item, otherItems, store);
    });

    it('should normalize other course indices', function () {
      expect(cleanup.normalizeIndices).to.have.been.calledWithExactly(item, otherItems);
    });

    it('should have cleaned up child data of the course', function () {
      expect(cleanup.cleanupCourse).to.have.been.calledWithExactly(item, store);
    });
  });

  describe('cleanupCourse()', function () {
    let class1, class2, work1, work2, course, store;
    beforeEach(function () {
      class1 = Ember.Object.create({id: 1, destroyRecord: sinon.stub()});
      class2 = Ember.Object.create({id: 1, destroyRecord: sinon.stub()});
      work1 = Ember.Object.create({id: 3, destroyRecord: sinon.stub()});
      work2 = Ember.Object.create({id: 4, destroyRecord: sinon.stub()});
      course = Ember.Object.create({id: 12345, destroyRecord: sinon.stub()});
      store = {query: sinon.stub()};
      store.query.withArgs('class-time', {orderBy: 'cid', equalTo: 12345}).returns(new Ember.RSVP.Promise(function(resolve) {
        resolve({toArray: function () {return [class1, class2]}});
      }));
      store.query.withArgs('course-work', {orderBy: 'cid', equalTo: 12345}).returns(new Ember.RSVP.Promise(function(resolve) {
        resolve({toArray: function () {return [work1, work2]}});
      }));
      cleanup.cleanupCourse(course, store);
    });

    it('should have queried for class times belonging to the course', function () {
      expect(store.query).to.have.been.calledWithExactly('class-time', {orderBy: 'cid', equalTo: 12345});
    });

    it('should have cleaned up each class time belonging to the course', function () {
      expect(class1.get('destroyRecord'), 'Should clean up first class time').to.have.callCount(1);
      expect(class2.get('destroyRecord'), 'Should clean up second class time').to.have.callCount(1);
    });

    it('should have cleaned up each work belonging to the course', function () {
      expect(work1.get('destroyRecord'), 'Should clean up first work').to.have.callCount(1);
      expect(work2.get('destroyRecord'), 'Should clean up second work').to.have.callCount(1);
    });

    it('should have destroyed the course record', function () {
      expect(course.get('destroyRecord')).to.have.callCount(1);
    });
  });

  describe('deleteCourseWork()', function () {
    let item, otherItems;
    beforeEach(function () {
      item = {destroyRecord: sinon.stub()};
      otherItems = {bar: 'bar'};
      sandbox.stub(cleanup, 'normalizeIndices');
      cleanup.deleteCourseWork(item, otherItems);
    });

    it('should normalize other course work indices', function () {
      expect(cleanup.normalizeIndices).to.have.been.calledWithExactly(item, otherItems);
    });

    it('should have destroyed the work record', function () {
      expect(item.destroyRecord).to.have.callCount(1);
    });
  });

  describe('normalizeIndices()', function () {
    let item, otherItems;
    beforeEach(function () {
      item = Ember.Object.create({index: 1});
      otherItems = [Ember.Object.create({index: 0}), Ember.Object.create({index: 2, save: sinon.stub()})];
      cleanup.normalizeIndices(item, otherItems);
    });

    it('should not have changed the index of the first item', function () {
      expect(otherItems[0].get('index')).to.eql(0);
    });

    it('should have changed the index of the second item', function () {
      expect(otherItems[1].get('index')).to.eql(1);
    });

    it('should have saved changes to the second item', function () {
      expect(otherItems[1].get('save')).to.have.callCount(1);
    });
  });
});
