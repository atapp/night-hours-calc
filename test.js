var nightCalc = require('./nighthourscalc'),
t = require('tap');

function equal(val1, val2) {
    return val1 === val2;
}

// Set up test values
var depDate = new Date('2018-03-05T15:45:00'),
    arrDate = new Date('2018-03-06T06:00:00'),
    depTimeString = '1545',
    depTimeEpoch = 1520264700,
    arrTimeString = '0600',
    arrTimeEpoch = 1519884000,
    //Portland
    depLat = 45.588611,
    depLng = -122.5975,
    //London
    arrLat = 51.4775,
    arrLng = -0.461389;

t.test('getTimes returns day and night times for the given dates and locations', function (t) {
    var nightTime = nightCalc.getTimes(depDate, arrDate, depLat, depLng, arrLat, arrLng);

    t.ok(equal(nightTime.night, 3.5), 'night time');
    
    t.end();
});
