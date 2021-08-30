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

const day = 1000 * 60 * 60 *24;
let session;

// initialises session usage 
app.use(sessions({
  secret: "hash",
  saveUninitialized: true,
  cookie: { maxAge: day},
  resave: false
}))

// generate the hashed + salt version of the input
const getHash = (input) => {
  const shaObj = new jsSHA ('SHA-512','TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);

  return shaObj.getHash('HEX');
}

// auth middleware
const checkAuth = (req,res,next)=> {
  console.log('Checking Auth');
  // set the default vlaue to false
  req.isUserLoggedIn = false;

  // check to see if the cookies you need exists
  if(req.cookies.loggedin && req.cookies.username) {
    const hash = getHash(req.cookies.username);

    if(req.cookies.loggedin === hash) {
      req.isUserLoggedIn = true;

      // look for this user in the db
      const values = [req.cookies.username];

      pool.query(`SELECT * FROM users WHERE username = $1`, values, (err,result)=>{
        if (error || result.rows.length <1) {
          response.status(503).send('sorry!');
          return;
        }

        // set the user as a key in the request obj so that it's accessible in the route
        req.user = result.rows[0];

        next();
      })

      // make sure we don't get to the next() below
      return;
    }
  }
  next();
}

// postgres middleware
const {Pool} = pg;

// create the var we'll use
const pool = new Pool({
  user: 'wonggshennan',
  host: 'localhost',
  database: 'trainingpeaks',
  port: 5432, // Postgres server always runs on this port
});

// make the connection to the server
pool.connect();


// base route
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

//second route if logged in
app.post('/athlete/login', (req,res)=>{
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


    const shaObj = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaObj.update(req.body.password);
    const hashedpassword = shaObj.getHash('HEX');

        console.log('user >> ', user.password);
        console.log(hashedpassword)

    if(user.password!==hashedpassword) {
      res.status(403).send('login failed');
      return;
    }

    session = req.session;
    session.username = req.body.username;
    console.log('req.session>> ', req.session);
    res.cookie('loggedin', true);
    res.redirect(`/athlete/${user.id}/dashboard`)

    } 
  )
})

app.get('/logout', (req,res)=>{
  req.session.destroy();
  console.log(req.session)
  res.redirect('/');
})


app.get('/athlete/:index/schedule', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('schedule', output);
  })

})


app.get('/athlete/:index/dashboard', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
      res.render('dashboard', output);
  })

})


app.get('/athlete/:index/settings', checkAuth, (req,res)=> {

  const {index} = req.params;
  console.log(index);

  pool.query(`SELECT * FROM training WHERE athlete_ID = ${index}`, (err,result)=> {
    const output = { data: result.rows};
    console.log('output >> ', output.data[0]);
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
app.post('/coach/login', (req,res)=>{
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


    const shaObj = new jsSHA('SHA-512','TEXT', {encoding: "UTF8"});
    shaObj.update(req.body.password);
    const hashedpassword = shaObj.getHash('HEX');

        console.log('user >> ', user.password);
        console.log(hashedpassword)

    if(user.password!==hashedpassword) {
      res.status(403).send('login failed');
      return;
    }

    session = req.session;
    session.username = req.body.username;
    console.log('req.session>> ', req.session);
    res.cookie('loggedin', true);
    res.redirect(`/athlete/${user.id}/dashboard`)

    } 
  )
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

// TODO: collision prevention


app.listen(PORT, ()=> console.log(`App running at port ${PORT}`));