import express from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import pg from "pg";
import jsSHA from "jssha";
import multer from 'multer';


// initialise express and define port parameters
const app = express();
const PORT = process.env.PORT || 3001;
const SALT = process.env.SALT;

// set the name of the upload directory here
const multerUpload = multer({ dest: 'uploads/' });

// disables extensibility of URLencoding
app.use(express.urlencoded( {extended: false} ));

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

// postgres middleware
const {Pool} = pg;
const pool = new Pool({
  user: 'wonggshennan',
  host: 'localhost',
  database: 'trainingpeaks',
  port: 5432, // Postgres server always runs on this port
});
pool.connect();


// base route to homepage
app.get('/', (req,res)=> {
  res.render('home'); 
})

// registration for athlete
app.get('/athlete/register', (req,res)=> {
  res.render('register');
}).post('/athlete/register',(req,res)=> {

  const shaObj = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
  shaObj.update(req.body.password);
  const hashedpassword = shaObj.getHash('HEX');
  const values = [req.body.fname, req.body.lname, req.body.username, hashedpassword];
  pool.query('INSERT INTO athlete (fname,lname, username, password) VALUES ($1,$2,$3,$4) RETURNING *', values, (err,result)=> {
    if(err) {console.error(err)}
    console.log(result.rows[0]);
    res.send('success');
  }
   )
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
    session.loggedin = true;
    console.log('session>> ', session);
    res.redirect(`/athlete/${user.id}/dashboard`)

    } 
  )
})



// User Story #: Athlete should be able to get an overview of his training status
// Athlete Dashboard
app.get('/athlete/:index/dashboard', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT to_char(training.date, 'YYYY-MM-DD') as date, CAST(training.distance AS DECIMAL) as distance FROM training WHERE athlete_ID = ${index} AND activitytype='Running' ORDER BY date ASC`, (err,result)=> {
    console.log('result.rows >> ', result.rows)
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

// User Story #: Athlete should be see his training schedule, past, present, future, and be able to add activities
// athlete schedule
app.get('/athlete/:index/schedule', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {

        const output = {output: 
                        {index: index, 
                        data: result.rows,
                        title: "Schedule"}
                    };
      res.render('schedule', output);
  })

})

// User Story #: Athlete should be able to set and customise his profile to suit his tastes. He should be able to upload a photo that persists on his page.
// athlete settings
app.get('/athlete/:index/settings', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { index: index,
    title: "Settings"};
    res.render('settings', output);
  })

}).post('/athlete/:index/settings', checkAuth, multerUpload.single('photo'), (req,res)=> {

  console.log('request came in');
  console.log(request.file);

  const sqlQuery = 'INSERT INTO photos (label, photo) VALUES ($1, $2)';
  // get the photo column value from request.file
  const values = [request.body.label, request.file.filename];

  // Query using pg.Pool instead of pg.Client
  pool.query(sqlQuery, values, (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }
    console.log(result.rows[0].name);
    response.send(result.rows);
  });


})

// User Story #: Athlete should be able to see his rankings and how he fares with others.
// athlete rankings
app.get('/athlete/:index/rankings', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('schedule', output);
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

// User Story #: 
app.get('/coach/:index/overview', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('overview', output);
  })

})

// TODO: User Story #: Coach should have his own Todo List


// User Story #: Coach should be able to see his list of athletes and see details about his athletes.
// + he should be able to change different views
app.get('/coach/:index/athletes', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('schedule', output);
  })

})



// TODO: collision prevention

// logout routing, deletes the session state
app.get('/logout', (req,res)=>{
  req.session.destroy();
  res.redirect('/athlete/login');
})

app.listen(PORT, ()=> console.log(`App running at port ${PORT}`));