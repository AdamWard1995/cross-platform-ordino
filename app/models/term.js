import DS from 'ember-data';

export default DS.Model.extend({
  'uid': DS.attr('string'),
  'semester': DS.attr('string'),
  'year': DS.attr('number'),
  'current': DS.attr('boolean')
});
