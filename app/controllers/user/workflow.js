import Ember from 'ember';
import moment from 'moment';

import ChangedItemMixin from 'cross-platform-ordino/mixins/changed-item';
import {normalizeIndices} from 'cross-platform-ordino/utils/cleanup';

const {A} = Ember;
const DATE_FORMAT = 'MMMM Do YYYY';

export default Ember.Controller.extend(ChangedItemMixin, {
  reset: false,
  haveCurrentTerm: Ember.computed('model.no-current-term', function() {
    return !this.get('model')['no-current-term'];
  }),
  listItems: Ember.computed('model.workByCourse.[]', function() {
    const workByCourse = this.get('model').workByCourse;
    const categories = this.get('model').categories;
    const now = moment();
    if (workByCourse && workByCourse.length > 0 && workByCourse[0].course) {
      const workByDay = {};
      workByCourse.forEach((grouping) => {
        grouping.courseWork.forEach((work) => {
          const dueDate = moment(work.get('due'));
          if (now.isBefore(dueDate)) {
            const dueDateStr = dueDate.format(DATE_FORMAT);
            const filteredCategory = categories.filterBy('id', work.get('cgyid'));
            const category = filteredCategory.length == 1 ? filteredCategory[0] : null;
            if (workByDay[dueDateStr]) {
              workByDay[dueDateStr].push({course: grouping.course, work, category});
            } else {
              workByDay[dueDateStr] = [{course: grouping.course, work, category}];
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
        return moment(a.group, DATE_FORMAT) - moment(b.group, DATE_FORMAT);
      });
      return toReturn;
    }
    return [];
  }),
  categories: Ember.computed('model.categories.[]', function() {
    const categories = A(this.get('model').categories.slice());
    return categories;
  }),
  courses: Ember.computed('model.workByCourse.[]', function() {
    const workByCourse = A(this.get('model').workByCourse.slice());
    let courses = A();
    workByCourse.forEach((workByCourse) => {
      if (!courses.includes(workByCourse.course)) {
        courses.push(workByCourse.course);
      }
    });
    courses = courses.sortBy('course-code');
    return courses;
  }),
  changed: Ember.computed('changedID', 'listItems', function() {
    const changedID = this.get('changedID');
    if (changedID) {
      const item = this.get('model').allWork.filterBy('id', changedID)[0];
      if (item) {
        const group = this.get('listItems').filterBy('group', moment(item.get('due')).format(DATE_FORMAT))[0];
        if (group && group.items) {
          return group.items.filterBy('work.id', item.get('id'))[0];
        }
      }
    }
  }),
  categoryValidator (date, item, categoryID) {
    return !categoryID || item.work.get('cgyid') === categoryID;
  },
  courseValidator (date, item, courseID) {
    return !courseID || item.work.get('cid') === courseID;
  },
  dueAfterValidator (date, item, selectedDate) {
    return !selectedDate || moment(selectedDate).isBefore(moment(date, DATE_FORMAT));
  },
  dueBeforeValidator (date, item, selectedDate) {
    return !selectedDate || moment(selectedDate).isAfter(moment(date, DATE_FORMAT));
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
      this.set('changedID', null);
      this.set('editCourseWork', true);
    },
    hideEditCourseWorkModal () {
      this.set('editCourseWork', false);
      this.set('itemToEdit', null);
    },
    editCourseWork (label, weight, grade, due, cgyid, cid) {
      const itemToEdit = this.get('itemToEdit');
      const model = this.get('model');
      if (itemToEdit.get('cid') !== cid) {
        const newIndex = model.allWork.filterBy('cid', cid).length
        normalizeIndices(itemToEdit, model.allWork.filterBy('cid', itemToEdit.get('cid')));
        itemToEdit.set('index', newIndex);
        itemToEdit.set('cid', cid);
      }
      itemToEdit.set('label', label);
      itemToEdit.set('weight', weight);
      itemToEdit.set('grade', grade);
      itemToEdit.set('due', due);
      itemToEdit.set('cgyid', cgyid);
      itemToEdit.set('cid', cid);

      if (Object.keys(itemToEdit.changedAttributes()).length > 0) {
        this.set('changedID', itemToEdit.get('id'));
      }

      itemToEdit.save().then(() => {
        this.send('refreshModel');
        Ember.run.later(this, () => {
          this.set('changedID', null);
        }, 2000);
      });
      this.send('hideEditCourseWorkModal');
    }
  }
});
