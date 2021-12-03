import { getFeedEntityDate, isToday } from "./business"

const today = "2021-10-11T14:31:06.585Z"

it('Check if jest is configured in UTC', function() {
    expect(new Date().getTimezoneOffset()).toBe(0)
});

it('should be a today date', function() {
    expect(isToday("2021-10-11T10:31:06.585Z", today))
})

it('should be a yesterday date', function() {
    expect(isToday("2021-09-11T14:31:06.585Z", today))
})

it('Date < 24h: should get the delta from current date in hours', function() {
    expect(getFeedEntityDate("2021-10-11T11:31:06.585Z", today)).toEqual("3 hours ago")
})

it('Date >= 24h: should extract the hour of the corresponding day', function() {
    expect(getFeedEntityDate("2021-09-11T11:14:00.585Z", today, "12")).toEqual("11:14 AM")
    expect(getFeedEntityDate("2021-09-11T14:14:00.585Z", today, "24")).toEqual("14:14")
})