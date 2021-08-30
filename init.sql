DROP TABLE IF EXISTS athlete CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS relation CASCADE;
DROP TABLE IF EXISTS training;
DROP TABLE IF EXISTS photos;

-- CREATE TYPE ACTIVITY AS ENUM ('Running','Cycling','Swimming','Gym');
CREATE TABLE photos (
  id INTEGER NOT NULL PRIMARY KEY,
  label TEXT,
  photo TEXT
);

CREATE TABLE IF NOT EXISTS athlete 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT UNIQUE, 
  password TEXT
);

CREATE TABLE IF NOT EXISTS coach 
(
  id SERIAL PRIMARY KEY, 
  fname TEXT, 
  lname TEXT, 
  username TEXT, 
  password TEXT
);

CREATE TABLE IF NOT EXISTS relation 
(
  id SERIAL PRIMARY KEY, 
  coach_id INTEGER REFERENCES coach(id),
  athlete_ID INTEGER REFERENCES athlete(id)
);

CREATE TABLE IF NOT EXISTS training(
   id                     SERIAL  NOT NULL PRIMARY KEY
  ,activitytype           VARCHAR(15) NOT NULL
  ,date                   DATE NOT NULL
  ,time                   TIME NOT NULL
  ,title                  VARCHAR(28) NOT NULL
  ,distance               VARCHAR(5) NOT NULL
  ,calories               INTEGER  NOT NULL
  ,timetaken              VARCHAR(7) NOT NULL
  ,avgHR                  VARCHAR(3) NOT NULL
  ,maxHR                  VARCHAR(3) NOT NULL
  ,aerobicTE              VARCHAR(3) NOT NULL
  ,avgruncadence          VARCHAR(3) NOT NULL
  ,maxruncadence          VARCHAR(3) NOT NULL
  ,avgpace                VARCHAR(5) NOT NULL
  ,bestpace               VARCHAR(4) NOT NULL
  ,elevgain               VARCHAR(3) NOT NULL
  ,elevloss               VARCHAR(3) NOT NULL
  ,avgstridelength        NUMERIC(4,2) NOT NULL
  ,avgverticalratio       INTEGER  NOT NULL
  ,avgverticaloscillation INTEGER  NOT NULL
  ,avgbikecadence          VARCHAR(2) NOT NULL
  ,maxbikecadence          VARCHAR(3) NOT NULL
  ,normalizedpower        VARCHAR(3) NOT NULL
  ,maxavgpower            VARCHAR(3) NOT NULL
  ,avgpower               VARCHAR(3) NOT NULL
  ,maxpower               VARCHAR(3) NOT NULL
  ,totalstrokes           VARCHAR(4) NOT NULL
  ,avgSWOLF               VARCHAR(2) NOT NULL
  ,avgstrokerate          VARCHAR(2) NOT NULL
  ,bestlaptime            VARCHAR(7) NOT NULL
  ,numberoflaps           INTEGER  NOT NULL
  ,movingtime             VARCHAR(7) NOT NULL
  ,elapsedtime            VARCHAR(7) NOT NULL
  ,minelevation           VARCHAR(3) NOT NULL
  ,maxelevation           VARCHAR(3) NOT NULL
  ,athlete_ID             INTEGER NOT NULL REFERENCES athlete(id)
  ,createdon              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

