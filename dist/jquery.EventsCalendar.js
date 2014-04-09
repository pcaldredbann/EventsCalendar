/*
    Events Calendar - v0.1.0 - [last build on 2014-04-09]
    https://github.com/pcaldredbann/EventsCalendar
    Copyright (c) 2014 Paul Aldred-Bann
    Licensed MIT
*/
(function ($) {
    "use strict";
    
    ko.commitObservable = function (initialValue) {
        var _temp = initialValue,
            _actual = ko.observable(initialValue);
        
        var result = ko.computed({
            read: function () {
                return _actual();
            },
            write: function (newValue) {
                _temp = newValue;
            },
            owner: this
        });
        
        result.commit = function () {
            _actual(_temp);
        };
        result.rollback = function () {
            _temp = _actual();
        };
        
        return result;
    };

    var Calendar = function (data) {
        this.header = ko.observable(data.period);
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
                    onScheduledEventChange: data.onScheduledEventChange
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
        this.days = ko.computed(function () {
            if (this.weeks()) {
                var temp = [];
                for (var i = 0; i < this.weeks().length; i++) {
                    temp.push(this.weeks()[i].days());
                }
                return [].concat.apply([], temp);
            }
        }, this);
        this.selectedDay = ko.observable(undefined);
    };

    var CalendarWeek = function (data) {
        this.days = ko.observableArray(ko.utils.arrayMap(data.days, function (day) {
            return new CalendarDay(day);
        }));
    };

    var CalendarDay = function (data) {
        var self = this;
        this.date = ko.observable(data.date);
        this.scheduledEvent = ko.commitObservable(data.scheduledEvent);
        this.scheduledEvent.subscribe(function (newValue) {
            if (newValue) {
                if (data.onScheduledEventChange && typeof data.onScheduledEventChange === "function") {
                    data.onScheduledEventChange.call(self, newValue);
                }
            }
        });
    };

    $.fn.EventsCalendar = function (options) {
        options = $.extend({
            period: "April 2014",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            onScheduledEventChange: function () {}
        }, options);

        return this.each(function () {
            ko.applyBindings(new Calendar(options), this);
        });
    };

}(jQuery));