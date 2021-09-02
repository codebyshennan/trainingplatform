import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import pg from "pg";
import jsSHA from "jssha";
import multer from 'multer';
import {readFile} from 'fs';
import tcx from 'tcx-js';
import { JSDOM } from 'jsdom';
import {SportsLib} from '@sports-alliance/sports-lib';
import { DOMParser } from 'xmldom'
// initialise express and define port parameters
const app = express();
const PORT = 3001;
const SALT = process.env.SALT;

// set the name of the upload directory here
const multerFileUpload = multer({ dest: 'uploads/trainingfiles/' });
const multerPhotoUpload = multer({ dest: 'uploads/profilephotos/' });

// disables extensibility of URLencoding
app.use(express.urlencoded( {extended: false} ));
app.use(express.json())
// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('_method'));
app.use(cookieParser());

// enables Express to serve files from a local folder called 'public, and renames the route as /static;
app.use('/static', express.static('public'));
app.use(express.static('uploads'));

app.set('view engine', 'ejs');

const hour = 1000 * 60 * 60; // 3 600 000
let session;

// initialises session usage; each session lasts an hour
app.use(
  sessions(
    {
      secret: "hash",
      saveUninitialized: true,
      cookie: { maxAge: hour},
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

// base route to homepage
app.get('/', (req,res)=> {
  res.render('home'); 
})

app.get('/about',(req,res)=>{
  res.render('about');
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

    pool.query(`SELECT * FROM profilephotos WHERE athlete_id = ${id}`, (err, data) => {
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


// User Story #: Athlete should be able to get an overview of his training status
// Athlete Dashboard
app.get('/athlete/:index/dashboard', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT to_char(training.date, 'YYYY-MM-DD') as date, CAST(training.distance AS DECIMAL) as distance FROM training WHERE athlete_id = ${index} AND activitytype='Running' ORDER BY date ASC`, (err,result)=> {
    let data = result.rows.map(x => x = {date: x.date, distance: +x.distance} );
    // console.log(data);
    const output = { output: 
                      {index: index, 
                      title: "DashBoard",
                      chartdata: data}
                    };
    // console.log('output >> ', output.data[0]);
      res.render('dashboard', output);
  })

})

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
app.get('/athlete/:index/schedule', checkAuth, getFormLabels, (req,res)=> {

  const {index} = req.params;

  pool.query(`SELECT * FROM training WHERE athlete_id = ${index}`, (err,result)=> {

        const output = {data: 
                        {
                          index: index,
                          columnnames: res.locals.columns,
                          data: JSON.stringify(result.rows),
                          title: "Schedule"
                        }
                      };

                      console.log(output)
      res.render('schedule', output);
  })
})


const extractInfo = (req,res,next) => {
  const filepath = req.file.path
  readFile(filepath, 'utf-8', (error, readFileResult)=>{
    SportsLib.importFromTCX(new DOMParser().parseFromString(readFileResult,'text/xml'))
    .then((importResult)=>{
    // do Stuff with the file
    // so much work just to get the calories
      const jsondata = importResult.toJSON();
      const values = [
        jsondata['Activity Types'][0], // activitytype
        new Date(jsondata.startDate).toISOString().substr(0,10), // date
        new Date(jsondata.startDate).toISOString().substr(11,8), // time
        jsondata['name'], // title
        jsondata.stats.Distance / 1000, // distance
        jsondata.stats.Energy, // calories
        new Date(jsondata.stats.Duration * 1000).toISOString().substr(11,8), // timetaken
        jsondata.stats['Average Heart Rate'], // avghr
        jsondata.stats['Maximum Heart Rate'], // maxhr
        req.session.userid, // athlete_id
        req.session.username, // createdby
      ]

      pool.query(`INSERT INTO 
      training (activitytype, date, time, title, distance, calories, timetaken, avgHR, maxHR, athlete_ID, createdby) 
      VALUES   (    $1,        $2,   $3,   $4,      $5,       $6,       $7,       $8,    $9,      $10,        $11) 
      RETURNING *`, values)
      .then((queryResult)=>{
        res.send(queryResult.rows[0]);
      })
    });
  })
}

const updateDB = (req, res)=> {
    const sqlQuery = 'INSERT INTO trainingfiles (athlete_id, trainingfile) VALUES ($1, $2) RETURNING *';
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
      next();
      return;

  } else {
 
    const {index} = req.params;
    const {TITLE, ACTIVITYTYPE, MAXHR, AVGHR, TIMETAKEN, CALORIES, DISTANCE, TIME, DATE} = req.body;
    
    const values = [ACTIVITYTYPE, DATE, TIME, TITLE, DISTANCE, CALORIES, TIMETAKEN, AVGHR, MAXHR, index];

    pool.query(`INSERT INTO training (activitytype, date, time, title, distance, calories, timetaken, avgHR, maxHR, athlete_ID) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, values)
    .then((result)=>{
      res.send('add success')
    })
  }
}


app.post('/athlete/:index/schedule/addactivity', checkAuth, multerFileUpload.single('trainingfile'), addActivity, extractInfo, updateDB)

app.post('/athlete/:index/schedule', (req,res)=> {
  console.log(req.body);
  const {id, date} = req.body;
  pool.query(`UPDATE training SET date = '${date}' WHERE id = ${id} RETURNING *`).then((response)=> res.status(200).send(response));
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
                            data: JSON.stringify(result.rows)
                          }
                    }

    console.log(output)
    res.render('settings', output);
  })


}).post('/athlete/:index/settings', checkAuth, multerPhotoUpload.single('photo'), (req,res)=> {
if(req.file){
    const {index} = req.params;
    console.log(req.file);
    
    const sqlQuery = 'INSERT INTO profilephotos (athlete_id, photo) VALUES ($1, $2) RETURNING *';
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

  
  pool.query(`SELECT * FROM training WHERE athlete_id = ${index}`, (err,result)=> {
    const output = { 
                    data: {
                      result: result.rows,
                      title: 'Data',
                      index: index
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
    res.locals.coachdata = JSON.stringify(result.rows);
    next();
    }
  )
}

// look for the athletes data of the coached athletes
const getAthleteData = (req,res,next) => {
  const {index} = req.params;
  pool.query(`SELECT * FROM athlete INNER JOIN relation ON athlete.id = relation.athlete_id WHERE relation.coach_id = ${index}`)
  .then((result)=> {
    const athletedata = JSON.stringify(result.rows);
    res.locals.athletedata = athletedata;
    next();
  })
}

// look for athletes that belong to the coach
const getAthleteTrainingInfo = (req,res,next) => {
  const {index} = req.params;

  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athlete_id = relation.athlete_id WHERE relation.coach_id = ${index}`)
    .then((result)=> {
      // Array: list all the trainings that are by athletes coached by this coach
      const trainingdata = JSON.stringify(result.rows);
      // extract unique athlete id
      // sort
      // const array1=[]
      // for()
      // [{athlete:[trainings]}, {athlete:[trainings]}, {athlete:[trainings]}]
      const output = { 
                      data: 
                        {
                          index: index,
                          coachdata: res.locals.coachdata,
                          athletedata: res.locals.athletedata,
                          trainingdata: trainingdata,
                          title: 'Overview'
                        }
                    }

      console.log(output);

      res.render('overview', output)
  })
}

// User Story #: 
app.get('/coach/:index/overview', checkAuth, getCoachData, getAthleteData, getAthleteTrainingInfo);

// TODO: User Story #: Coach should have his own Todo List


// User Story #: Coach should be able to see his list of athletes and see details about his athletes.
// + he should be able to change different views
app.get('/coach/:index/athletes', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_id = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('schedule', output);
  })

})

// User Story #: Athlete should be see his training schedule, past, present, future, and be able to add activities
// athlete schedule
app.get('/coach/:index/timetable', checkAuth, getFormLabels, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training INNER JOIN relation ON training.athlete_id = relation.athlete_id WHERE coach_id = ${index}`, (err,result)=> {

        const output = {data: 
                        {
                          index: index,
                          columnnames: res.locals.columns,
                          data: JSON.stringify(result.rows),
                          title: "Timetable"
                        }
                      };

                      console.log(output)
      res.render('timetable', output);
  })
})

app.post('/coach/:index/schedule/addactivity', checkAuth, multerFileUpload.single('trainingfile'), addActivity)

app.post('/coach/:index/schedule', (req,res)=> {
  console.log(req.body);
  const {id, date} = req.body;
  pool.query(`UPDATE training SET date = '${date}' WHERE id = ${id} RETURNING *`).then((response)=> res.status(200).send(response));
})

// TODO: collision prevention

// User Story #: Athlete should be able to see his rankings and how he fares with others.
// athlete rankings
app.get('/coach/:index/rankings', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  
  pool.query(`SELECT * FROM training WHERE athlete_id = ${index}`, (err,result)=> {
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

app.listen(PORT, ()=> console.log(`App running at port ${PORT}`));