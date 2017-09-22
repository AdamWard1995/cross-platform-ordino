import Ember from 'ember';

export function round(params) {
  if (params && Ember.typeOf(params[0]) === 'number') {
    return params[0].toFixed(params[1]);
  }
}

export default Ember.Helper.helper(round);
