import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | info modal', function() {
  setupComponentTest('info-modal', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#info-modal}}
    //     template content
    //   {{/info-modal}}
    // `);

    this.render(hbs`{{info-modal}}`);
    expect(this.$()).to.have.length(1);
  });
});
