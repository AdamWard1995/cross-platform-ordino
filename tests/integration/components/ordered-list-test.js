import Ember from 'ember';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('ordered-list')
describe.skip(test.label, function () {
  test.setup();

  let sandbox;
  beforeEach(function () {
    registerMockComponent(this, 'mock-component', {
      classNames: 'mock-component',
      layout: hbs`
        <h1>{{item.title}}</h1>
      `
    });
    sandbox = sinon.sandbox.create();
    sandbox.stub(Ember.run, 'later');
  });

  afterEach(function () {
    unregisterMockComponent(this, 'mock-component');
    sandbox.restore();
  });

  describe('properly renders without an item renderer', function () {
    beforeEach(function () {
      this.set('items', [{title: 'item1'}, {title: 'item2'}, {title: 'item3'}]);
      this.render(hbs`
        {{ordered-list
          items=items
        }}
      `);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render 3 list items even though they are empty', function () {
      expect(this.$('.list-group-item')).to.have.length(3);
    });

    it('should render menu icons', function() {
      expect(this.$('.menu-icon')).to.have.length(3);
    });

    it('should render delete icons', function() {
      expect(this.$('.delete-icon')).to.have.length(3);
    });

    it('should render decrement icons', function() {
      expect(this.$('.decrement-icon')).to.have.length(3);
    });

    it('should render increment icons', function() {
      expect(this.$('.increment-icon')).to.have.length(3);
    });
  });

  describe('properly renders with supplied item renderer', function () {
    let onDeleteStub, onSelectStub;
    beforeEach(function () {
      onDeleteStub = sinon.stub();
      onSelectStub = sinon.stub();
      this.set('items', [{title: 'item1'}, {title: 'item2'}, {title: 'item3'}]);
      this.set('onItemSelected', onSelectStub);
      this.set('onItemDeleted', onDeleteStub);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
          onItemSelected=onItemSelected
          onItemDeleted=onItemDeleted
        }}
      `);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render each list item', function() {
      expect(this.$('.mock-component h1').eq(0).text().trim(), 'Should render first item correctly').to.eql('item1');
      expect(this.$('.mock-component h1').eq(1).text().trim(), 'Should render second item correctly').to.eql('item2');
      expect(this.$('.mock-component h1').eq(2).text().trim(), 'Should render third item correctly').to.eql('item3');
    });

    it('should render menu icons', function() {
      expect(this.$('.menu-icon')).to.have.length(3);
    });

    it('should render delete icons', function() {
      expect(this.$('.delete-icon')).to.have.length(3);
    });

    it('should render decrement icons', function() {
      expect(this.$('.decrement-icon')).to.have.length(3);
    });

    it('should render increment icons', function() {
      expect(this.$('.increment-icon')).to.have.length(3);
    });
  });

  describe('properly orders items', function () {
    beforeEach(function () {
      this.set('items', [
        Ember.Object.create({title: 'item1', index: 2}),
        Ember.Object.create({title: 'item2', index: 0}),
        Ember.Object.create({title: 'item3', index: 1})
      ]);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
          onItemSelected=onItemSelected
          onItemDeleted=onItemDeleted
        }}
      `);
      return wait();
    });

    it('should render item2 first', function() {
      expect(this.$('.mock-component h1').eq(0).text().trim()).to.eql('item2');
    });

    it('should render item3 second', function() {
      expect(this.$('.mock-component h1').eq(1).text().trim()).to.eql('item3');
    });

    it('should render item1 third', function() {
      expect(this.$('.mock-component h1').eq(2).text().trim()).to.eql('item1');
    });
  });

  describe('properly increment item', function () {
    let item1SaveStub, item3SaveStub;
    beforeEach(function () {
      item1SaveStub = sinon.stub();
      item3SaveStub = sinon.stub();
      this.set('items', [
        Ember.Object.create({title: 'item1', index: 2, save: item1SaveStub}),
        Ember.Object.create({title: 'item2', index: 0}),
        Ember.Object.create({title: 'item3', index: 1, save: item3SaveStub})
      ]);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
        }}
      `);
      return wait().then(() => {
        this.$('.increment-icon').eq(1).click();
        return wait();
      });
    });

    it('should render item2 first', function() {
      expect(this.$('.mock-component h1').eq(0).text().trim()).to.eql('item2');
    });

    it('should render item1 second', function() {
      expect(this.$('.mock-component h1').eq(1).text().trim()).to.eql('item1');
    });

    it('should render item3 third', function() {
      expect(this.$('.mock-component h1').eq(2).text().trim()).to.eql('item3');
    });

    it('should have updated index for item1', function() {
      expect(this.get('items')[0].get('index')).to.eql(1);
    });

    it('should have updated index for item3', function() {
      expect(this.get('items')[2].get('index')).to.eql(2);
    });

    it('should have set changed class for second list item', function() {
      expect(this.$('.list-group-item').eq(1)).to.have.class('changed');
    });

    it('should have set changed class for third list item', function() {
      expect(this.$('.list-group-item').eq(2)).to.have.class('changed');
    });

    it('should have save changes to item1', function() {
      expect(item1SaveStub).to.have.callCount(1);
    });

    it('should have save changes to item3', function() {
      expect(item3SaveStub).to.have.callCount(1);
    });
  });

  describe('properly decrement item', function () {
    let item1SaveStub, item3SaveStub;
    beforeEach(function () {
      item1SaveStub = sinon.stub();
      item3SaveStub = sinon.stub();
      this.set('items', [
        Ember.Object.create({title: 'item1', index: 2, save: item1SaveStub}),
        Ember.Object.create({title: 'item2', index: 0}),
        Ember.Object.create({title: 'item3', index: 1, save: item3SaveStub})
      ]);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
        }}
      `);
      return wait().then(() => {
        this.$('.decrement-icon').eq(2).click();
        return wait();
      });
    });

    it('should render item2 first', function() {
      expect(this.$('.mock-component h1').eq(0).text().trim()).to.eql('item2');
    });

    it('should render item1 second', function() {
      expect(this.$('.mock-component h1').eq(1).text().trim()).to.eql('item1');
    });

    it('should render item3 third', function() {
      expect(this.$('.mock-component h1').eq(2).text().trim()).to.eql('item3');
    });

    it('should have updated index for item1', function() {
      expect(this.get('items')[0].get('index')).to.eql(1);
    });

    it('should have updated index for item3', function() {
      expect(this.get('items')[2].get('index')).to.eql(2);
    });

    it('should have set changed class for second list item', function() {
      expect(this.$('.list-group-item').eq(1)).to.have.class('changed');
    });

    it('should have set changed class for third list item', function() {
      expect(this.$('.list-group-item').eq(2)).to.have.class('changed');
    });

    it('should have save changes to item1', function() {
      expect(item1SaveStub).to.have.callCount(1);
    });

    it('should have save changes to item3', function() {
      expect(item3SaveStub).to.have.callCount(1);
    });
  });

  describe('properly delete item', function () {
    let deleteStub;
    beforeEach(function () {
      deleteStub = sinon.stub();
      this.set('onDelete', deleteStub);
      this.set('items', [
        Ember.Object.create({title: 'item1'}),
        Ember.Object.create({title: 'item2'}),
        Ember.Object.create({title: 'item3'})
      ]);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
          onItemDeleted=onDelete
        }}
      `);
      return wait().then(() => {
        this.$('.delete-icon').eq(0).click();
        return wait();
      });
    });

    it('should have called delete handler', function() {
      expect(deleteStub).to.have.callCount(1);
    });

    it('should have passed correct item to delete handler', function() {
      expect(deleteStub).to.have.been.calledWithExactly(this.get('items')[0]);
    });
  });

  describe('properly select item', function () {
    let selectStub;
    beforeEach(function () {
      selectStub = sinon.stub();
      this.set('onSelect', selectStub);
      this.set('items', [
        Ember.Object.create({title: 'item1'}),
        Ember.Object.create({title: 'item2'}),
        Ember.Object.create({title: 'item3'})
      ]);
      this.render(hbs`
        {{ordered-list
          items=items
          itemRenderer=(component 'mock-component')
          onItemSelected=onSelect
        }}
      `);
      return wait().then(() => {
        this.$('.list-group-item').eq(0).click();
        return wait();
      });
    });

    it('should have called select handler', function() {
      expect(selectStub).to.have.callCount(1);
    });

    it('should have passed correct item to select handler', function() {
      expect(selectStub).to.have.been.calledWithExactly(this.get('items')[0]);
    });
  });
});
