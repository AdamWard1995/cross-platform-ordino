import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('app-menu')
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    beforeEach(function () {
      this.render(hbs`{{#app-menu}}test content{{/app-menu}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render side bar', function() {
      expect(this.$('.app-menu-side-bar')).to.have.length(1);
    });

    it('should render drawer', function() {
      expect(this.$('.app-menu-drawer')).to.have.length(1);
    });

    it('should render block content', function() {
      expect(this.$('.app-menu-drawer-content').text().trim()).to.eql('test content');
    });

    it('should be have is-closed class initially', function() {
      expect(this.$('.app-menu')).to.have.class('is-closed');
    });
  });

  describe('properly opens drawer', function () {
    beforeEach(function () {
      this.render(hbs`{{#app-menu}}test content{{/app-menu}}`);
      this.set('drawerOpen', false);
      return wait().then(() => {
        this.$('.app-menu-side-bar-icon').click();
        return wait();
      });
    });

    it('should set class to is-open', function() {
      expect(this.$('.app-menu')).to.have.class('is-open');
    });
  });

  describe('properly closes drawer', function () {
    beforeEach(function () {
      this.render(hbs`{{#app-menu}}test content{{/app-menu}}`);
      this.set('drawerOpen', false);
      return wait().then(() => {
        this.$('.app-menu-side-bar-icon').click();
        return this.$(":animated").promise().then(() => {
          this.$('.app-menu-side-bar-icon').click();
          return this.$(":animated").promise();
        });
      });
    });

    it('should set class to is-closed', function() {
      expect(this.$('.app-menu')).to.have.class('is-closed');
    });
  });

  describe('properly calls nav view click handler', function () {
    let navViewClicked;
    beforeEach(function () {
      navViewClicked = sinon.stub();
      this.set('onNavViewClicked', navViewClicked);
      this.render(hbs`{{#app-menu onNavViewClicked=onNavViewClicked}}test content{{/app-menu}}`);
      this.set('drawerOpen', false);
      return wait().then(() => {
        this.$('.app-menu-drawer-nav-view').click();
        return wait();
      });
    });

    it('should have called onNavViewClicked handler', function() {
      expect(navViewClicked).to.have.callCount(1);
    });
  });
});
