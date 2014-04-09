(function ($) {
    
    module("plugin", {
        setup: function () {
            this.elems = $("<div></div><div></div>");
        }
    });

    test("is chainable", function () {
        expect(1);

        strictEqual(this.elems.EventsCalendar(), this.elems, "it is chainable");
    });
    
    module("when initialized", {
        setup: function () {
            this.calendar = ko.dataFor($("<div></div>").EventsCalendar({ period: "April 2014" }).get(0));
        }
    });

    test("the calendar contains 6 weeks, each of which has 7 days with the correct periods", function () {
        expect(2);
        
        deepEqual(this.calendar.weeks()[0].days()[0].date(), new Date(2014, 2, 31), "start date is correct");
        deepEqual(this.calendar.weeks()[5].days()[6].date(), new Date(2014, 4, 11), "end date is correct");
    });
    
    test("the calendar's flattened weeks array (.days) contains 42 days", function () {
        expect(1);
        
        equal(this.calendar.days().length, 42, "has 42 days in flattened weeks array");
    });
    
    module("when events are scheduled", {
        setup: function () {
            this.elems = $("<div></div>");
        }
    });
    
    test("they're not saved until they're committed", function () {
        expect(2);
        
        var elem = this.elems.EventsCalendar({ period: "April 2014" }).get(0),
            calendar = ko.dataFor(elem),
            day = calendar.days()[0],
            event = new EventsCalendar.E({ name: "My Event", startTime: "09:00", endTime: "10:00" }),
            scheduledEvent = new EventsCalendar.eventStructure(event);
        day.scheduledEvent(scheduledEvent);
        deepEqual(ko.toJS(day.scheduledEvent), { name: undefined, startTime: undefined, endTime: undefined }, "still undefined");
        day.scheduledEvent.commit();
        deepEqual(day.scheduledEvent(), scheduledEvent, "committed successfully");
    });
    
    test("they can be rolled back", function () {
        expect(1);
        
        var calendar = ko.dataFor(this.elems.EventsCalendar({ period: "April 2014" }).get(0)),
            day = calendar.days()[0];
        day.scheduledEvent({ name: "My Event" });
        day.scheduledEvent.commit();
        day.scheduledEvent({ name: "My New Event" });
        day.scheduledEvent.rollback();
        deepEqual(day.scheduledEvent(), { name: "My Event" }, "event was committed successfully");
    });
    
    test("the custom callback is fired when scheduled event changes (and and is committed)", function () {
        expect(2);
        
        var updateThisWhenEventChanges = false,
            calendar = ko.dataFor(this.elems.EventsCalendar({
                period: "April 2014",
                onScheduledEventChange: function () {
                    updateThisWhenEventChanges = true;
                }
            }).get(0)),
            day = calendar.days()[0];
        day.scheduledEvent({ name: "My Event" });
        ok(!updateThisWhenEventChanges, "custom callback was fired");
        day.scheduledEvent.commit();
        ok(updateThisWhenEventChanges, "custom callback was fired");
    });    
    
}(jQuery));