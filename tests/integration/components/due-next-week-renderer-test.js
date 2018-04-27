import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | due next week renderer', function() {
  setupComponentTest('due-next-week-renderer', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#due-next-week-renderer}}
    //     template content
    //   {{/due-next-week-renderer}}
    // `);

    this.render(hbs`{{due-next-week-renderer}}`);
    expect(this.$()).to.have.length(1);
  });
});
