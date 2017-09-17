import DS from 'ember-data';

export default DS.Model.extend({
  'uid': DS.attr('string'),
  'cid': DS.attr('string'),
  'location': DS.attr('string'),
  'start-time': DS.attr('string'),
  'end-time': DS.attr('string'),
  'days': DS.hasMany('number')
});
