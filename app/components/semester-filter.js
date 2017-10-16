import Filter from './filter';
import Semester from '../enums/semester';

export default Filter.extend({
  classNames: ['semester-filter'],
  semesters: [
    {
      label: '-- Semester --',
      value: ''
    },
    {
      label: Semester.FALL,
      value: Semester.FALL
    },
    {
      label: Semester.WINTER,
      value: Semester.WINTER
    },
    {
      label: Semester.SUMMER,
      value: Semester.SUMMER
    },
  ],
});
