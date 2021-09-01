DROP TABLE IF EXISTS athlete CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS relation CASCADE;
DROP TABLE IF EXISTS training CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS profilephotos CASCADE;
DROP TABLE IF EXISTS trainingfiles CASCADE;

CREATE TABLE trainingfiles (
  id SERIAL NOT NULL PRIMARY KEY,
  label TEXT,
  trainingfile TEXT
);

CREATE TABLE profilephotos (
  id SERIAL NOT NULL PRIMARY KEY,
  athlete_id INTEGER,
  photo TEXT
);

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
  coach_id INTEGER REFERENCES coach(id),
  athlete_id INTEGER REFERENCES athlete(id),
  createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS training(
   id                     SERIAL PRIMARY KEY
  ,activitytype           VARCHAR(15)
  ,date                   DATE
  ,time                   TIME
  ,title                  TEXT
  ,distance               NUMERIC(6,2)
  ,calories               INTEGER 
  ,timetaken              TIME
  ,avgHR                  NUMERIC(6,2) 
  ,maxHR                  NUMERIC(6,2)
  ,athlete_ID             INTEGER REFERENCES athlete(id)
  ,createdon              TIMESTAMPTZ DEFAULT NOW()
);


