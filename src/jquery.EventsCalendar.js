(function ($) {
    "use strict";

    var Calendar = function (data) {
        this.weeks = ko.observableArray(ko.utils.arrayMap((function () {
            var periodParts = data.period.split(' '),
                startDate = new Date(periodParts[1], data.months.indexOf(periodParts[0]), 1),
                endDate = null,
                days = [],
                weeks = [];

            // roll date cursor back to nearest historical Monday
            while (startDate.getDay() !== 1) {
                startDate.setDate(startDate.getDate() - 1);
            }
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 42);

            // create a collection of days between the start and end dates
            while (startDate.getTime() < endDate.getTime()) {
                days.push({
                    date: new Date(startDate),
                    scheduledEvent: undefined,
                    scheduleEvent: data.scheduleEvent
                });
                startDate.setDate(startDate.getDate() + 1);
            }

            // now split the days up into weeks
            for (var i = 0; i < days.length; i += 7) {
                weeks.push({
                    days: days.slice(i, i + 7)
                });
            }

            return weeks;
        }()), function (week) {
            return new CalendarWeek(week);
        }));
    };

    var CalendarWeek = function (data) {
        this.days = ko.observableArray(ko.utils.arrayMap(data.days, function (day) {
            return new CalendarDay(day);
        }));
    };

    var CalendarDay = function (data) {
        var _scheduledEvent = data.scheduledEvent;
        
        this.date = data.date;
        this.scheduledEvent = function () {
            return _scheduledEvent;
        };
        this.scheduleEvent = function (newScheduledEvent) {
            if (data.scheduleEvent) {
                _scheduledEvent = data.scheduleEvent.call(this, newScheduledEvent);
            } else {
                _scheduledEvent = newScheduledEvent;
            }
        };
    };

    $.fn.EventsCalendar = function (options) {
        options = $.extend({
            period: "April 2014",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            scheduleEvent: function (eventToSchedule) {
                return $.extend({
                    eventDate: this.date.toString()
                }, eventToSchedule);
            }
        }, options);

        return this.each(function () {
            ko.applyBindings(new Calendar(options), this);
        });
    };

}(jQuery));