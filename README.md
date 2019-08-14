# Night Hours Calculator

Calculate aircraft night hours based on location of departure and recovery and civil twilight.

Does not account for altitude changes. V2 will incorporate Meeus Astronomical Algorithms.

---
## Requirements

For development, you will only need Node.js

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! After running the following command, just open the command line again.

    $ npm install npm -g

---

## Usage

Import into your project.

    var nightCalc = require('./nighthourscalc'),
    
    /**
    *@param Date() depDate A date object of the local time of departure.
    *@param Date() arrDate A date object of the local time of arrival.
    *@param Number depLat Departure latitude in decimal.
    *@param Number depLng Departure longitude in decimal.
    *@param Number arrLat Arrival latitude in decimal.
    *@param Number arrLng Ariival longitude in decimal.
    *@return Object Returns a object {Number night (total night time), String error (can be null)}
    **/

    var depDate = new Date('2018-03-05T15:45:00'),
    arrDate = new Date('2018-03-06T06:00:00'),
    //Portland
    depLat = 45.588611,
    depLng = -122.5975,
    //London
    arrLat = 51.4775,
    arrLng = -0.461389;
    
    let nightCalculation = nightCalc.getTimes(depDate, arrDate, depLat, depLng, arrLat, arrLng);

    let nightTime = nightCalculation.night;
    let nightError = nightCalculation.error;
