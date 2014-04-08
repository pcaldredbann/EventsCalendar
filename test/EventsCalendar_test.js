(function ($) {

    module("Plugin", {
        setup: function () {
            this.elems = $("<div></div><div></div>");
        }
    });

    test("is chainable", function () {
        expect(1);

        strictEqual(this.elems.EventsCalendar(), this.elems, "it is chainable");
    });
    
    module("View model", {
        setup: function () {
            this.elems = $("<div></div>");
        }
    });

    test("contains 6 weeks, each of which has 7 days with the correct periods", function () {
        expect(2);
        
        this.elems.EventsCalendar({ period: "April 2014" });
        var calendar = ko.toJS(ko.dataFor(this.elems.get(0)));
        deepEqual(calendar.weeks[0].days[0].date, new Date(2014, 2, 31), "start date is correct");
        deepEqual(calendar.weeks[5].days[6].date, new Date(2014, 4, 11), "end date is correct");
    });
    
    test("can schedule an event on a given date", function () {
        expect(2);
        
        this.elems.EventsCalendar({ period: "April 2014" });
        var calendar = ko.dataFor(this.elems.get(0)),
            day = calendar.weeks()[0].days()[0];
        deepEqual(day.scheduledEvent(), undefined, "no event scheduled");
        day.scheduleEvent({ name: "My Event" });
        deepEqual(day.scheduledEvent(), { name: "My Event" }, "event has been scheduled");
        console.log(day.scheduledEvent());
    });
    
}(jQuery));