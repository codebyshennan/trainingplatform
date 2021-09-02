DROP TABLE IF EXISTS athlete CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS relation CASCADE;
DROP TABLE IF EXISTS training CASCADE;
DROP TABLE IF EXISTS profilephotos CASCADE;
DROP TABLE IF EXISTS trainingfiles CASCADE;


CREATE TABLE IF NOT EXISTS athlete 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT UNIQUE, 
  password TEXT,
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT UNIQUE, 
  password TEXT,
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relation 
(
  id SERIAL PRIMARY KEY, 
  coachid INTEGER REFERENCES coach(id),
  athleteid INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS training(
  id                     SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES trainingplan(id),
  activitytype           TEXT,
  perceivedexertion      INTEGER,
  date                   DATE,
  time                   TIME,
  title                  TEXT,
  distance               NUMERIC(6,2),
  calories               INTEGER,
  timetaken              TIME,
  minpace               NUMERIC(6,2),
  avgpace               NUMERIC(6,2),
  maxpace               NUMERIC(6,2),
  minhr                 NUMERIC(6,2),
  avghr                  NUMERIC(6,2),
  maxhr                  NUMERIC(6,2),
  athleteid             INTEGER REFERENCES athlete(id),
  comments               TEXT,
  createdon              TIMESTAMPTZ DEFAULT NOW(),
  createdby              TEXT DEFAULT 'me'
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


CREATE TABLE IF NOT EXISTS trainingplan (
  id SERIAL PRIMARY KEY,
  activitytype VARCHAR(15),
  date DATE,
  time TIME,
  title TEXT
  distance NUMERIC(6,2),
  calories INTEGER,
  timetaken TIME,
  avgHR NUMERIC(6,2),
  maxHR NUMERIC(6,2),
  athleteid INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ DEFAULT NOW(),
  createdby TEXT DEFAULT 'me'
)