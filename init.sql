
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


DROP TABLE IF EXISTS athlete CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS relation CASCADE;
DROP TABLE IF EXISTS training CASCADE;
DROP TABLE IF EXISTS profilephotos CASCADE;
DROP TABLE IF EXISTS trainingfiles CASCADE;
DROP TABLE IF EXISTS trainingplan CASCADE;
DROP FUNCTION add_todo CASCADE;
DROP FUNCTION add_comments CASCADE;
DROP TRIGGER todo ON athlete;
DROP TRIGGER comments on training;

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
  activitytype TEXT,
  date DATE,
  time TIME,
  title TEXT,
  distance NUMERIC(6,2),
  calories INTEGER,
  timetaken TIME,
  avgHR NUMERIC(6,2),
  maxHR NUMERIC(6,2),
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
  date DATE,
  time TIME,
  title TEXT,
  distance NUMERIC(6,2),
  calories INTEGER,
  timetaken TIME,
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



-- function to make new table per registrant      
CREATE FUNCTION add_todo() RETURNS trigger as $todo$
BEGIN
  EXECUTE FORMAT('CREATE TABLE %I (id SERIAL PRIMARY KEY, athleteid INTEGER REFERENCES athlete(id), todo TEXT)', NEW.username ||'_todo');
  RETURN NEW;
END;
$todo$ LANGUAGE plpgsql;

CREATE TRIGGER todo
AFTER INSERT
ON athlete
FOR EACH ROW
EXECUTE PROCEDURE add_todo();

-- function to make new comments per training
-- ath1_posttrg#213_comments
CREATE FUNCTION add_comments() RETURNS trigger as $comments$
BEGIN
  EXECUTE FORMAT('CREATE TABLE %I (id SERIAL PRIMARY KEY, trainingid INTEGER REFERENCES training(id), sendfrom TEXT, sendto TEXT, comments TEXT)', 'ath' || NEW.athleteid || '_posttrg#' || NEW.id ||'_comments');
  RETURN NEW;
END;
$comments$ LANGUAGE plpgsql;

CREATE TRIGGER comments
BEFORE INSERT
ON training
FOR EACH ROW
EXECUTE PROCEDURE add_comments();