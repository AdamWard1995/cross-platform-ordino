import DS from 'ember-data';

export default DS.Model.extend({
  'uid': DS.attr('string'),
  'label': DS.attr('string'),
  'icon': DS.attr('string'),
  'index': DS.attr('number')
});
