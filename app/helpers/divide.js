import Ember from 'ember';

export function divide(params) {
  if (params && params.length > 0) {
    return params.reduce((a, b) => {
      return a / b;
    });
  }
}

export default Ember.Helper.helper(divide);
