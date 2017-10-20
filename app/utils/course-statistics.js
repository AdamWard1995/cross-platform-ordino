import Ember from 'ember';

export function getStatistics(works) {
  const graded = works.filter((item) => {
    return !Ember.isNone(item.get('grade')) && !Ember.isNone(item.get('weight'));
  }).sortBy('grade');
  let accumulatedMarks = 0;
  let completedWeight = 0;
  graded.forEach((work) => {
    accumulatedMarks += (work.get('weight') / 100) * work.get('grade');
    completedWeight += work.get('weight');
  });

  let lowestGrade = 0;
  let highestGrade = 0;
  let medianGrade = 0;
  if (graded.length > 0) {
    lowestGrade = graded[0].get('grade');
    highestGrade = graded[graded.length - 1].get('grade');
    medianGrade = graded[Math.floor(graded.length / 2)].get('grade');
  }

  let currentAvg = 0;
  let divisibleWeight = Math.min(100, completedWeight)
  if (accumulatedMarks !== 0 && completedWeight !== 0) {
    currentAvg = (accumulatedMarks / divisibleWeight) * 100;
  }

  let earnedGrade = Math.min(100, accumulatedMarks);
  let lostGrade = Math.max(0, completedWeight - accumulatedMarks);
  let remainingWeight = Math.max(0, 100 - completedWeight);
  let maximumGrade = accumulatedMarks + remainingWeight;
  let minimumGrade = accumulatedMarks;

  return {
    earnedGrade,
    lostGrade,
    remainingWeight,
    accumulatedMarks,
    completedWeight,
    lowestGrade,
    highestGrade,
    medianGrade,
    currentAvg,
    maximumGrade,
    minimumGrade
  }
}
