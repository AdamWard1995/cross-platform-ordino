import Ember from 'ember';

export function contains(params) {
  if (params && params.length === 2 && Ember.typeOf(params[0]) === 'array') {
    return params[0].includes(params[1]);
  }
}

export default Ember.Helper.helper(contains);
