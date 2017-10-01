import Ember from 'ember';
import {round} from 'cross-platform-ordino/helpers/round';

export default Ember.Controller.extend({
  chartData: Ember.computed('model', function() {
    return {
      labels: ['Earned', 'Lost', 'Remaining'],
      datasets: [{
        data: [
          round([this.get('model').accumulatedMarks, 1]),
          round([this.get('model').completedWeight - this.get('model').accumulatedMarks, 1]),
          round([100 - this.get('model').completedWeight, 1])
        ],
        backgroundColor: ['DarkGreen', 'Maroon', 'MediumBlue'],
        hoverBackgroundColor: ['Green', 'Red', 'Blue']
      }]
    };
  }),
  'required-grade': Ember.computed('desired-grade', function() {
    const desired = this.get('desired-grade');
    if (desired) {
      return Math.max(0, round([(desired - this.get('model').accumulatedMarks) / (100 - this.get('model').completedWeight) * 100, 1]));
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
