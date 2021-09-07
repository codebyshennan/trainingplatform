import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import pg from "pg";
import jsSHA from "jssha";
import multer from 'multer';
import fs from 'fs';
import { SportsLib } from '@sports-alliance/sports-lib';
import { EventExporterGPX } from '@sports-alliance/sports-lib/lib/events/adapters/exporters/exporter.gpx.js'
import { DOMParser } from 'xmldom'
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

// if (process.env.NODE_ENV !== 'production') {
  // require('dotenv').config();
// }

// const s3 = new aws.S3({
//   accessKeyId: process.env.ACCESSKEYID,
//   secretAccessKey: process.env.SECRETACCESSKEY,
// });

// const multerFileUpload = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'trgpks-bucket',
//     acl: 'public-read',
//     metadata: (request, file, callback) => {
//       callback(null, { fieldName: file.fieldname });
//     },
//     key: (request, file, callback) => {
//       callback(null, Date.now().toString());
//     },
//   }),
// });

// initialise express and define port parameters
const app = express();
const PORT = process.env.PORT || 3001;
const SALT = process.env.SALT || 'rocketacademy';



// set the name of the upload directory here
const multerFileUpload = multer({ dest: 'uploads/trainingfiles/' });
const multerPhotoUpload = multer({ dest: 'uploads/profilephotos/' });

// disables extensibility of URL encoding
app.use(express.urlencoded( {extended: false} ));
app.use(express.json())

// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('_method'));
app.use(cookieParser());

// enables Express to serve files from a local folder called 'public', and renames the route as /static;
app.use('/static', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs');

// create separate DB connection configs for production vs non-production environments.
// ensure our server still works on our local machines.
let pgConnectionConfigs;
if (process.env.ENV === 'PRODUCTION') {
  // determine how we connect to the remote Postgres server
  pgConnectionConfigs = {
    user: 'postgres',
    // set DB_PASSWORD as an environment variable for security.
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'trainingpeaks',
    port: 5432,
  };
} else {
  // determine how we connect to the local Postgres server
  pgConnectionConfigs = {
    user: 'wonggshennan',
    host: 'localhost',
    database: 'trainingpeaks',
    port: 5432,
  };
}

// postgres middleware
const {Pool} = pg;
const pool = new Pool(pgConnectionConfigs);
pool.connect();

// Helper functions

// returns the time in seconds from a string
const gettime = (timeelem) => {
    const array = timeelem.split(':');
    if(array.length === 0 || array[0]=== '') return 0;
    const hours = +array[0] * 60 * 60;
    const minutes = +array[1] * 60;
    const seconds = +array[2];

    const sum = hours+minutes+seconds
    return sum;
  }

let session;

// initialises session usage; each session lasts an hour
app.use(
  sessions(
    {
      secret: "hash",
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60}, //an hour
      resave: false,
    }
  )
)

// generate the hashed + salt version of the input
const getHash = (input) => {
  const shaObj = new jsSHA ('SHA-512','TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);

  return shaObj.getHash('HEX');
}

// middleware to countercheck for alteration of userhash / forgery
app.use((req,res,next)=>{
  session = req.session;
  session.loggedin = false;

  if(session.loggedinhash && session.userid) {
    const hash = getHash(session.userid);

    if(session.loggedinhash === hash) {
      session.loggedin = true;
    }
  }
  next();
})

// auth middleware to restrict user states
const checkAuth = (req,res,next)=> {

  // restricts the user to only pages that correlate to his userid
  const {index} = req.params;

  console.log('Checking Auth');

  if(session.loggedin === false){
    console.log('Access Denied');
    res.redirect('/athlete/login');
    return;
  } 
  
  if (index != session.userid){
    console.log('Unauthorised Access');
    res.redirect('/athlete/login');
    return;
  } else {
      const values = [session.userid];
      pool.query(`SELECT * FROM athlete WHERE id = $1`, values, (err,result)=>{

        if (err || result.rows.length === 0) {
          console.log('err >> ', err)
          res.redirect('/athlete/login');
          return;
        }

        // set the user as a key in the request obj so that it's accessible in the route
        req.user = result.rows[0];
        console.log('Authorised');

        next();
      })

      // make sure we don't get to the next() below
      return;
    }
  }

// base route to login page
app.get('/', (req,res)=> {
  res.render('home'); 
})

app.get('/about',(req,res)=>{
  res.render('home');
})

// registration for athlete
app.get('/register', (req,res)=> {
  res.render('register');
}).post('/register',(req,res)=> {

  const newregister = req.body; 

  const shaObj = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
  shaObj.update(newregister.password);
  const hashedpassword = shaObj.getHash('HEX');

  const values = [newregister.fname, newregister.lname, newregister.username, hashedpassword]; 

  if(newregister.usertype === 'coach') {
    pool.query(`INSERT INTO coach (fname, lname, username, password) 
                VALUES ($1,$2,$3,$4) RETURNING *`, values,
                (err,result)=> {
                  if(err) {console.error(err)}
                  res.send('success');
                  })
  } else {
    pool.query(`INSERT INTO athlete (fname, lname, username, password) 
                VALUES ($1,$2,$3,$4) RETURNING *`, values,
                (err,result)=> {
                  if(err) {console.error(err)}
                  res.send('success');
                  })
    }
  });

// login routes for an athlete
app.get('/athlete/login', (req,res)=>{
  res.render('login');
}).post('/athlete/login', (req,res)=>{
  const username = req.body.username;
  pool.query(`SELECT * FROM athlete WHERE username = '${username}'`, (err, result)=> {
    if(err){
      console.error(err);
      res.status(503).send(err);
    }

    console.log('result >> ', result.rows)
    if (result.rows.length === 0){
      res.status(403).send('login failed')
      return;
        }

    const user = result.rows[0];

    // check if the input password matches the registered user password
    const shaPW = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaPW.update(req.body.password);
    const hashedpassword = shaPW.getHash('HEX');

    if(user.password!==hashedpassword) {
      res.status(403).send('login failed');
      return;
    }

    // if password is correct, set the session parameters
    session = req.session;
    
    const shaUsr = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaUsr.update(`${user.id}-${SALT}`);
    const hasheduser = shaUsr.getHash('HEX');

    // session takes in loggedinhash, userid, loggedin boolean
    session.loggedinhash = hasheduser;
    session.userid = user.id;
    session.username = user.username;
    session.loggedin = true;
    console.log('session>> ', session);
    res.redirect(`/athlete/${user.id}/dashboard`)

    } 
  )
})

// Route for logging photos
app.use((req,res,next)=> {
  
  console.log(req.session)
  if(req.session.profilepic){
    next();
    return;
  }

  if(req.session.userid) {

    const id = req.session.userid;

    pool.query(`SELECT * FROM profilephotos WHERE athleteid = ${id}`, (err, data) => {
      if(err) {
        console.error(err);
        return;
      }
      
      if(data.rows.length === 0) {
        req.session.profilepic = 'new';
        return;
      }

      const profilehash = data.rows[0].photo;
      req.session.profilepic = profilehash.toString();

    })
  }

  next();
})

const getToDoList = (req,res,next) => {
  const {index} = req.params;
  pool.query('SELECT * FROM todolist WHERE athleteid = $1', [index], (err,data)=>{
    res.locals.todolist = JSON.stringify(data.rows);
  })
  next();
}

// User Story #1: Athlete should be able to get an overview of his training status
// Athlete Dashboard
app.get('/athlete/:index/dashboard', checkAuth, getToDoList, (req,res)=> {

  const {index} = req.params;

  // for the stats charts
  pool.query(`SELECT * FROM training WHERE athleteid = ${index} ORDER BY datetime ASC`, (err,result)=> {

    const nooftrainings = result.rows.length;

    // returns an array of today's training
    const todaydata = result.rows.filter(data => new Date(data.datetime).toDateString() === new Date().toDateString());

    const thismonthdata = result.rows.filter(data => new Date(data.datetime).getMonth() === new Date().getMonth() && new Date(data.datetime).getFullYear() === new Date().getFullYear())

    const onlyUnique = (value,index,self) => {
      return self.indexOf(value) === index;
    }
    
    const activitytypes = result.rows.map(data => data.activitytype).filter(onlyUnique)

    const toChartArray = (tally) => {
      let chartarray = []
      for(const type in tally) {
        chartarray.push({'x':type, 'y':tally[type]});
      }
      return chartarray;
    }

    const typetally = (type, data) => {
      let activitytally = {}
      for(let x=0; x < data.length; x++) {
        let activity = data[x].activitytype
        if (activity in activitytally) {
          activitytally[activity] += Number(data[x][type])
        } else {
          activitytally[activity] = 0;
        }
      }

      
      return activitytally;
    }

    const activitytypetally = (data) => {
      let activitytally = {}
      for(let x=0; x < data.length; x++) {
        let activity = data[x].activitytype
        if (activity in activitytally) {
          activitytally[activity] += 1;
        } else {
          activitytally[activity] = 0;
        }
      }

      let chartarray = []
      for(const type in activitytally) {
        chartarray.push({'x':type, 'y':activitytally[type]});
      }

      return activitytally;
    }
    
    const distancereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.distance) 
    const caloriereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.calories)
    const hrreducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.avghr)
    const pacereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.avgpace)
    const durationreducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(gettime(currentvalue.timetaken))
    
    //all time data
    const alltimedistance = result.rows.reduce(distancereducer);
    const alltimecalories = result.rows.reduce(caloriereducer);
    const alltimeavghr = result.rows.reduce(hrreducer) / nooftrainings;
    const alltimeduration = result.rows.reduce(durationreducer);
    const alltimeavgpace = result.rows.reduce(pacereducer);

    //data this month
    const thismonthcalories = thismonthdata.reduce(caloriereducer,0);
    const thismonthdistance = thismonthdata.reduce(distancereducer,0);
    const thismonthduration = thismonthdata.reduce(durationreducer,0);
    const thismonthavghr = thismonthdata.reduce(hrreducer,0) / thismonthdata.length;
    const thismonthavgpace = thismonthdata.reduce(pacereducer,0) / thismonthdata.length; 

    const timetally = (data) => {
      let activitytally = {}
      for(let x=0; x < data.length; x++) {
        let activity = data[x].activitytype
        if (activity in activitytally) {
          activitytally[activity] += gettime(data[x]['timetaken'])
        } else {
          activitytally[activity] = 0;
        }
      }

      return activitytally;
    }

    //segment by sports
    const caloriebysport = typetally('calories', result.rows);
    const distancebysport = typetally('distance', result.rows);
    const durationbysport = timetally(result.rows);
    const combinedhrbysport = typetally('avghr', result.rows);

    const chartcalorie = toChartArray(caloriebysport)
    const chartdistance = toChartArray(distancebysport)
    const chartduration = toChartArray(durationbysport)
    

    const avghrbysport = (()=> {
                          Object.keys(combinedhrbysport).forEach( sport => {
                          combinedhrbysport[sport] /= activitytypetally(result.rows)[sport]
                          })
                          return combinedhrbysport;
                        })();

                              
    const combinedpacebysport = typetally('avgpace', result.rows);
    const avgpacebysport = (()=> {
                            Object.keys(combinedpacebysport).forEach(sport => {
                            combinedpacebysport[sport] /= activitytypetally(result.rows)[sport]
                            })
                            return combinedpacebysport;
                          })();

    const chartavgpace = toChartArray(avgpacebysport)
    const chartavghr = toChartArray(avghrbysport)

    
    // console.log(data);
    const output = { data: 
                      {
                        index: index,
                        thismonthactivity: thismonthdata.length,
                        todolist: res.locals.todolist,
                        username: req.session.username, 
                        title: "DashBoard",
                        activitytypes: activitytypes,
                        todaydata: todaydata, // if date is today
                        alltimedistance: alltimedistance,
                        alltimecalories: alltimecalories,
                        alltimeavghr: alltimeavghr,
                        alltimeduration: alltimeduration,
                        alltimeavgpace: alltimeavgpace,
                        thismonthcalories: thismonthcalories,
                        thismonthdistance: thismonthdistance,
                        thismonthduration: thismonthduration,
                        thismonthavghr: thismonthavghr,
                        thismonthavgpace: thismonthavgpace,
                        caloriebysport: chartcalorie,
                        distancebysport: chartdistance,
                        durationbysport: chartduration,
                        avghrbysport: chartavghr,
                        avgpacebysport: chartavgpace,
                        activitytypetally: toChartArray(activitytypetally(result.rows)),
                        chartdata: result.rows
                      }
                    };
    console.log('output >> ', output);
      res.render('dashboard', output);
  })
}).post('/athlete/:index/dashboard/todo', checkAuth, (req,res)=> {

  const {todo} = req.body;
  const {index} = req.params;
  const queryinput = [index, todo];
  console.log(queryinput)
  pool.query("INSERT INTO todolist (athleteid, todo) VALUES ($1,$2) RETURNING *", queryinput, (err,data)=> {
    res.status(200).send(data.rows);
  } )
}).delete('/athlete/:index/dashboard/todo', checkAuth, (req,res)=> {
  const {id} = req.body;

  pool.query('DELETE FROM todolist WHERE id = $1 RETURNING *', [id], (err,data)=> {
    res.status(200).send(data.rows);
  })
})

// dead route: used to get column names
const getFormLabels = (req,res,next) => {
  pool.query('SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = \'training\';')
  .then((result)=>{
    let dataarray = []
    result.rows.forEach(x => dataarray.unshift(x.column_name.toUpperCase()));
    // remove last three
    const columnnames = dataarray.slice(0, dataarray.length - 3);
    res.locals.columns = JSON.stringify(columnnames);
    next();
  })
}

// User Story #: Athlete should be see his training schedule, past, present, future, and be able to add activities
// athlete schedule
/**
 * @param  {index/schedule'} '/athlete/
 * @param  {} checkAuth
 * @param  {} getFormLabels
 * @param  {} req
 * @param  {} res
 */
app.get('/athlete/:index/schedule', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log('req.session.username >> ', req.session.username)
  pool.query(`SELECT * FROM training WHERE athleteid = ${index}`, (err,result)=> {

        const output = {data: 
                        {
                          index: index,
                          columnnames: res.locals.columns,
                          data: JSON.stringify(result.rows),
                          title: "Schedule",
                          username: req.session.username, 
                        }
                      };

                      console.log(output)
      res.render('schedule', output);
  })
})

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */

const extractInfo = (req,res,next) => {
  const {index} = req.params
  // TODO: detect filetype and parse accordingly
  const extension = req.file.originalname.substr(req.file.originalname.length-3,3)
  console.log(extension)
  const filepath = req.file.path
  let outputGpxFilePath = 'uploads/trainingfiles/tmp.gpx'

  switch (extension) {
    case 'tcx':
      
      fs.readFile(filepath, 'utf-8', (error, readFileResult)=>{
      SportsLib.importFromTCX(new DOMParser().parseFromString(readFileResult,'text/xml'))
      .then((importResult)=>{
      // do Stuff with the file
      // so much work just to get the calories
        const jsondata = importResult.toJSON();
        console.log(jsondata)
        const values = [
          jsondata.stats.description, //description
          jsondata.stats['Activity Types'][0],// activitytype
          new Date(jsondata.startDate).toISOString(), //datetime
          jsondata['name'], // title
          jsondata.stats.Distance / 1000, // distance
          jsondata.stats.Energy, // calories
          new Date(jsondata.stats.Duration * 1000).toISOString().substr(11,8), // timetaken
          jsondata.stats['Minimum speed in kilometres per hour'],// minpace
          jsondata.stats['Average speed in kilometres per hour'],// avgpace
          jsondata.stats['Maximum speed in kilometres per hour'],// maxpace
          jsondata.stats['Minimum Heart Rate'],// minhr
          jsondata.stats['Average Heart Rate'], // avghr
          jsondata.stats['Maximum Heart Rate'], // maxhr
          req.session.userid, // athleteid
          req.session.username, // createdby
        ]

        pool.query(`INSERT INTO 
        training (description, activitytype, datetime, title, distance, calories, timetaken, minpace, avgpace, maxpace, minhr, avghr, maxhr, athleteid, createdby) 
        VALUES   ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
        RETURNING *`, values)
        .then((queryResult)=>{
          res.redirect(`/athlete/${index}/schedule`);
        })
      });
    })
      
      break;
    
    case 'fit':
      
      // reads the FIT file into memory
      const inputFile = fs.readFileSync(filepath, null);
      if (!inputFile || !inputFile.buffer) {
          console.error('Ooops, could not read the inputFile or it does not exists, see details below');
          console.error(JSON.stringify(filepath));
          return;
      }
      const inputFileBuffer = inputFile.buffer;
      // uses lib to read the FIT file
      SportsLib.importFromFit(inputFileBuffer)
        .then((event) => {
            // convert to gpx
            const gpxPromise = new EventExporterGPX().getAsString(event);
            gpxPromise.then((gpxString) => {
                // writes the gpx to file
                fs.writeFileSync(outputGpxFilePath, gpxString, (wError) => {
                    if (wError) {
                        console.error('Ooops, something went wrong while saving the GPX file, see details below.');
                        console.error(JSON.stringify(wError));
                    }
                });
                // all done, celebrate!
                console.log('Converted FIT file to GPX successfully!');
                console.log('GPX file saved here: ' + outputGpxFilePath);
            }).catch((cError) => {
                console.error('Ooops, something went wrong while converting the FIT file, see details below');
                console.error(JSON.stringify(cError));
            });
        })
          .then((event) => {
            fs.readFile(outputGpxFilePath, 'utf-8', (error, readFileResult)=>{ //custom DOMParser should be included as an argument
              SportsLib.importFromGPX(readFileResult, DOMParser)
              .then((importResult)=>{
              // do Stuff with the file
              // so much work just to get the calories
                const jsondata = importResult.toJSON();
                console.log(jsondata)
                const values = [
          jsondata.stats.description, //description
          jsondata.stats['Activity Types'][0],// activitytype
          new Date(jsondata.startDate).toISOString(), //datetime
          jsondata['name'], // title
          jsondata.stats.Distance / 1000, // distance
          jsondata.stats.Energy, // calories
          new Date(jsondata.stats.Duration * 1000).toISOString().substr(11,8), // timetaken
          jsondata.stats['Minimum speed in kilometres per hour'],// minpace
          jsondata.stats['Average speed in kilometres per hour'],// avgpace
          jsondata.stats['Maximum speed in kilometres per hour'],// maxpace
          jsondata.stats['Minimum Heart Rate'],// minhr
          jsondata.stats['Average Heart Rate'], // avghr
          jsondata.stats['Maximum Heart Rate'], // maxhr
          req.session.userid, // athleteid
          req.session.username, // createdby
        ]

        pool.query(`INSERT INTO 
        training (description, activitytype, datetime, title, distance, calories, timetaken, minpace, avgpace, maxpace, minhr, avghr, maxhr, athleteid, createdby) 
        VALUES   ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
        RETURNING *`, values)
                .then((queryResult)=>{
                  res.redirect(`/athlete/${index}/schedule`);
                })
              });
            })
          })
      
      break;

    case 'gpx':
      fs.readFile(filepath, 'utf-8', (error, readFileResult)=>{
        //custom DOMParser should be included as an argument
      SportsLib.importFromGPX(readFileResult, DOMParser)
      .then((importResult)=>{
      // do Stuff with the file
      // so much work just to get the calories
        const jsondata = importResult.toJSON();
        const values = [
          jsondata.stats.description, //description
          jsondata.stats['Activity Types'][0],// activitytype
          new Date(jsondata.startDate).toISOString(), //datetime
          jsondata['name'], // title
          jsondata.stats.Distance / 1000, // distance
          jsondata.stats.Energy, // calories
          new Date(jsondata.stats.Duration * 1000).toISOString().substr(11,8), // timetaken
          jsondata.stats['Minimum speed in kilometres per hour'],// minpace
          jsondata.stats['Average speed in kilometres per hour'],// avgpace
          jsondata.stats['Maximum speed in kilometres per hour'],// maxpace
          jsondata.stats['Minimum Heart Rate'],// minhr
          jsondata.stats['Average Heart Rate'], // avghr
          jsondata.stats['Maximum Heart Rate'], // maxhr
          req.session.userid, // athleteid
          req.session.username, // createdby
        ]

        pool.query(`INSERT INTO 
        training (description, activitytype, datetime, title, distance, calories, timetaken, minpace, avgpace, maxpace, minhr, avghr, maxhr, athleteid, createdby) 
        VALUES   ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
        RETURNING *`, values)
        .then((queryResult)=>{
          res.redirect(`/athlete/${index}/schedule`);
        })
      });
    })
      
      break;
  
    default: res.send(alert('Invaid file format'));
      break;
  }
}

const updateDB = (req, res)=> {
    const sqlQuery = 'INSERT INTO trainingfiles (athleteid, trainingfile) VALUES ($1, $2) RETURNING *';
    // get the photo column value from request.file
    const values = [req.session.userid, req.file.filename];

    // Query using pg.Pool instead of pg.Client
    pool.query(sqlQuery, values, (error, result) => {
      if (error) {
        console.log('Error executing query', error.stack);
        res.status(503).send(result.rows);
        return;
      }
      console.log("resultrows", result.rows[0].name);
      res.send(console.log(result.rows));
    })
  }

const addActivity = (req, res, next)=> {
  if(req.file){
    console.log('File detected, uploading...')
    next();
    return;

  } else {
 
    const {index} = req.params;
    const {startdate, time} = req.body;
    const timestamp = new Date(startdate.concat(' ',time));
    const {description, activitytype, perceivedexertion, title, actualdistance, actualcalories, actualtimetaken, feeling, minpace, avgpace, maxpace,minhr,avghr,maxhr} = req.body;
    const traininginsert = [description,activitytype,perceivedexertion,timestamp,title,actualdistance,actualcalories,actualtimetaken,feeling,minpace,avgpace,maxpace,minhr,avghr,maxhr,index, req.session.username]
    const {comments} = req.body;
    const coach = res.locals.coachname;


    pool.query(`INSERT INTO 
        training (description, activitytype, perceivedexertion,datetime, title, distance, calories, timetaken, feeling, minpace, avgpace, maxpace, minhr, avghr, maxhr, athleteid, createdby) 
        VALUES   ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, $17) 
        RETURNING *`, traininginsert)
    .then((result)=>{
      pool.query(`INSERT INTO comments (trainingid, sendfrom, sendto, comments) VALUES (${result.rows[0].id},${req.session.username},${coach},${comments}) RETURNING *`)
    }).then((data)=> {
      res.redirect('schedule');
    })
  }
}

const getCoach = (req,res,next) => {
  const {index} = req.params;
  pool.query(`SELECT coachid FROM relation WHERE athleteid = ${index}`)
  .then(queryrelationResult => {
    console.log('result.rows >> ', queryrelationResult.rows[0].coachid)
    pool.query(`SELECT * FROM coach WHERE id = '${queryrelationResult.rows[0].coachid}'`)
    .then(querycoachResult => {
      console.log('result.rows >> ', querycoachResult)
      res.locals.coachname = querycoachResult.rows[0].username;
      next();
    })

  next();
  })
}


app.post('/athlete/:index/schedule/addactivity', checkAuth, multerFileUpload.single('trainingfile'), getCoach, addActivity, extractInfo, updateDB)

app.post('/athlete/:index/schedule', (req,res)=> {
  console.log(req.body);
  const {id, datetime, title} = req.body;
  pool.query(`UPDATE training SET datetime = '${datetime}', title = '${title}' WHERE id = ${id} RETURNING *`).then((response)=> res.status(200).send(response));
})



 
// User Story #: Athlete should be able to set and customise his profile to suit his tastes. He should be able to upload a photo that persists on his page.
// athlete settings
app.get('/athlete/:index/settings', checkAuth, (req,res)=> {
   

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM athlete WHERE id = ${index}`, (err,result)=> {
    const output = {data: 
                          {
                            index: index,
                            title: "Settings",
                            photo: req.session.profilepic,
                            data: JSON.stringify(result.rows),
                            username: req.session.username
                          }
                    }

    console.log(output)
    res.render('settings', output);
  })


}).post('/athlete/:index/settings', checkAuth, multerPhotoUpload.single('photo'), (req,res)=> {
if(req.file){
    const {index} = req.params;
    console.log(req.file);
    
    const sqlQuery = 'INSERT INTO profilephotos (athleteid, photo) VALUES ($1, $2) RETURNING *';
    // get the photo column value from request.file
    const values = [index, req.file.filename];
    console.log('values >> ', values)
    // Query using pg.Pool instead of pg.Client
    pool.query(sqlQuery, values, (error, result) => {
      if (error) {
        console.log('Error executing query', error.stack);
        res.status(503).send(result.rows);
        return;
      }
      session.profilepic = result.rows[0].photo;
      res.send(result.rows);
      return;
    });
  } else {
    //do nothing yet
    console.log('Done')
  }
})

// User Story #: Athlete should be able to see his data
// athlete data
app.get('/athlete/:index/data', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  
  pool.query(`SELECT * FROM training WHERE athleteid = ${index}`, (err,result)=> {
    const output = { 
                    data: {
                      result: result.rows,
                      title: 'Data',
                      index: index,
                      username: req.session.username
                    }
                  }
    console.log('output >> ', output.data.result);
      res.render('data', output);
  })

})


/* 
-------------------------------------- COACHING ------------------------------------------------
*/
// User Story #: Coach should be able to login
app.get('/coach/login', (req,res)=>{
  res.render('login');
}).post('/coach/login', (req,res)=>{
  const username = req.body.username;
  pool.query(`SELECT * FROM coach WHERE username = '${username}'`, (err, result)=> {
    if(err){
      console.error(err);
      res.status(503).send(err);
    }

    console.log('result >> ', result.rows)
    if (result.rows.length === 0){
      res.status(403).send('login failed')
      return;
        }

    const user = result.rows[0];

    // check if the input password matches the registered user password
    const shaPW = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaPW.update(req.body.password);
    const hashedpassword = shaPW.getHash('HEX');

    if(user.password!==hashedpassword) {
      res.status(403).send('login failed');
      return;
    }

    // if password is correct, set the session parameters
    session = req.session;
    
    const shaUsr = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaUsr.update(`${user.id}-${SALT}`);
    const hasheduser = shaUsr.getHash('HEX');

    // session takes in loggedinhash, userid, loggedin boolean
    session.loggedinhash = hasheduser;
    session.userid = user.id;
    session.loggedin = true;
    console.log('session>> ', session);
    res.redirect(`/coach/${user.id}/overview`)

    } 
  )
})

const getCoachData = (req,res,next) => {
  const {index} = req.params;
  pool.query(`SELECT fname, lname FROM coach WHERE id = ${index}`)
  .then((result)=> {
    res.locals.coachdata = result.rows;
    next();
    }
  )
}

// look for the athletes data of the coached athletes
const getAthleteData = (req,res,next) => {
  const {index} = req.params;
  pool.query(`SELECT * FROM athlete INNER JOIN relation ON athlete.id = relation.athleteid WHERE relation.coachid = ${index}`)
  .then((result)=> {
    const athletedata = result.rows;
    res.locals.athletedata = athletedata;
    next();
  })
}

// look for athletes that belong to the coach
const getAthleteTrainingInfo = (req,res,next) => {
  const {index} = req.params;

  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athleteid = relation.athleteid WHERE relation.coachid = ${index}`)
    .then((result)=> {

      const onlyUnique = (value,index,self) => {
      return self.indexOf(value) === index;
      }
    
      const uniqueathleteid = result.rows.map(data => data.athleteid).filter(onlyUnique);
      console.log(uniqueathleteid)

      let atharray= []

      for(const ath in uniqueathleteid) {
        const fname = res.locals.athletedata[ath].fname;
        const lname = res.locals.athletedata[ath].lname;
        const selectathlete = uniqueathleteid[ath]
        console.log('Compiling ath >> ', ath)
        const athspecificdata = result.rows.filter(data => data.athleteid === selectathlete);
        console.log('athspecificdata >> ', athspecificdata)
        const thismonthdata = athspecificdata.filter(data => new Date(data.datetime).getMonth() === new Date().getMonth() && new Date(data.datetime).getFullYear() === new Date().getFullYear())


        const toChartArray = (tally) => {
          let chartarray = []
          for(const type in tally) {
            chartarray.push({'x':type, 'y':tally[type]});
          }
          return chartarray;
        }

        const typetally = (type, data) => {
          let activitytally = {}
          for(let x=0; x < data.length; x++) {
            let activity = data[x].activitytype
            if (activity in activitytally) {
              activitytally[activity] += Number(data[x][type])
            } else {
              activitytally[activity] = 0;
            }
          }

        
        return activitytally;
      }

      const activitytypetally = (data) => {
        let activitytally = {}
        for(let x=0; x < data.length; x++) {
          let activity = data[x].activitytype
          if (activity in activitytally) {
            activitytally[activity] += 1;
          } else {
            activitytally[activity] = 0;
          }
        }

        let chartarray = []
        for(const type in activitytally) {
          chartarray.push({'x':type, 'y':activitytally[type]});
        }

        return activitytally;
      }
      
      const distancereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.distance) 
      const caloriereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.calories)
      const hrreducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.avghr)
      const pacereducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(currentvalue.avgpace)
      const durationreducer = (accumulator, currentvalue) => (Number(accumulator) || 0 ) + Number(gettime(currentvalue.timetaken))
      
      //all time data
      const alltimedistance = athspecificdata.reduce(distancereducer,0);
      const alltimecalories = athspecificdata.reduce(caloriereducer,0);
      const alltimeavghr = athspecificdata.reduce(hrreducer,0) / athspecificdata.length;
      const alltimeduration = athspecificdata.reduce(durationreducer,0);
      const alltimeavgpace = athspecificdata.reduce(pacereducer,0);

      //data this month
      const thismonthcalories = thismonthdata.reduce(caloriereducer,0);
      const thismonthdistance = thismonthdata.reduce(distancereducer,0);
      const thismonthduration = thismonthdata.reduce(durationreducer,0);
      const thismonthavghr = thismonthdata.reduce(hrreducer,0) / thismonthdata.length;
      const thismonthavgpace = thismonthdata.reduce(pacereducer,0) / thismonthdata.length; 

      const timetally = (data) => {
        let activitytally = {}
        for(let x=0; x < data.length; x++) {
          let activity = data[x].activitytype
          if (activity in activitytally) {
            activitytally[activity] += gettime(data[x]['timetaken'])
          } else {
            activitytally[activity] = 0;
          }
        }

        return activitytally;
      }

      //segment by sports
      const caloriebysport = typetally('calories', result.rows);
      const distancebysport = typetally('distance', result.rows);
      const durationbysport = timetally(result.rows);
      const combinedhrbysport = typetally('avghr', result.rows);

      const chartcalorie = toChartArray(caloriebysport)
      const chartdistance = toChartArray(distancebysport)
      const chartduration = toChartArray(durationbysport)
      

      const avghrbysport = (()=> {
                            Object.keys(combinedhrbysport).forEach( sport => {
                            combinedhrbysport[sport] /= activitytypetally(result.rows)[sport]
                            })
                            return combinedhrbysport;
                          })();

                                
      const combinedpacebysport = typetally('avgpace', result.rows);
      const avgpacebysport = (()=> {
                              Object.keys(combinedpacebysport).forEach(sport => {
                              combinedpacebysport[sport] /= activitytypetally(result.rows)[sport]
                              })
                              return combinedpacebysport;
                            })();

      const chartavgpace = toChartArray(avgpacebysport)
      const chartavghr = toChartArray(avghrbysport)

      const athdata = {
                      id: uniqueathleteid[ath],
                      fname: fname,
                      lname: lname,
                      alltimeactivity: athspecificdata.length,
                      thismonthactivity: thismonthdata.length,
                      alltimedistance: alltimedistance,
                      alltimecalories: alltimecalories,
                      alltimeavghr: alltimeavghr,
                      alltimeduration: alltimeduration,
                      alltimeavgpace: alltimeavgpace,
                      thismonthcalories: thismonthcalories,
                      thismonthdistance: thismonthdistance,
                      thismonthduration: thismonthduration,
                      thismonthavghr: thismonthavghr,
                      thismonthavgpace: thismonthavgpace,
                      caloriebysport: chartcalorie,
                      distancebysport: chartdistance,
                      durationbysport: chartduration,
                      avghrbysport: chartavghr,
                      avgpacebysport: chartavgpace,
                      activitytypetally: toChartArray(activitytypetally(result.rows)),
                      }
      
      atharray.push(athdata);
      }
      
      console.log(atharray);
      const output = { data: 
                        {
                          index: index,
                          username: req.session.username, 
                          title: "Overview",
                          athleteinfo: res.locals.athletedata,
                          athleteids: uniqueathleteid,
                          coachdata: res.locals.coachdata,
                          athletedata: JSON.stringify(atharray),
                        }
                      };
        
        res.locals.output = output;
        next();

  })
}

// User Story #: 
app.get('/coach/:index/overview', checkAuth, getCoachData, getAthleteData, getAthleteTrainingInfo, (req,res)=>{
    res.render('overview', res.locals.output);
});

// TODO: User Story #: Coach should have his own Todo List


// User Story #: Coach should be able to see his list of athletes and see details about his athletes.
// + he should be able to change different views
app.get('/coach/:index/trainingplans', checkAuth, getCoachData, getAthleteData, getAthleteTrainingInfo,(req,res)=> {
  const {index} = req.params;
  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athleteid = relation.athleteid INNER JOIN athlete ON training.athleteid = athlete.id WHERE relation.coachid = ${index} `)
    .then((result)=> {
      const trainingdata = result.rows;
      const output = { 
                      data: 
                        {
                          index: index,
                          coachdata: res.locals.coachdata,
                          athletedata: res.locals.athletedata,
                          trainingdata: trainingdata,
                          title: 'Training Plans'
                        }
                    }

      

      res.render('trainingplan', output)
  })
})

// User Story #: Athlete should be see his training schedule, past, present, future, and be able to add activities
// athlete schedule
app.get('/coach/:index/timetable', checkAuth, getCoachData, getAthleteData, getAthleteTrainingInfo,(req,res)=> {
const {index} = req.params;
  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athleteid = relation.athleteid INNER JOIN athlete ON training.athleteid = athlete.id WHERE relation.coachid = ${index} `)
    .then((result)=> {
      const trainingdata = result.rows;
      const output = { 
                      data: 
                        {
                          index: index,
                          coachdata: res.locals.coachdata,
                          athletedata: res.locals.athletedata,
                          trainingdata: trainingdata,
                          title: 'Training Plans'
                        }
                    }

      console.log('timetable output >> ', output.data.athletedata)

      res.render('timetable', output);
  })
})

app.post('/coach/:index/schedule/addactivity', checkAuth, multerFileUpload.single('trainingfile'), addActivity)

app.post('/coach/:index/schedule', (req,res)=> {
  console.log(req.body);
  const {id, date} = req.body;
  pool.query(`UPDATE training SET date = '${date}' WHERE id = ${id} RETURNING *`).then((response)=> res.status(200).send(response));
})


app.get('/coach/:index/athlete/:athleteid/timetable', checkAuth, getCoachData, getAthleteData, getAthleteTrainingInfo,(req,res)=> {
  const {index, athleteid} = req.params;
  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athleteid = relation.athleteid WHERE relation.coachid = ${index} AND training.athleteid = ${athleteid}`, (err,data)=> {
    const trainingdata = data.rows;
    const output = { 
                      data: 
                        {
                          index: index,
                          athleteid: athleteid,
                          coachdata: res.locals.coachdata,
                          athletedata: res.locals.athletedata,
                          trainingdata: trainingdata,
                          title: `Athlete ${athleteid} | Training Plans`
                        }
                    }

      console.log('timetable output >> ', output)

      res.render('timetable', output); 
  })
})

// TODO: collision prevention

// User Story #: Athlete should be able to see his rankings and how he fares with others.
// athlete rankings
app.get('/coach/:index/rankings', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  
  pool.query(`SELECT * FROM training WHERE athleteid = ${index}`, (err,result)=> {
    const output = { 
                    data: {
                      result: result.rows,
                      title: 'Rankings',
                      index: index
                    }
                  }
    console.log('output >> ', output.data.result);
      res.render('rankings', output);
  })

})

// logout routing, deletes the session state
app.get('/logout', (req,res)=>{
  req.session.loggedin = false;
  req.session.destroy(()=>{res.redirect('/athlete/login')});

})

app.get('/test', (req,res)=> {
  res.render('test2');
}).post('/test', (req,res)=> {
  console.log(req.body)
})

app.get('*', (req,res)=> {
  app.redirect('404')
})

app.listen(PORT, ()=> console.log(`App running at port ${PORT}`));