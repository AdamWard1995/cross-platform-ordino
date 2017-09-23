import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const groupings = [
  {
    group: {label: 'A'},
    items: [{name: 'Adam'}, {name: 'Arthur'}]
  },
  {
    group: {label: 'B'},
    items: [{name: 'Brad'}]
  }
];

const groupingsWhenNoRenderer = [
  {
    group: 'A',
    items: ['Adam', 'Arthur']
  },
  {
    group: 'B',
    items: ['Brad']
  }
];

const test = integration('filtered-list')
describe(test.label, function () {
  test.setup();

  beforeEach(function () {
    registerMockComponent(this, 'mock-filter', {
      classNames: 'mock-filter',
      layout: hbs`
        {{input type='text' value=value placeholder='Name'}}
      `
    });
    registerMockComponent(this, 'mock-group-renderer', {
      classNames: 'mock-group-renderer',
      layout: hbs`
        <h1>{{item.label}}</h1>
      `
    });
    registerMockComponent(this, 'mock-item-renderer', {
      classNames: 'mock-item-renderer',
      layout: hbs`
        <p>{{item.name}}</p>
      `
    });
  });

  afterEach(function () {
    unregisterMockComponent(this, 'mock-filter');
    unregisterMockComponent(this, 'mock-group-renderer');
    unregisterMockComponent(this, 'mock-item-renderer');
  });

  describe('properly renders content', function () {
    describe('group and item renderers supplied', function () {
      beforeEach(function () {
        this.set('groups', groupings);
        this.set('nameValidator', function (group, item, name) {return !name || item.name.startsWith(name);});
        this.render(hbs`{{filtered-list
          groups=groups
          item-renderer=(component 'mock-item-renderer')
          group-renderer=(component 'mock-group-renderer')
          filters=(array (hash value=nameToFilter view=(component 'mock-filter' value=nameToFilter) passes=nameValidator))
        }}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should have rendered 2 group labels', function() {
        expect(this.$('.list-group-item').eq(0), 'First list item should be a group label').to.have.class('group-label');
        expect(this.$('.list-group-item').eq(3), 'Fourth list item should be a group label').to.have.class('group-label');
      });

      it('should have used the supplied group renderer', function() {
        expect(this.$('.mock-group-renderer')).to.have.length(2);
      });

      it('should have used the supplied item renderer', function() {
        expect(this.$('.mock-item-renderer')).to.have.length(3);
      });

      it('should have rendered the filter list header', function() {
        expect(this.$('.filter-list-header').text().trim()).to.eql('Filter');
      });

      it('should have rendered the supplied filter view', function() {
        expect(this.$('.filter-list .mock-filter')).to.have.length(1);
      });

      describe('correct values displayed', function () {
        it('should have correct value rendered for first item', function() {
          expect(this.$('.list-group-item').eq(0).text().trim()).to.eql('A');
        });

        it('should have correct value rendered for second item', function() {
          expect(this.$('.list-group-item').eq(1).text().trim()).to.eql('Adam');
        });

        it('should have correct value rendered for third item', function() {
          expect(this.$('.list-group-item').eq(2).text().trim()).to.eql('Arthur');
        });

        it('should have correct value rendered for fourth item', function() {
          expect(this.$('.list-group-item').eq(3).text().trim()).to.eql('B');
        });

        it('should have correct value rendered for fifth item', function() {
          expect(this.$('.list-group-item').eq(4).text().trim()).to.eql('Brad');
        });
      });
    });

    describe('no renderers supplied', function () {
      beforeEach(function () {
        this.set('groups', groupingsWhenNoRenderer);
        this.set('nameValidator', function (group, item, name) {return !name || item.name.startsWith(name);});
        this.render(hbs`{{filtered-list
          groups=groups
          filters=(array (hash value=nameToFilter view=(component 'mock-filter' value=nameToFilter) passes=nameValidator))
        }}`);
        return wait();
      });

      it('should render', function() {
        expect(this.$()).to.have.length(1);
      });

      it('should have rendered 2 group labels', function() {
        expect(this.$('.list-group-item').eq(0), 'First list item should be a group label').to.have.class('group-label');
        expect(this.$('.list-group-item').eq(3), 'Fourth list item should be a group label').to.have.class('group-label');
      });

      it('should have rendered the filter list header', function() {
        expect(this.$('.filter-list-header').text().trim()).to.eql('Filter');
      });

      it('should have rendered the supplied filter view', function() {
        expect(this.$('.filter-list .mock-filter')).to.have.length(1);
      });

      describe('correct values displayed', function () {
        it('should have correct value rendered for first item', function() {
          expect(this.$('.list-group-item').eq(0).text().trim()).to.eql('A');
        });

        it('should have correct value rendered for second item', function() {
          expect(this.$('.list-group-item').eq(1).text().trim()).to.eql('Adam');
        });

        it('should have correct value rendered for third item', function() {
          expect(this.$('.list-group-item').eq(2).text().trim()).to.eql('Arthur');
        });

        it('should have correct value rendered for fourth item', function() {
          expect(this.$('.list-group-item').eq(3).text().trim()).to.eql('B');
        });

        it('should have correct value rendered for fifth item', function() {
          expect(this.$('.list-group-item').eq(4).text().trim()).to.eql('Brad');
        });
      });
    });
  });

  describe('properly filters content', function () {
    beforeEach(function () {
      this.set('groups', groupings);
      this.set('nameValidator', function (group, item, name) {return !name || item.name.toLowerCase().startsWith(name);});
      this.render(hbs`{{filtered-list
        groups=groups
        item-renderer=(component 'mock-item-renderer')
        group-renderer=(component 'mock-group-renderer')
        filters=(array (hash value=nameToFilter view=(component 'mock-filter' value=nameToFilter) passes=nameValidator))
      }}`);
      return wait().then(() => {
        this.$('.mock-filter input').val('ad').change();
        return wait();
      });
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have only rendered first label', function() {
      expect(this.$('.mock-group-renderer')).to.have.length(1);
    });

    it('should have only rendered first group item', function() {
      expect(this.$('.mock-item-renderer')).to.have.length(1);
    });

    describe('correct values displayed', function () {
      it('should have correct value rendered for first item', function() {
        expect(this.$('.list-group-item').eq(0).text().trim()).to.eql('A');
      });

      it('should have correct value rendered for second item', function() {
        expect(this.$('.list-group-item').eq(1).text().trim()).to.eql('Adam');
      });
    });
  });

  describe('properly selects content', function () {
    let onSelect;
    beforeEach(function () {
      onSelect = sinon.stub();
      this.set('groups', groupings);
      this.set('nameValidator', function (group, item, name) {return !name || item.name.toLowerCase().startsWith(name);});
      this.set('onSelect', onSelect);
      this.render(hbs`{{filtered-list
        groups=groups
        item-renderer=(component 'mock-item-renderer')
        group-renderer=(component 'mock-group-renderer')
        filters=(array (hash value=nameToFilter view=(component 'mock-filter' value=nameToFilter) passes=nameValidator))
        onItemSelected=onSelect
      }}`);
      return wait().then(() => {
        this.$('.list-group-item').eq(1).click();
        return wait();
      });
    });

    it('should have called selection handler', function() {
      expect(onSelect).to.have.been.calledWithExactly(groupings[0].items[0]);
    });
  });
});
