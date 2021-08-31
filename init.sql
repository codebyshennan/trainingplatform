DROP TABLE IF EXISTS athlete CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS relation CASCADE;
DROP TABLE IF EXISTS training CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

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
  ,title                  TEXT NOT NULL
  ,distance               NUMERIC(6,2) NOT NULL
  ,calories               INTEGER  NOT NULL
  ,timetaken              NUMERIC(6,2) NOT NULL
  ,avgHR                 NUMERIC(6,2)  NOT NULL
  ,maxHR                  NUMERIC(6,2) NOT NULL
  ,aerobicTE              NUMERIC(6,2) NOT NULL
  ,avgruncadence          NUMERIC(6,2) NOT NULL
  ,maxruncadence          NUMERIC(6,2) NOT NULL
  ,avgpace                NUMERIC(6,2) NOT NULL
  ,bestpace               NUMERIC(6,2) NOT NULL
  ,elevgain               NUMERIC(6,2) NOT NULL
  ,elevloss               NUMERIC(6,2) NOT NULL
  ,avgstridelength        NUMERIC(4,2) NOT NULL
  ,avgverticalratio       INTEGER  NOT NULL
  ,avgverticaloscillation INTEGER  NOT NULL
  ,avgbikecadence          NUMERIC(6,2) NOT NULL
  ,maxbikecadence          NUMERIC(6,2) NOT NULL
  ,normalizedpower       NUMERIC(6,2) NOT NULL
  ,maxavgpower            NUMERIC(6,2) NOT NULL
  ,avgpower              NUMERIC(6,2) NOT NULL
  ,maxpower               NUMERIC(6,2) NOT NULL
  ,totalstrokes           NUMERIC(6,2) NOT NULL
  ,avgSWOLF               NUMERIC(6,2) NOT NULL
  ,avgstrokerate          NUMERIC(6,2) NOT NULL
  ,bestlaptime           NUMERIC(6,2) NOT NULL
  ,numberoflaps           INTEGER  NOT NULL
  ,movingtime             VARCHAR(7) NOT NULL
  ,elapsedtime            VARCHAR(7) NOT NULL
  ,minelevation           VARCHAR(3) NOT NULL
  ,maxelevation           VARCHAR(3) NOT NULL
  ,athlete_ID             INTEGER NOT NULL REFERENCES athlete(id)
  ,createdon              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

