import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | version modal', function() {
  setupComponentTest('version-modal', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#version-modal}}
    //     template content
    //   {{/version-modal}}
    // `);

    this.render(hbs`{{version-modal}}`);
    expect(this.$()).to.have.length(1);
  });
});