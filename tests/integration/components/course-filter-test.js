import Ember from 'ember';
import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('course-filter')
describe(test.label, function () {
  test.setup();

  let course1, course2, course3;
  beforeEach(function () {
    course1 = Ember.Object.create({id: 123, 'course-code': 'COMP 4905'});
    course2 = Ember.Object.create({id: 456, 'course-code': 'COMP 4004'});
    course3 = Ember.Object.create({id: 789, 'course-code': 'COMP 4107'});
    this.set('courses', [course1, course2, course3]);
  });

  describe('no course selected', function () {
    beforeEach(function () {
      this.render(hbs`{{course-filter courses=courses}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have default option selected', function () {
      expect(this.$('.course-filter select :selected').text()).to.eql('-- Course --');
    });
  });

  describe('a course is selected', function () {
    beforeEach(function () {
      this.render(hbs`{{course-filter courses=courses value=123}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have correct option selected', function () {
      expect(this.$('.course-filter select :selected').text()).to.eql(course1.get('course-code'));
    });
  });

  describe('change course selection', function () {
    beforeEach(function () {
      this.render(hbs`{{course-filter courses=courses value=value}}`);
      return wait().then(() => {
        this.$('.course-filter select').val(456).change();
        return wait();
      });
    });

    it('should have second course selected', function () {
      expect(this.$('.course-filter select :selected').text()).to.eql(course2.get('course-code'));
    });

    it('should have set filter value', function () {
      expect(this.get('value')).to.eql('456');
    });
  });
});
