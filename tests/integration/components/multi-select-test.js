import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';

const test = integration('multi-select')
describe(test.label, function () {
  test.setup();

  describe('properly renders content', function () {
    beforeEach(function () {
      this.set('items', ['a', 'b', 'c', 'd', 'e']);
      this.set('selectedItems', ['a', 'd']);
      this.render(hbs`{{multi-select label='Label' items=items selectedItems=selectedItems}}`);
      return wait();
    })

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should have \'multi-select\' class', function() {
      expect(this.$('.multi-select')).to.have.length(1);
    });

    it('should have 5 \'selectable\' items', function() {
      expect(this.$('.selectable')).to.have.length(5);
    });

    it('should have \'a\' and \'d\' selected', function() {
      expect(this.$('.selectable :checked'), 'Exactly 2 items should be selected').to.have.length(2);
      expect(this.$('.selectable:has(:checked)').eq(0).text().trim(), '\'a\' should be selected').to.eql('a');
      expect(this.$('.selectable:has(:checked)').eq(1).text().trim(), '\'d\' should be selected').to.eql('d');
    });

    it('should have rendered the supplied label', function() {
      expect(this.$('.selections-label').text().trim()).to.eql('Label');
    });
  });

  describe('adds a selection', function () {
    beforeEach(function () {
      this.set('items', ['a', 'b', 'c', 'd', 'e']);
      this.set('selectedItems', ['a', 'd']);
    });

    describe('click on label', function () {
      beforeEach(function () {
        this.render(hbs`{{multi-select label='Label' items=items selectedItems=selectedItems}}`);
        return wait().then(() => {
          this.$('.selectable').eq(1).click();
          return wait();
        });
      });

      it('should have \'a\', \'b\' and \'d\' selected', function() {
        expect(this.$('.selectable :checked'), 'Exactly 3 items should be selected').to.have.length(3);
        expect(this.$('.selectable:has(:checked)').eq(0).text().trim(), '\'a\' should be selected').to.eql('a');
        expect(this.$('.selectable:has(:checked)').eq(1).text().trim(), '\'b\' should be selected').to.eql('b');
        expect(this.$('.selectable:has(:checked)').eq(2).text().trim(), '\'d\' should be selected').to.eql('d');
      });

      it('should have added \'b\' to selectedItems', function() {
        expect(this.get('selectedItems'), 'Exactly 3 items should be selected').to.have.length(3);
        expect(this.get('selectedItems'), '\'b\' should be in selectedItems').to.contain('b');
      });
    });

    describe('click on checkbox', function () {
      beforeEach(function () {
        this.render(hbs`{{multi-select label='Label' items=items selectedItems=selectedItems}}`);
        return wait().then(() => {
          this.$('.selectable input').eq(1).click();
          return wait();
        });
      });

      it('should have \'a\', \'b\' and \'d\' selected', function() {
        expect(this.$('.selectable :checked'), 'Exactly 3 items should be selected').to.have.length(3);
        expect(this.$('.selectable:has(:checked)').eq(0).text().trim(), '\'a\' should be selected').to.eql('a');
        expect(this.$('.selectable:has(:checked)').eq(1).text().trim(), '\'b\' should be selected').to.eql('b');
        expect(this.$('.selectable:has(:checked)').eq(2).text().trim(), '\'d\' should be selected').to.eql('d');
      });

      it('should have added \'b\' to selectedItems', function() {
        expect(this.get('selectedItems'), 'Exactly 3 items should be selected').to.have.length(3);
        expect(this.get('selectedItems'), '\'b\' should be in selectedItems').to.contain('b');
      });
    });
  });

  describe('removes a selection', function () {
    beforeEach(function () {
      this.set('items', ['a', 'b', 'c', 'd', 'e']);
      this.set('selectedItems', ['a', 'd']);
    });

    describe('click on label', function () {
      beforeEach(function () {
        this.render(hbs`{{multi-select label='Label' items=items selectedItems=selectedItems}}`);
        return wait().then(() => {
          this.$('.selectable:has(:checked)').eq(0).click();
          return wait();
        });
      });

      it('should have only \'d\' selected', function() {
        expect(this.$('.selectable :checked'), 'Exactly 3 items should be selected').to.have.length(1);
        expect(this.$('.selectable:has(:checked)').eq(0).text().trim(), '\'d\' should be selected').to.eql('d');
      });

      it('should have removed \'a\' from selectedItems', function() {
        expect(this.get('selectedItems'), 'Exactly 1 items should be selected').to.have.length(1);
        expect(this.get('selectedItems'), '\'a\' should not be in selectedItems').to.not.contain('a');
      });
    });

    describe('click on checkbox', function () {
      beforeEach(function () {
        this.render(hbs`{{multi-select label='Label' items=items selectedItems=selectedItems}}`);
        return wait().then(() => {
          this.$('.selectable input:checked').eq(0).click();
          return wait();
        });
      });

      it('should have only \'d\' selected', function() {
        expect(this.$('.selectable :checked'), 'Exactly 3 items should be selected').to.have.length(1);
        expect(this.$('.selectable:has(:checked)').eq(0).text().trim(), '\'d\' should be selected').to.eql('d');
      });

      it('should have removed \'a\' from selectedItems', function() {
        expect(this.get('selectedItems'), 'Exactly 1 items should be selected').to.have.length(1);
        expect(this.get('selectedItems'), '\'a\' should not be in selectedItems').to.not.contain('a');
      });
    });
  });
})
