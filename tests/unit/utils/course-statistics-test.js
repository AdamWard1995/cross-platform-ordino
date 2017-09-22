import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import {getStatistics} from 'cross-platform-ordino/utils/course-statistics';

const worksWithGrades = [
  Ember.Object.create({
    weight: 15,
    grade: 100
  }),
  Ember.Object.create({
    weight: 15,
    grade: 50
  }),
  Ember.Object.create({
    weight: 15
  }),
  Ember.Object.create({
    weight: 15,
    grade: 0
  })
];

const worksWithoutWeights = [
  Ember.Object.create({
    grade: 100
  }),
  Ember.Object.create({
    grade: 50
  })
];

const worksWithoutGrades = [
  Ember.Object.create({
    grade: 0
  }),
  Ember.Object.create({
    grade: 0
  })
];

describe('Unit / utils / course-statistics', function () {

  describe('work with weights and grades set', function () {
    let stats;
    beforeEach(function () {
      stats = getStatistics(worksWithGrades);
    });

    it('should have correct accumulated marks', function () {
      expect(stats.accumulatedMarks).to.eql(22.5);
    });

    it('should have correct completed weight', function () {
      expect(stats.completedWeight).to.eql(45);
    });

    it('should have correct lowest grade', function () {
      expect(stats.lowestGrade).to.eql(0);
    });

    it('should have correct highest grade', function () {
      expect(stats.highestGrade).to.eql(100);
    });

    it('should have correct median grade', function () {
      expect(stats.medianGrade).to.eql(50);
    });

    it('should have correct current average', function () {
      expect(stats.currentAvg).to.eql(50);
    });
  });

  describe('work without weights', function () {
    let stats;
    beforeEach(function () {
      stats = getStatistics(worksWithoutWeights);
    });

    it('should have correct accumulated marks', function () {
      expect(stats.accumulatedMarks).to.eql(0);
    });

    it('should have correct completed weight', function () {
      expect(stats.completedWeight).to.eql(0);
    });

    it('should have correct lowest grade', function () {
      expect(stats.lowestGrade).to.eql(0);
    });

    it('should have correct highest grade', function () {
      expect(stats.highestGrade).to.eql(0);
    });

    it('should have correct median grade', function () {
      expect(stats.medianGrade).to.eql(0);
    });

    it('should have correct current average', function () {
      expect(stats.currentAvg).to.eql(0);
    });
  });

  describe('work without grades', function () {
    let stats;
    beforeEach(function () {
      stats = getStatistics(worksWithoutGrades);
    });

    it('should have correct accumulated marks', function () {
      expect(stats.accumulatedMarks).to.eql(0);
    });

    it('should have correct completed weight', function () {
      expect(stats.completedWeight).to.eql(0);
    });

    it('should have correct lowest grade', function () {
      expect(stats.lowestGrade).to.eql(0);
    });

    it('should have correct highest grade', function () {
      expect(stats.highestGrade).to.eql(0);
    });

    it('should have correct median grade', function () {
      expect(stats.medianGrade).to.eql(0);
    });

    it('should have correct current average', function () {
      expect(stats.currentAvg).to.eql(0);
    });
  });
});
