import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  listItems: Ember.computed('model.[].course', function() {
    const workByCourse = this.get('model');
    const now = moment();
    if (workByCourse && workByCourse.length > 0 && workByCourse[0].course) {
      const workByDay = {};
      workByCourse.forEach((grouping) => {
        grouping.courseWork.forEach((work) => {
          const dueDate = moment(work.get('due'));
          if (now.isBefore(dueDate)) {
            const dueDateStr = dueDate.format('MMMM Do YYYY');
            if (workByDay[dueDateStr]) {
              workByDay[dueDateStr].push({course: grouping.course, work});
            } else {
              workByDay[dueDateStr] = [{course: grouping.course, work}];
            }
          }
        });
      });
      const toReturn = [];
      for (let key in workByDay) {
        toReturn.push({group: key, items: workByDay[key]
          .sort((a, b) => {
            return moment(a.work.get('due')) - moment(b.work.get('due'));
          })
        })
      }
      toReturn.sort((a, b) => {
        return moment(a.group, 'MMMM Do YYYY') - moment(b.group, 'MMMM Do YYYY');
      });
      return toReturn;
    }
    return [];
  }),
  dueAfterValidator (date, item, selectedDate) {
    return !selectedDate || moment(selectedDate).isBefore(moment(date, 'MMMM Do YYYY'));
  },
  dueBeforeValidator (date, item, selectedDate) {
    return !selectedDate || moment(selectedDate).isAfter(moment(date, 'MMMM Do YYYY'));
  },
  minWeightValidator (date, item, weight) {
    return !weight || item.work.get('weight') >= weight;
  },
  maxWeightValidator (date, item, weight) {
    return !weight || item.work.get('weight') <= weight;
  },
  actions: {
    showEditCourseWorkModal (item) {
      this.set('itemToEdit', item.work);
      this.set('editCourseWork', true);
    },
    hideEditCourseWorkModal () {
      this.set('editCourseWork', false);
      this.set('itemToEdit', null);
    },
    editCourseWork (label, weight, grade, due) {
      this.get('itemToEdit').set('label', label);
      this.get('itemToEdit').set('weight', weight);
      this.get('itemToEdit').set('grade', grade);
      this.get('itemToEdit').set('due', due);
      this.get('itemToEdit').save().then(() => {
        this.send('refreshModel');
      });
      this.send('hideEditCourseWorkModal');
    }
  }
});
