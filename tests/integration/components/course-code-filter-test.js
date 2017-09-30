import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('course-code-filter')
describe(test.label, function () {
  test.setup();

  describe('no year entered', function () {
    beforeEach(function () {
      this.render(hbs`{{course-code-filter}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have correct placeholder', function () {
      expect(this.$('.course-code-filter .ember-text-field').attr('placeholder')).to.eql('Course Code');
    });

    it('should be empty', function () {
      expect(this.$('.course-code-filter .ember-text-field').val()).to.eql('');
    });
  });

  describe('course code entered', function () {
    beforeEach(function () {
      this.render(hbs`{{course-code-filter value='COMP 4905'}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render initial value', function () {
      expect(this.$('.course-code-filter .ember-text-field').val()).to.eql('COMP 4905');
    });
  });

  describe('change entered course code', function () {
    beforeEach(function () {
      this.render(hbs`{{course-code-filter value=value}}`);
      return wait().then(() => {
        this.$('.course-code-filter .ember-text-field').val('COMP 4905').change();
        return wait();
      });
    });

    it('should have set value', function () {
      expect(this.get('value')).to.eql('COMP 4905');
    });
  });
});
