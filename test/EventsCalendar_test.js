(function($) {
    
    module("jQuery#EventsCalendar", {
        setup: function () {
            var $fixture = $("#qunit-fixture");
            $fixture.html("<div></div><div></div>");
            this.elems = $fixture.children();
        }
    });
    
    test("is chainable", function () {
        expect(1);
        
        strictEqual(this.elems.EventsCalendar(), this.elems, "it is chainable");
    });
    
    test("has unique instances of Calendar", function () {
        expect(1);

        this.elems.EventsCalendar();
        var calendars = [];
        this.elems.each(function () {
            calendars.push(ko.contextFor(this).$root);
        });
        notStrictEqual(calendars[0], calendars[1], "calendars [0] and [1] are different instances");
    });
    
    test("changes to a calendar don't cascade to all others in the DOM", function () {
        expect(2);
        
        this.elems.EventsCalendar();
        var calendars = [];
        this.elems.each(function (i) {
            var calendar = ko.contextFor(this).$root;
            if (i === 0) {
                calendar.initialPeriod(null);
            }
            calendars.push(calendar);
        });
        ok(!calendars[0].initialPeriod(), "calendar [0] has been updated");
        ok(calendars[1].initialPeriod(), "calendar [1] has not");
    });
    
    module("jQuery:EventsCalendar", {
        setup: function () {
            var $fixture = $("#qunit-fixture");
            $fixture.html("<div></div><div></div><div></div><h1></h1><p></p>");
            $fixture.children("div").EventsCalendar();
            this.elems = $fixture.children();
        }
    });
    
    test("selects all instances correctly", function () {
        expect(1);
        
        equal($(":EventsCalendar").length, 3, "correctly selected 3 instances out of 5 DOM elements");
    });
    
    module("Calendar", {
        setup: function () {
            var $fixture = $("#qunit-fixture");
            $fixture.html("<div></div>");
            this.elems = $fixture.children();
            this.elems.EventsCalendar();
        }
    });
    
    test("has the correct default period (now)", function () {
        expect(1);
        
        var dateNow = new Date();
        dateNow.setDate(1);
        dateNow.setHours(0);
        dateNow.setMinutes(0);
        dateNow.setSeconds(0);
        dateNow.setMilliseconds(0);
        var calendar = ko.dataFor(this.elems.get(0));
        deepEqual(calendar.initialPeriod(), dateNow, "default initial period is correct");
    });
    
    test("has the correct startDate and endDate for a given period", function () {
        expect(2);
        
        var calendar = ko.dataFor(this.elems.get(0));
        calendar.initialPeriod(new Date(2014, 2, 1, 0, 0, 0, 0));
        deepEqual(calendar.startDate(), new Date(2014, 1, 24, 0, 0, 0, 0), "startDate is Monday 24th Feb");
        deepEqual(calendar.endDate(), new Date(2014, 3, 6, 0, 0, 0, 0), "endDate is Sunday 6th April"); 
    });
    
    test("has the correct startDate and endDate for February period in a leap-year", function () {
        expect(2);
        
        var calendar = ko.dataFor(this.elems.get(0));
        calendar.initialPeriod(new Date(2012, 1, 1, 0, 0, 0, 0));
        deepEqual(calendar.startDate(), new Date(2012, 0, 30, 0, 0, 0, 0), "startDate is Monday 30th Jan");
        deepEqual(calendar.endDate(), new Date(2012, 2, 11, 0, 0, 0, 0), "endDate is Sunday 11th March"); 
    });
    
    test("has the correct number of weeks (6) for any given period", function () {
        expect(1);
        
        var calendar = ko.dataFor(this.elems.get(0));
        calendar.initialPeriod(new Date(2014, 2, 1, 0, 0, 0, 0));
        deepEqual(calendar.weeks().length, 6, "has 6 weeks");
    });
    
    module("Calendar.Events", {
        setup: function () {
            var $fixture = $("#qunit-fixture");
            $fixture.html("<div></div>");
            this.elems = $fixture.children();
            this.elems.EventsCalendar({
                period: {
                    month: 2,
                    year: 2014
                }
            });
        }
    });
    
    test("can book an event on a given date", function () {
        expect(1);
        
        var calendar = ko.dataFor(this.elems.get(0)),
            date = new Date(2014, 2, 13),
            event = { name: "Some test event", where: "Somewhere" };
        calendar.createEvent(date, event);
        strictEqual(calendar.getDate(date).event(), event, "event was booked successfully"); 
    });
    
    test("can't book an event on a given date that already has an event", function () {
        expect(1);
        
        var calendar = ko.dataFor(this.elems.get(0)),
            date = new Date(2014, 2, 13),
            event = { name: "Some test event", where: "Somewhere" };
        throws(calendar.createEvent(date, event), "There is already an event scheduled on this date."); 
    });
    
}(jQuery));