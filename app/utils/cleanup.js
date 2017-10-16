const _this = {
  deleteTerm (term, otherTerms, store) {
    _this.normalizeIndices(term, otherTerms);
    _this.cleanupTerm(term, store);
  },

  cleanupTerm (term, store) {
    const termID = term.get('id');
    store.query('course', {orderBy: 'tid', equalTo: termID}).then(response => {
      const courses = response.toArray();
      courses.forEach((course) => {
        _this.cleanupCourse(course, store);
      });
    });
    term.destroyRecord();
  },

  deleteCourse (course, otherCourses, store) {
    _this.normalizeIndices(course, otherCourses);
    _this.cleanupCourse(course, store);
  },

  cleanupCourse (course, store) {
    const courseID = course.get('id');
    store.query('class-time', {orderBy: 'cid', equalTo: courseID}).then(response => {
      const classTimes = response.toArray();
      classTimes.forEach((classTime) => {
        classTime.destroyRecord();
      });
    });
    store.query('course-work', {orderBy: 'cid', equalTo: courseID}).then(response => {
      const works = response.toArray();
      works.forEach((work) => {
        work.destroyRecord();
      });
    });
    course.destroyRecord();
  },

  deleteCourseWork(work, otherWork) {
    _this.normalizeIndices(work, otherWork);
    work.destroyRecord();
  },

  deleteCategory (category, otherCategories, works) {
    _this.normalizeIndices(category, otherCategories);
    _this.cleanupCategory(category, works);
  },

  cleanupCategory (category, works) {
    works.forEach((work) => {
      if (work.get('cgyid') === category.get('id')) {
        work.set('cgyid', null);
        work.save();
      }
    });
    category.destroyRecord();
  },

  normalizeIndices(item, otherItems) {
    const deleteIndex = item.get('index');
    otherItems.forEach((item) => {
      const index = item.get('index');
      if (index > deleteIndex) {
        item.set('index', index - 1);
        item.save();
      }
    });
  }
}

export default _this;

// Need to export each function again separately for testing purposes
export const deleteTerm = _this.deleteTerm;
export const cleanupTerm = _this.cleanupTerm;
export const deleteCourse = _this.deleteCourse;
export const cleanupCourse = _this.cleanupCourse;
export const deleteCourseWork = _this.deleteCourseWork;
export const deleteCategory = _this.deleteCategory;
export const cleanupCategory = _this.cleanupCategory;
export const normalizeIndices = _this.normalizeIndices;
