/*
    Events Calendar - v0.1.0 - [last build on 2014-03-29]
    https://github.com/pcaldredbann/EventsCalendar
    Copyright (c) 2014 Paul Aldred-Bann
    Licensed MIT
*/
(function ($) {
    "use strict";

    function Calendar(data) {
        var self = this;

        this.initialPeriod = ko.observable(new Date(data.period.year, data.period.month, 1, 0, 0, 0, 0));
        this.startDate = ko.computed(function () {
            if (this.initialPeriod()) {
                var dateCursor = new Date(self.initialPeriod());
                while (dateCursor.getDay() !== 1) {
                    dateCursor.setDate(dateCursor.getDate() - 1);
                }
                return dateCursor;
            }
        }, this);
        this.endDate = ko.computed(function () {
            if (this.startDate()) {
                var endDate = new Date(this.startDate());
                endDate.setDate(endDate.getDate() + 41);
                return endDate;
            }
        }, this);
        this.days = ko.computed(function () {
            if (this.startDate() && this.endDate()) {
                var days = [],
                    dateCursor = new Date(this.startDate());
                do {
                    days.push(new CalendarDay({
                        date: new Date(dateCursor)
                    }));
                    dateCursor.setDate(dateCursor.getDate() + 1);
                } while (dateCursor.getTime() < this.endDate().getTime());
                return days;
            }
        }, this);
        this.weeks = ko.computed(function () {
            if (this.days()) {
                var weeks = [];
                for (var i = 0; i < this.days().length; i += 7) {
                    weeks.push(this.days().slice(i, 7));
                }
                return weeks;
            }
        }, this);
        this.prevPeriod = ko.computed(function () {
            return $.EventsCalendar.formatDate(this.startDate());
        }, this);
        this.nextPeriod = ko.computed(function () {
            return $.EventsCalendar.formatDate(this.endDate());
        }, this);
        this.getDate = function (date) {
            return ko.utils.arrayFirst(self.days(), function (day) {
                return day.date().getTime() === date.getTime();
            });
        };
        this.createEvent = function (date, event) {
            var day = self.getDate(date);
            if (day.event()) {
                throw "There is already an event scheduled on this date.";
            }
            day.event(event);
        };
    }

    function CalendarDay(data) {
        this.date = ko.observable(new Date(data.date));
        this.event = ko.observable(data.event);
    }

    $.fn.EventsCalendar = function (options) {
        options = $.extend({
            period: {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            }
        }, options);

        if (this.length) {
            return this.each(function () {
                ko.applyBindings(new Calendar(options), this);
            });
        }
    };

    $.EventsCalendar = $.fn.EventsCalendar;
    $.EventsCalendar.formatDate = function (date) {
        if (date) {
            var dt = new Date(date),
                y = dt.getFullYear(),
                m = dt.getMonth(),
                d = dt.getDate();
            return [d, m, y].join('/');
        }
    };

    $.expr[':'].EventsCalendar = function (elem) {
        return ko.dataFor(elem);
    };

}(jQuery));