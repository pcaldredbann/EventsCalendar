# Events Calendar

A generic 6-week events calendar implementing Knockout JS for persistent updating.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/paula/EventsCalendar/master/dist/EventsCalendar.min.js
[max]: https://raw.github.com/paula/EventsCalendar/master/dist/EventsCalendar.js

In your web page:

```html
<table class="event-calendar">
    <thead>
        <tr>
            <th colspan="7">April 2014</th>
        </tr>
        <tr>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
        </tr>
    </thead>
    <tbody data-bind="foreach: { data: weeks, as: 'week' }">
        <tr data-bind="foreach: { data: week.days, as: 'day' }">
            <td data-bind="click: day.setScheduledEvent">
                <span data-bind="text: day.date().getDate()"></span>
                <div data-bind="template: { name: 'tmpScheduledEvent', data: day.scheduledEvent }"></div>
            </td>
        </tr>
    </tbody>
</table>
<script id="tmpScheduledEvent" type="text/html">
    <p data-bind="text: name"></p>
</script>
<script src="jquery.js"></script>
<script src="dist/EventsCalendar.min.js"></script>
<script>
    (function ($) {
        $(".event-calendar").EventsCalendar({
            period: "April 2014"
        });
    }(jQuery));
</script>
```

## Documentation
