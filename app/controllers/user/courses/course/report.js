import Ember from 'ember';
import {round} from 'cross-platform-ordino/helpers/round';

export default Ember.Controller.extend({
  chartData: Ember.computed('model', function() {
    return {
      labels: ['Earned', 'Lost', 'Remaining'],
      datasets: [{
        data: [
          round([this.get('model').earnedGrade, 1]),
          round([this.get('model').lostGrade, 1]),
          round([this.get('model').remainingWeight, 1])
        ],
        backgroundColor: ['DarkGreen', 'Maroon', 'MediumBlue'],
        hoverBackgroundColor: ['Green', 'Red', 'Blue']
      }]
    };
  }),
  'required-grade': Ember.computed('desired-grade', function() {
    const desired = this.get('desired-grade');
    if (desired) {
      return Math.max(0, round([this.get('model').remainingWeight > 0 ?
        (desired - this.get('model').accumulatedMarks) / this.get('model').remainingWeight * 100 : 0, 1]));
    } else {
      return '---';
    }
  }),
  actions: {
    goToCourseRoute () {
      this.transitionToRoute('user.courses.course', this.get('model').course.get('id'))
    }
  }
})
