var nightCalc = require('./nightcalc'),
t = require('tap');

function equal(val1, val2) {
    return val1 === val2;
}

// Set up test values
var date = new Date('2018-03-05UTC'),
    depTimeString = '1545',
    depTimeEpoch = 1520264700,
    arrTimeString = '0600',
    arrTimeEpoch = 1519884000,
    depLat = 45.588611,
    depLng = -122.5975,
    arrLat = 51.4775,
    arrLng = -0.461389;
    
t.test('getTimes returns day and night times for the given date and time string and location', function (t) {
    var nightTime = nightCalc.getTimes(date, depTimeString, depLat, depLng, arrLat, arrLng);

    t.ok(equal(nightTime.day, -2.5003175907168385), 'day time');
    t.ok(equal(nightTime.night, -0.7000406838781611), 'night time');
    t.end();
});

t.test('getTimes returns day and night times for the given epoch times and location', function (t) {
    var nightTime = nightCalc.getTimes(depTimeEpoch, arrTimeEpoch, arrLat, arrLng);
    
    t.ok(equal(nightTime.day, 1.5), 'day time');
    t.ok(equal(nightTime.night 1.5), 'night time');
});

t.test('getTimes returns day and night timesfor the given moments and location', function (t) {
    var nightTime = nightCalc.getTimes(depMoment, arrMoment, depLat, depLng, arrLat, arrLng);
    
    t.ok(equal(nightTime.day, 1.5), 'day time');
    t.ok(equal(nightTime.night 1.5), 'day time');
});
