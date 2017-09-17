import DS from 'ember-data';

export default DS.Model.extend({
  'uid': DS.attr('string'),
  'cid': DS.attr('string'),
  'label': DS.attr('label'),
  'weight': DS.attr('number'),
  'grade': DS.attr('number'),
  'due': DS.attr('date')
});
