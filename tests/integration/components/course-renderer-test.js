import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('course-renderer')
describe(test.label, function () {
  test.setup();

  describe('properly renders course', function () {
    let item = Ember.Object.create({'course-code': 'COMP 4905'});
    beforeEach(function () {
      this.set('item', item);
      this.render(hbs`{{course-renderer item=item}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have term-renderer class set', function() {
      expect(this.$('.course-renderer')).to.have.length(1);
    });

    it('should have correct text rendered', function() {
      expect(this.$('.course-label').text().trim()).to.eql('COMP 4905');
    });
  });
});
