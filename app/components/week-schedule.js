import Ember from 'ember';
import moment from 'moment';

import Day from 'cross-platform-ordino/enums/day';
import Timeslot from 'cross-platform-ordino/enums/timeslot';

const pxPerMinute = 2;

export default Ember.Component.extend({
  classNames: ['week-schedule'],
  now: moment().diff(moment().startOf('day'), 'minutes') * pxPerMinute,
  hour: moment().diff(moment().startOf('day'), 'hours'),
  days: Object.values(Day).map((day) => {
    return {day, header: day.charAt(0)}
  }),
  hours: Object.values(Timeslot),
  today: moment().format('dddd'),
  getPixel (timeStr) {
    const time = moment(timeStr, 'hh:mm a');
    return (time.hour() * 60 + time.minute()) * pxPerMinute;
  },
  didReceiveAttrs () {
    this._super();
    Ember.run.next(this, function () {
      this.$('.timeslot').remove();
      this.$('.timeline').css({top: this.get('now')});

      if (!this.get('renderedAlready')) {
        this.$('.column').eq(0).find('.cell')[this.get('hour')].scrollIntoView();
        this.set('renderedAlready', true);
      }

      const timeslots = this.get('timeslots');
      if (timeslots) {
        let nextID = 1;
        let days = Object.values(Day);
        timeslots.forEach(slot => {
          const dayIndex = days.indexOf(slot.day);
          const top = this.getPixel(slot.start);
          this.$('.column').eq(dayIndex + 1).append(
            `<div id='timeslot${nextID}' class='timeslot ${slot.class || ''}' style='top: ${top}px; height: ${Math.max(this.getPixel(slot.end) - top, 40)}px;'>
              <div class='slot-label'>${slot.label}</div>
              <div class='slot-time'>${slot.start}<br>to<br>${slot.end}</div>
              <div class='slot-location'>${slot.location}</div>
            </div>`
          );

          const id = nextID++;
          this.$(`#timeslot${id}`).click(() => {
            const itemSelected = this.get('itemSelected');
            if (itemSelected) {
              itemSelected(slot.item);
            }
          });
          this.$(`#timeslot${id}`).contextmenu((e) => {
            if (slot.contextClick) {
              const itemRightClicked = this.get('itemRightClicked');
              if (itemRightClicked) {
                itemRightClicked(slot.item);
              }
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            return true;
          });
        });
      }
    });
  },
});
