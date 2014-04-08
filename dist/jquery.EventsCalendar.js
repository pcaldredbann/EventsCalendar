/*
    Events Calendar - v0.1.0 - [last build on 2014-04-08]
    https://github.com/pcaldredbann/EventsCalendar
    Copyright (c) 2014 Paul Aldred-Bann
    Licensed MIT
*/
(function ($) {
    "use strict";

    var Calendar = function (data) {
        this.weeks = ko.observableArray(ko.utils.arrayMap((function () {
            var periodParts = data.period.split(' '),
                m = data.months.indexOf(periodParts[0]),
                y = periodParts[1],
                startDate = new Date(y, m, 1),
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
                    event: null,
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
        this.date = ko.observable(data.date);
        this.event = ko.observable(data.event);
        this.scheduleEvent = data.scheduleEvent;
    };

    $.fn.EventsCalendar = function (options) {
        options = $.extend({
            period: "April 2014",
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            formatDate: function (value) {
                var d = value.getDate(),
                    m = value.getMonth(),
                    y = value.getFullYear();

                return [d, m, y].join("-");
            },
            scheduleEvent: function (event) {
                this.event(event);
            },
            clearScheduledEvent: function () {
                this.event(null);
            }
        }, options);

        return this.each(function () {
            ko.applyBindings(new Calendar(options), this);
        });
    };

}(jQuery));