import Day from 'cross-platform-ordino/enums/day';

import FormModal from 'cross-platform-ordino/components/form-modal';

export default FormModal.extend({
  title: 'Create course',
  class: 'create-course-modal',
  createClassTimes: false,
  days: [Day.SUNDAY, Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY],
  selectedDays: [],
  actions: {
    close () {
      const onClose = this.get('onClose');
      if (onClose) {
        onClose();
      }
    },
    submit () {
      const courseCode = this.get('course-code');
      const location = this.get('location') || 'N/A';
      const startTime = this.get('start-time');
      const endTime = this.get('end-time');
      const term = this.get('term');
      const days = [];
      if (!courseCode) {
        this.set('errorMessage', 'You need to enter a course code.')
        return;
      } else if (this.get('createClassTimes') && (!startTime || !endTime || !startTime.isBefore(endTime))) {
        this.set('errorMessage', 'You need to enter a start time that is before the end time.')
        return;
      }

      let startTimeStr, endTimeStr;
      if (this.get('createClassTimes')) {
        this.get('selectedDays').forEach((day) => {
          days.push(day);
        });
        startTimeStr = startTime.format('hh:mm a');
        endTimeStr = endTime.format('hh:mm a');
      } else {
        startTimeStr = null;
        endTimeStr = null;
      }

      const onSubmit = this.get('onSubmit');
      if (onSubmit) {
        onSubmit(courseCode, location, startTimeStr, endTimeStr, days, term);
      }
    }
  }
});
