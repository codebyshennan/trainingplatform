
import {readFile} from 'fs';
import tcx from 'tcx-js';
import { JSDOM } from 'jsdom';
import {SportsLib} from '@sports-alliance/sports-lib';

import { DOMParser } from 'xmldom'

// // Input and output file path
// const inputFilePath = 'example.fit';
// const outputGpxFilePath = 'example.gpx';

// // reads the FIT file into memory
// const inputFile = fs.readFileSync(inputFilePath, null);
// if (!inputFile || !inputFile.buffer) {
//     console.error('Ooops, could not read the inputFile or it does not exists, see details below');
//     console.error(JSON.stringify(inputFilePath));
// }
// const inputFileBuffer = inputFile.buffer;
// // uses lib to read the FIT file
// SportsLib.importFromFit(inputFileBuffer).then((event) => {
//     // convert to gpx
//     const gpxPromise = new EventExporterGPX().getAsString(event);
//     gpxPromise.then((gpxString) => {
//         // writes the gpx to file
//         fs.writeFileSync(outputGpxFilePath, gpxString, (wError) => {
//             if (wError) {
//                 console.error('Ooops, something went wrong while saving the GPX file, see details below.');
//                 console.error(JSON.stringify(wError));
//             }
//         });
//         // all done, celebrate!
//         console.log('Converted FIT file to GPX successfully!');
//         console.log('GPX file saved here: ' + outputGpxFilePath);
//     }).catch((cError) => {
//         console.error('Ooops, something went wrong while converting the FIT file, see details below');
//         console.error(JSON.stringify(cError));
//     });
// });
// const parser = new DOMParser();

// var infile = "garmin.tcx"
// var parser = new tcx.Parser(infile);
// // console.log(parser.activity.trackpoints[0].heart_rate_bpm);
// const HRreducer = (accumulator, trkpt) =>
//     accumulator + Number(trkpt.heart_rate_bpm);
// const distreducer = (accumulator, trkpt) =>
//     accumulator + Number(trkpt.distance_km);
// //
// const arrayofHR = parser.activity.trackpoints.map(x => 
//   x.heart_rate_bpm
//   )

// console.log('activitytype >> ', parser.activity.sport)
// console.log('datetime >> ', parser.activity.activityId)
// console.log('startingepoch >> ', parser.activity.startingEpoch)


// // avgHR
// console.log('average HR >> ', parser.activity.trackpoints.reduce(HRreducer,0) / parser.activity.trackpoints.length);

// distance 
// console.log('total distance >> ', parser.activity.trackpoints.reduce(distreducer,0));

// console.log('total distance in km >> ', parser.activity.trackpoints[parser.activity.trackpoints.length-1].distance_km)

// // maxHR
// console.log('Max HR >> ', Math.max(...arrayofHR));

// console.log(Object.keys(parser.activity))
// console.log(parser)

let domString = readFile('garmin.tcx', 'utf-8', (err,data)=>{
  console.log(typeof data)
  SportsLib.importFromTCX(new DOMParser().parseFromString(data,'text/xml')).then((event)=>{
  // do Stuff with the file
  // so much work just to get the calories
    console.log('calories >> ', event.activities[0].stats.get('Energy').value);
    console.log('timetaken in secs >> ', event.activities[0].stats.get('Duration').value);
    console.log('distance >> ', event.activities[0].stats.get('Distance').value / 1000);
    console.log('maxHR >> ', event.activities[0].stats.get('Maximum Heart Rate').value);
    console.log('avgHR >> ', event.activities[0].stats.get('Average Heart Rate').value);
    console.log('startdate >> ', event.activities[0].startDate);
    console.log('enddate >> ', event.activities[0].endDate);
    console.log('activitytype >> ', event.activities[0].type);
  });
})
// console.log('domString >> ', domString)


// const doc = 


// // // For TCX you need a string 



// const x = new JSDOM(domString);
// console.log('x >> ', x.window.document)