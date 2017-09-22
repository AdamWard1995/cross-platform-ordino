import DS from 'ember-data';

export default DS.Model.extend({
  'uid': DS.attr('string'),
  'tid': DS.attr('string'),
  'course-code': DS.attr('string'),
  'index': DS.attr('number')
});
