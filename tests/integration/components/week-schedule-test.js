import {expect} from 'chai';
import {beforeEach, describe, it} from 'mocha';
import wait from 'ember-test-helpers/wait';
import {integration} from 'ember-test-utils/test-support/setup-component-test';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const test = integration('week-schedule');
describe(test.label, function () {
  test.setup();

  let item1, item2, item3, timeslot1, timeslot2, timeslot3;
  beforeEach(function () {
    item1 = 'foo';
    item2 = 'bar';
    item3 = 'baz';
    timeslot1 = {label: 'COMP 4004', location: 'TB 238', start: '10:05 am', end: '11:25 am', item: item1}; // morning
    timeslot2 = {label: 'ERTH 2401', location: 'SB 123', start: '1:05 pm', end: '3:55 pm', item: item2}; // afternoon
    timeslot3 = {label: 'COMP 4107', location: 'HP 4155', start: '11:35 am', end: '12:55 pm', item: item3}; // scales morning to afternoon
    this.set('timeslots', [timeslot1, timeslot2, timeslot3]);
  });

  describe('properly renders', function () {
    beforeEach(function () {
      this.render(hbs`{{week-schedule timeslots=timeslots}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render header placeholder', function() {
      expect(this.$('.header .header-cell').eq(0).text().trim()).to.eql('');
    });

    it('should render header for Sunday', function() {
      expect(this.$('.header .header-cell').eq(1).text().trim()).to.eql('Sunday');
    });

    it('should render header for Monday', function() {
      expect(this.$('.header .header-cell').eq(2).text().trim()).to.eql('Monday');
    });

    it('should render header for Tuesday', function() {
      expect(this.$('.header .header-cell').eq(3).text().trim()).to.eql('Tuesday');
    });

    it('should render header for Wednesday', function() {
      expect(this.$('.header .header-cell').eq(4).text().trim()).to.eql('Wednesday');
    });

    it('should render header for Thursday', function() {
      expect(this.$('.header .header-cell').eq(5).text().trim()).to.eql('Thursday');
    });

    it('should render header for Friday', function() {
      expect(this.$('.header .header-cell').eq(6).text().trim()).to.eql('Friday');
    });

    it('should render header for Saturday', function() {
      expect(this.$('.header .header-cell').eq(7).text().trim()).to.eql('Saturday');
    });

    it('should render 8 columns', function() {
      expect(this.$('.ember-scrollable .column')).to.have.length(8);
    });

    it('should render 24 hour cells for each column', function() {
      expect(this.$('.ember-scrollable .cell')).to.have.length(8 * 24);
    });

    it('should have rendered first timeslot', function () {
      expect(this.$('#timeslot1')).to.have.length(1);
    });

    it('should have rendered second timeslot', function () {
      expect(this.$('#timeslot2')).to.have.length(1);
    });

    it('should have rendered third timeslot', function () {
      expect(this.$('#timeslot3')).to.have.length(1);
    });

    it('should have first timeslot at correct start point', function () {
      let px = 2, hour = 10, minute = 5;
      expect(this.$('#timeslot1').css('top')).to.eql(px * (60 * hour + minute) + 'px');
    });

    it('should have correct height for first timeslot', function () {
      let px = 2, hour = 1, minute = 20;
      expect(this.$('#timeslot1').css('height')).to.eql(px * (60 * hour + minute) + 'px');
    });

    it('should have second timeslot at correct start point', function () {
      let px = 2, hour = 13, minute = 5;
      expect(this.$('#timeslot2').css('top')).to.eql(px * (60 * hour + minute) + 'px');
    });

    it('should have correct height for second timeslot', function () {
      let px = 2, hour = 2, minute = 50;
      expect(this.$('#timeslot2').css('height')).to.eql(px * (60 * hour + minute) + 'px');
    });

    it('should have third timeslot at correct start point', function () {
      let px = 2, hour = 11, minute = 35;
      expect(this.$('#timeslot3').css('top')).to.eql(px * (60 * hour + minute) + 'px');
    });

    it('should have correct height for third timeslot', function () {
      let px = 2, hour = 1, minute = 20;
      expect(this.$('#timeslot3').css('height')).to.eql(px * (60 * hour + minute) + 'px');
    });
  });

  describe('properly renders when no timeslots', function () {
    beforeEach(function () {
      this.set('timeslots', undefined);
      this.render(hbs`{{week-schedule timeslots=timeslots}}`);
      return wait();
    });

    it('should render', function() {
      expect(this.$()).to.have.length(1);
    });

    it('should render header placeholder', function() {
      expect(this.$('.header .header-cell').eq(0).text().trim()).to.eql('');
    });

    it('should render header for Sunday', function() {
      expect(this.$('.header .header-cell').eq(1).text().trim()).to.eql('Sunday');
    });

    it('should render header for Monday', function() {
      expect(this.$('.header .header-cell').eq(2).text().trim()).to.eql('Monday');
    });

    it('should render header for Tuesday', function() {
      expect(this.$('.header .header-cell').eq(3).text().trim()).to.eql('Tuesday');
    });

    it('should render header for Wednesday', function() {
      expect(this.$('.header .header-cell').eq(4).text().trim()).to.eql('Wednesday');
    });

    it('should render header for Thursday', function() {
      expect(this.$('.header .header-cell').eq(5).text().trim()).to.eql('Thursday');
    });

    it('should render header for Friday', function() {
      expect(this.$('.header .header-cell').eq(6).text().trim()).to.eql('Friday');
    });

    it('should render header for Saturday', function() {
      expect(this.$('.header .header-cell').eq(7).text().trim()).to.eql('Saturday');
    });

    it('should render 8 columns', function() {
      expect(this.$('.ember-scrollable .column')).to.have.length(8);
    });

    it('should render 24 hour cells for each column', function() {
      expect(this.$('.ember-scrollable .cell')).to.have.length(8 * 24);
    });

    it('should not have rendered timeslots', function () {
      expect(this.$('.timeslot')).to.have.length(0);
    });
  });

  describe('properly calls item selection handler', function () {
    let selectStub;
    beforeEach(function () {
      selectStub = sinon.stub();
      this.set('itemSelected', selectStub);
      this.render(hbs`{{week-schedule timeslots=timeslots itemSelected=itemSelected}}`);
      return wait();
    });

    describe('click first timeslot', function () {
      beforeEach(function () {
        this.$('#timeslot1').click();
        return wait();
      });

      it('should have called selection handler', function() {
        expect(selectStub).to.have.been.calledWithExactly(item1);
      });
    });

    describe('click second timeslot', function () {
      beforeEach(function () {
        this.$('#timeslot2').click();
        return wait();
      });

      it('should have called selection handler', function() {
        expect(selectStub).to.have.been.calledWithExactly(item2);
      });
    });

    describe('click third timeslot', function () {
      beforeEach(function () {
        this.$('#timeslot3').click();
        return wait();
      });

      it('should have called selection handler', function() {
        expect(selectStub).to.have.been.calledWithExactly(item3);
      });
    });
  });
});
