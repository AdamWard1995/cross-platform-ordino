import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('category-filter')
describe(test.label, function () {
  test.setup();

  let category1, category2, category3;
  beforeEach(function () {
    category1 = Ember.Object.create({id: 123, label: 'Assignment'});
    category2 = Ember.Object.create({id: 456, label: 'Exam'});
    category3 = Ember.Object.create({id: 789, label: 'Reading'});
    this.set('categories', [category1, category2, category3]);
  });

  describe('no course selected', function () {
    beforeEach(function () {
      this.render(hbs`{{category-filter categories=categories}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have default option selected', function () {
      expect(this.$('.category-filter select :selected').text()).to.eql('-- Category --');
    });
  });

  describe('a course is selected', function () {
    beforeEach(function () {
      this.render(hbs`{{category-filter categories=categories value=123}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have correct option selected', function () {
      expect(this.$('.category-filter select :selected').text()).to.eql(category1.get('label'));
    });
  });

  describe('change course selection', function () {
    beforeEach(function () {
      this.render(hbs`{{category-filter categories=categories value=value}}`);
      return wait().then(() => {
        this.$('.category-filter select').val(456).change();
        return wait();
      });
    });

    it('should have second category selected', function () {
      expect(this.$('.category-filter select :selected').text()).to.eql(category2.get('label'));
    });

    it('should have set filter value', function () {
      expect(this.get('value')).to.eql('456');
    });
  });
});
