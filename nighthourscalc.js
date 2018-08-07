/*
(c) 2018 - 2020, Simon Hogg
 NightHoursCalc is a JavaScript library for calculating aircrew night hours.
 https://github.com/atapp/night-hours-calc
*/

(function () { 'use strict';
              
// variables for functions

var PI   = Math.PI,
    sin  = Math.sin,
    cos  = Math.cos,
    tan  = Math.tan,
    asin = Math.asin,
    atan = Math.atan2,
    acos = Math.acos,
    rad  = PI / 180,
    e = rad * 23.4397, // obliquity of the Earth
    // millisecond conversions
    dayMs = 1000 * 60 * 60 * 24, 
    J1970 = 2440588,
    J2000 = 2451545,
    J0 = 0.0009;   

var NightHoursCalc = {};
              
NightHoursCalc.getTimes = function(departureDate, recoveryDate, depLat, depLng, arrLat, arrLng) {
    
    // Get Sun Times
  var departureSunTimes = getSunTimes(
    departureDate,
    depLat,
    depLng,
  );
  
  var arrivalSunTimes = getSunTimes(
    recoveryDate,
    arrLat,
    arrLng,
  );
  
  // Convert to Civil Twightlight
  var departureCivilTwighlightStart = departureSunTimes.sunset.getTime() + 1500000;
  var departureCivilTwighlightEnd = departureSunTimes.sunrise.getTime() - 1500000;
  var arrivalCivilTwighlightStart = arrivalSunTimes.sunset.getTime() + 1500000;
  var arrivalCivilTwighlightEnd = arrivalSunTimes.sunrise.getTime() - 1500000;

  var takeOffInMorning = false,
   takeOffInDay = false,
   takeOffInEvening = false,
   landThisDay = false,
   landNextDay = false,
   landInMorning = false,
   landInDay = false,
   landInEvening = false;
    
  var upTime = departureDate.getTime();
  var downTime = recoveryDate.getTime();
  var upDay = departureDate.getDay();
  var downDay = recoveryDate.getDay();
  
  var result = {};

  // Figure out take off logic
  if (departureCivilTwighlightEnd < upTime && departureCivilTwighlightStart > upTime) {
    takeOffInDay = true;
  } else if (upTime < departureCivilTwighlightEnd) {
    takeOffInMorning = true;
  } else if (upTime > departureCivilTwighlightStart) {
    takeOffInEvening = true;
  } else {
    result.error = 'Cant get Take Off logic';
  }

  // Figure out landing day logic
  if (upDay === downDay) {
    landThisDay = true;
  } else if (downDay > upDay) {
    landNextDay = true;
  } else {
    result.error = 'Cant get Landing Day logic';
  }

  // Figure out landing logic
  if (arrivalCivilTwighlightStart < downTime && arrivalCivilTwighlightEnd > downTime) {
    landInDay = true;
  } else if (downTime < arrivalCivilTwighlightEnd) {
    landInMorning = true;
  } else if (downTime > arrivalCivilTwighlightStart) {
    landInEvening = true;
  } else {
    result.error = 'Cant get Landing logic';
  }

  // take off in day land that day
  if (takeOffInDay && landInDay && landThisDay) {
    result.time = 0;
    result.error = null;
  }
  // take off in day, land next day
  else if (takeOffInDay && landInDay && landNextDay) {
    result.time = round(
      Math.abs((arrivalCivilTwighlightEnd - departureCivilTwighlightStart) / 3600000), 1);
    result.error = null;
  }
  // take off in day, land that night
  else if (takeOffInDay && landInEvening && landThisDay) {
    result.time = round(Math.abs((downTime - departureCivilTwighlightStart) / 3600000), 1);
    result.error = null;
  }
  // take off in day, land next morning
  else if (takeOffInDay && landInMorning && landNextDay) {
    result.time = round(Math.abs((downTime - departureCivilTwighlightStart) / 3600000), 1);
    result.error = null;
  }
  // take off before sunrise, land before sunrise
  else if (takeOffInMorning && landInMorning && landThisDay) {
    result.time = round(Math.abs((downTime - upTime) / 3600000), 1);
    result.error = null;
  }
  // take off before sunrise, land in day
  else if (takeOffInMorning && landInDay && landThisDay) {
    result.time = round(Math.abs((arrivalCivilTwighlightEnd - upTime) / 3600000), 1);
    result.error = null;
  }
  // take off before sunrise, land that evening
  else if (takeOffInMorning && landInEvening && landThisDay) {
    result.time = round(Math.abs((departureCivilTwighlightEnd - upTime) / 3600000), 1)
      + round(Math.abs((downTime - arrivalCivilTwighlightStart) / 3600000), 1);
    result.error = null;
  }
  // take off before sunrise, land next morning
  else if (takeOffInMorning && landInMorning && landNextDay) {
    result.time = round(Math.abs((departureCivilTwighlightEnd - upTime) / 3600000), 1)
      + round(Math.abs((downTime - departureCivilTwighlightStart) / 3600000), 1);
    result.error = null;
  }
  // take off in evening, land in evening
  else if (takeOffInEvening && landInEvening && landThisDay) {
    result.time = round(Math.abs((downTime - upTime) / 3600000), 1);
    result.error = null;
  }
  // take off in evening, land next morning
  else if (takeOffInEvening && landInMorning && landNextDay) {
    result.time = round(Math.abs((downTime - upTime) / 3600000), 1);
    result.error = null;
  }
  // take off in evening, land next day
  else if (takeOffInEvening && landInDay && landNextDay) {
    result.time = round(Math.abs((arrivalCivilTwighlightEnd - upTime)), 1);
    result.error = null;
  } else {
    result.time = 0;
    result.error = 'No time logic working';
  }
    return {
        night: result.time,
        error: result.error
    }
}
              
// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

// rounding function for time hours in decimal return values
              
function round(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
              
var times = [
    [-0.833, 'sunrise',       'sunset'      ],
    [  -0.3, 'sunriseEnd',    'sunsetStart' ],
    [    -6, 'dawn',          'dusk'        ],
    [   -12, 'nauticalDawn',  'nauticalDusk'],
    [   -18, 'nightEnd',      'night'       ],
    [     6, 'goldenHourEnd', 'goldenHour'  ]
];

// date/time constants and conversions

function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
function toDays(date)   { return toJulian(date) - J2000; }


// general calculations for position

function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }

function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }

function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }

function astroRefraction(h) {
    if (h < 0) // the following formula works for positive altitudes only.
        h = 0; // if h = -0.08901179 a div/0 would occur.

    // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
    // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
    return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

// general sun calculations

function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }

function eclipticLongitude(M) {

    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
        P = rad * 102.9372; // perihelion of the Earth

    return M + C + P + PI;
}

function sunCoords(d) {

    var M = solarMeanAnomaly(d),
        L = eclipticLongitude(M);

    return {
        dec: declination(L, 0),
        ra: rightAscension(L, 0)
    };
}

// calculations for sun times

function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }

function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }

function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

// returns set time for the given sun altitude
function getSetJ(h, lw, phi, dec, n, M, L) {

    var w = hourAngle(h, phi, dec),
        a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
}


// calculates sun times for a given date and latitude/longitude

function getSunTimes(date, lat, lng) {

    var lw = rad * -lng,
        phi = rad * lat,

        d = toDays(date),
        n = julianCycle(d, lw),
        ds = approxTransit(0, lw, n),

        M = solarMeanAnomaly(ds),
        L = eclipticLongitude(M),
        dec = declination(L, 0),

        Jnoon = solarTransitJ(ds, M, L),

        i, len, time, Jset, Jrise;


    var result = {};

    for (i = 0, len = times.length; i < len; i += 1) {
        time = times[i];

        Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
        Jrise = Jnoon - (Jset - Jnoon);

        result[time[1]] = fromJulian(Jrise);
        result[time[2]] = fromJulian(Jset);
    }

    return result;
};

// export as Node module / AMD module / browser variable
if (typeof exports === 'object' && typeof module !== 'undefined') module.exports = NightHoursCalc;
else if (typeof define === 'function' && define.amd) define(NightHoursCalc);
else window.NightTimeCalc = NightHoursCalc;

}());
