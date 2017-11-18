import Ember from 'ember';
import {getStatistics} from 'cross-platform-ordino/utils/course-statistics';

export default Ember.Route.extend({
  model () {
    const stats = getStatistics(this.modelFor('user.courses.course').courseWork)
    stats['course'] = this.modelFor('user.courses.course').course;
    this.set('titleToken', `${stats['course'].get('course-code')} Report`);
    return stats;
  },
  resetController (controller, isExiting) {
    if (isExiting) {
      controller.set('desired-grade', null);
    }
  }
});
