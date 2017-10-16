import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | create category modal', function() {
  setupComponentTest('create-category-modal', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#create-category-modal}}
    //     template content
    //   {{/create-category-modal}}
    // `);

    this.render(hbs`{{create-category-modal}}`);
    expect(this.$()).to.have.length(1);
  });
});
