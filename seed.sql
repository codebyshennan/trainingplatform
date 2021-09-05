-- Required: Dummy Athlete and Data
-- athlete password: 12345
-- coach password: coach
INSERT INTO athlete (fname, lname, username, password, gender, birthdate) 
VALUES ('Shen Nan', 'Wong', 'wongshennan', '3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79', 'M','1992-1-10');

INSERT INTO athlete (fname, lname, username, password, gender, birthdate) 
VALUES ('Chuanxin', 'x', 'chuanxin', '3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79', 'M','1990-8-3');

INSERT INTO athlete (fname, lname, username, password, gender, birthdate) 
VALUES ('Jiaen', 'Chiew', 'en', '3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79', 'F','2000-5-10');

INSERT INTO coach (fname, lname, username, password, gender, birthdate) 
VALUES ('Akira', 'Wong', 'coach', '7d5bda3df93cfbef4fef07208d9c56f482d677d85e8f47e16f1f9dbc6f415bc709045eaf0a1df3ecfb9066e2e851ae3e1cd6481a2bd58fb8294cf637f0fc68d5', 'M','1986-1-1');

-- Relating coach to athletes
INSERT INTO relation (coachid, athleteid) VALUES (1,1),(1,2),(1,3);

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running','2021-8-8 8:21','Singapore Running', '7.97', 562, '0:41:00', 161, 178, 1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-28 23:34', 'Singapore Running', '6.82', 478, '0:47:20', 139, 166, 1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-21 11:24', 'Singapore Running', '4.39', 337, '0:26:57', 151, 166, 2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-18 12:41', 'Singapore Running', '2.41', 156, '0:12:08', 150, 174,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-5 21:47', 'Singapore - Tempo', '8.86', 567, '0:46:04', 150, 171,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-3 7:54', 'Singapore - Endurance', '7.89', 494, '0:57:31', 128, 163,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-28 9:50', 'Singapore - Tempo', '6.44', 409, '0:33:02', 150, 168,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Walking', '2021-8-27 23:33', 'Singapore Walking', '6.37', 362, '1:17:53', 81, 110,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-24 9:23', 'Zwift - HOUR OF POWER', '14.36', 253, '0:30:08', NULL, NULL,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Walking', '2021-8-22 7:51', 'Singapore Walking', '4.08', 240, '0:57:08', 80, 104,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-21 10:23', 'Singapore - Tempo', '9.03', 554, '1:02:09', 135, 170,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-15 19:08', 'Zwift - HOUR OF POWER', '27.27', 425, '0:52:05', NULL, NULL,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-13 10:36', 'Singapore Running', '6.23', 395, '0:30:21', 153, 170,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Cycling', '2021-8-12 7:21', 'Singapore Cycling', '34.18', 479, '1:07:31', 121, 152,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-11 10:45', 'Singapore Running', '7.07', 445, '0:37:36', 146, 173, 2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-8 19:01', 'Zwift - HOUR OF POWER', '32.05', 484, '0:58:58', NULL, NULL,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-7 7:04', 'Singapore - Endurance', '4.03', 224, '0:18:51', 142, 164,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-6 8:55', 'Singapore - Endurance', '10', 636, '0:47:44', 158, 168,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-5 10:41', 'Zwift - NYC', '21.41', 372, '1:00:16', NULL, NULL, 1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-4 18:57', 'Zwift - WATT BOMB VO2', '25.93', 441, '1:01:59', NULL, NULL,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Walking', '2021-8-4 10:52', 'Singapore Walking', '6', 352, '1:07:47', 97, 112, 2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-1 19:31', 'Zwift - London', '10.36', 139, '0:21:49', NULL, NULL, 2) ;


INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Virtual Cycling', '2021-8-1 19:01', 'Zwift - HOUR OF POWER', '13.26', 238, '0:29:20', NULL, NULL, 3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-1 11:40', 'Singapore Running', '5.56', 343, '0:27:07', 156, 178,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-1 11:22', 'Singapore Running', '1.88', 122, '0:10:14', 143, 156,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-30 8:42', 'Singapore Running', '10', 644, '0:49:32', 156, 173,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-27 18:09', 'Singapore - Endurance', '7.69', 440, '0:38:38', 143, 164,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-26 18:43', 'Singapore - Tech + Speed End', '4.74', 241, '0:32:51', 125, 151,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-24 17:44', 'Singapore Running', '7.15', 511, '0:41:48', 151, 166,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-24 8:49', 'Singapore - Tempo', '5.84', 360, '0:30:01', 148, 170,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-19 8:29', 'Singapore Running', '6.13', 385, '0:30:02', 157, 181,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-18 9:35', 'Singapore Running', '3.73', 332, '1:02:35', 102, 159,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-15 7:53', 'Singapore - Endurance', '5.48', 411, '0:34:20', 151, 171,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-12 19:37', 'Singapore Running', '4.16', 229, '0:20:01', 142, 170,2) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-25 7:54', 'Singapore Running', '11', 827, '1:09:03', 155, 173,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-22 7:27', 'Singapore Running', '5', 338, '0:26:35', 151, 165,3) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-21 17:45', 'Singapore Running', '7.55', 439, '0:34:31', 156, 178,1) ;

INSERT INTO training (activitytype, datetime, title, distance, calories, timetaken, avghr, maxHR, athleteid) 
VALUES ('Running', '2021-8-19 18:56', 'Singapore Running', '0.75', 27, '02:36.7', 132, 143, 1) ;

INSERT INTO trainingplan (description, activitytype, perceivedexertion, datetime, title, distance, timetaken, avgpace, avghr, coachid, athleteid) 
VALUES ('4 x 400 intervals to boost your cardiovascular strength','Running','8', '2021-9-6 10:00','Interval Training', '1.6', '10:00', '1.0', 143, 1,1);

INSERT INTO training (planid, description, activitytype, perceivedexertion, datetime, title, distance, calories, timetaken, minpace, avgpace, maxpace, minhr, avghr, maxhr, athleteid) 
VALUES (1,'4 x 400 intervals to boost your cardiovascular strength','Running','8', NOW(),'Interval Training', '1.7', 500, '9:30', '1.0','9.6','12.0', 80,120,132,1);
