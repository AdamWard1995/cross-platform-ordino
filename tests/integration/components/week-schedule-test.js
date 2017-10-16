import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | week schedule', function() {
  setupComponentTest('week-schedule', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#week-schedule}}
    //     template content
    //   {{/week-schedule}}
    // `);

    this.render(hbs`{{week-schedule}}`);
    expect(this.$()).to.have.length(1);
  });
});
