import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('filter')
describe(test.label, function () {
  test.setup();

  beforeEach(function () {
    this.render(hbs`{{filter}}`);
    return wait();
  })

  it('should render', function() {
    expect(this.$()).to.have.length(1);
  });
});
