
DO $$ 
  DECLARE 
    r RECORD;
BEGIN
  FOR r IN 
    (
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema=current_schema()
    ) 
  LOOP
     EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
  END LOOP;
END $$ ;

-- SELECT AGE(timestamp athlete.birthdate) FROM athlete;
CREATE TABLE IF NOT EXISTS athlete 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT UNIQUE, 
  password TEXT,
  gender TEXT,
  birthdate DATE,
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT UNIQUE, 
  password TEXT,
  gender TEXT,
  birthdate DATE,
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relation 
(
  id SERIAL PRIMARY KEY, 
  coachid INTEGER REFERENCES coach(id),
  athleteid INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS trainingplan (
  id SERIAL PRIMARY KEY,
  description TEXT,
  activitytype TEXT,
  perceivedexertion INTEGER,
  datetime TIMESTAMPTZ,
  title TEXT,
  distance NUMERIC(6,2),
  timetaken TIME,
  avgpace NUMERIC(6,2),
  avghr NUMERIC(6,2),
  coachid INTEGER REFERENCES coach(id),
  athleteid INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ DEFAULT NOW(),
  createdby TEXT
);


CREATE TABLE IF NOT EXISTS training
(
  id SERIAL PRIMARY KEY,
  planid INTEGER REFERENCES trainingplan(id),
  description TEXT,
  activitytype TEXT,
  perceivedexertion INTEGER,
  datetime TIMESTAMPTZ,
  title TEXT,
  distance NUMERIC(6,2),
  calories INTEGER,
  timetaken TIME,
  feeling INTEGER,
  minpace NUMERIC(6,2),
  avgpace NUMERIC(6,2),
  maxpace NUMERIC(6,2),
  minhr NUMERIC(6,2),
  avghr NUMERIC(6,2),
  maxhr NUMERIC(6,2),
  athleteid INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ DEFAULT NOW(),
  createdby TEXT
);

CREATE TABLE trainingfiles (
  id SERIAL NOT NULL PRIMARY KEY,
  athleteid INTEGER REFERENCES athlete(id),
  trainingfile TEXT
);

CREATE TABLE profilephotos (
  id SERIAL NOT NULL PRIMARY KEY,
  athleteid INTEGER REFERENCES athlete(id),
  photo TEXT
);

CREATE TABLE IF NOT EXISTS todolist (
  id SERIAL PRIMARY KEY,
  athleteid INTEGER REFERENCES athlete(id),
  todo TEXT
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  trainingid INTEGER REFERENCES training(id),
  sendfrom TEXT,
  sendto TEXT,
  comments TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  athleteid INTEGER REFERENCES athlete(id),
  trainingnotification TEXT
)