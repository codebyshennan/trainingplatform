"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysOfTheWeek = exports.SwimPaceUnits = exports.PaceUnitsToGradeAdjustedPaceUnits = exports.GradeAdjustedPaceUnits = exports.PaceUnits = exports.VerticalSpeedUnits = exports.SpeedUnitsToGradeAdjustedSpeedUnits = exports.GradeAdjustedSpeedUnits = exports.SpeedUnits = void 0;
var SpeedUnits;
(function (SpeedUnits) {
    SpeedUnits["KilometersPerHour"] = "Speed in kilometers per hour";
    SpeedUnits["MilesPerHour"] = "Speed in miles per hour";
    SpeedUnits["MetersPerSecond"] = "Speed";
    SpeedUnits["FeetPerSecond"] = "Speed in feet per second";
    SpeedUnits["Knots"] = "Speed in knots";
    // MetersPerMinute = 'Meters per minute',
    // FeetPerMinute = 'Feet per minute',
})(SpeedUnits = exports.SpeedUnits || (exports.SpeedUnits = {}));
var GradeAdjustedSpeedUnits;
(function (GradeAdjustedSpeedUnits) {
    GradeAdjustedSpeedUnits["KilometersPerHour"] = "Grade Adjusted Speed in kilometers per hour";
    GradeAdjustedSpeedUnits["MilesPerHour"] = "Grade Adjusted Speed in miles per hour";
    GradeAdjustedSpeedUnits["MetersPerSecond"] = "Grade Adjusted Speed";
    GradeAdjustedSpeedUnits["FeetPerSecond"] = "Grade Adjusted Speed in feet per second";
    GradeAdjustedSpeedUnits["Knots"] = "Grade Adjusted Speed in knots";
    // MetersPerMinute = 'Meters per minute',
    // FeetPerMinute = 'Feet per minute',
})(GradeAdjustedSpeedUnits = exports.GradeAdjustedSpeedUnits || (exports.GradeAdjustedSpeedUnits = {}));
var SpeedUnitsToGradeAdjustedSpeedUnits;
(function (SpeedUnitsToGradeAdjustedSpeedUnits) {
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in kilometers per hour"] = "KilometersPerHour";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in miles per hour"] = "MilesPerHour";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed"] = "MetersPerSecond";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in feet per second"] = "FeetPerSecond";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in meters per minute"] = "MetersPerMinute";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in feet per minute"] = "FeetPerMinute";
    SpeedUnitsToGradeAdjustedSpeedUnits["Speed in knots"] = "Knots";
})(SpeedUnitsToGradeAdjustedSpeedUnits = exports.SpeedUnitsToGradeAdjustedSpeedUnits || (exports.SpeedUnitsToGradeAdjustedSpeedUnits = {}));
var VerticalSpeedUnits;
(function (VerticalSpeedUnits) {
    VerticalSpeedUnits["MetersPerSecond"] = "Vertical Speed";
    VerticalSpeedUnits["FeetPerSecond"] = "Vertical speed in feet per second";
    VerticalSpeedUnits["MetersPerMinute"] = "Vertical speed in meters per minute";
    VerticalSpeedUnits["FeetPerMinute"] = "Vertical speed in feet per minute";
    VerticalSpeedUnits["MetersPerHour"] = "Vertical speed in meters per hour";
    VerticalSpeedUnits["FeetPerHour"] = "Vertical speed in feet per hour";
    VerticalSpeedUnits["KilometersPerHour"] = "Vertical speed in kilometers per hour";
    VerticalSpeedUnits["MilesPerHour"] = "Vertical speed in miles per hour";
})(VerticalSpeedUnits = exports.VerticalSpeedUnits || (exports.VerticalSpeedUnits = {}));
var PaceUnits;
(function (PaceUnits) {
    PaceUnits["MinutesPerKilometer"] = "Pace";
    PaceUnits["MinutesPerMile"] = "Pace in minutes per mile";
})(PaceUnits = exports.PaceUnits || (exports.PaceUnits = {}));
var GradeAdjustedPaceUnits;
(function (GradeAdjustedPaceUnits) {
    GradeAdjustedPaceUnits["MinutesPerKilometer"] = "Grade Adjusted Pace";
    GradeAdjustedPaceUnits["MinutesPerMile"] = "Grade Adjusted Pace in minutes per mile";
})(GradeAdjustedPaceUnits = exports.GradeAdjustedPaceUnits || (exports.GradeAdjustedPaceUnits = {}));
var PaceUnitsToGradeAdjustedPaceUnits;
(function (PaceUnitsToGradeAdjustedPaceUnits) {
    PaceUnitsToGradeAdjustedPaceUnits["Pace"] = "MinutesPerKilometer";
    PaceUnitsToGradeAdjustedPaceUnits["Pace in minutes per mile"] = "MinutesPerMile";
})(PaceUnitsToGradeAdjustedPaceUnits = exports.PaceUnitsToGradeAdjustedPaceUnits || (exports.PaceUnitsToGradeAdjustedPaceUnits = {}));
var SwimPaceUnits;
(function (SwimPaceUnits) {
    SwimPaceUnits["MinutesPer100Meter"] = "Swim Pace";
    SwimPaceUnits["MinutesPer100Yard"] = "Swim Pace in minutes per 100 yard";
})(SwimPaceUnits = exports.SwimPaceUnits || (exports.SwimPaceUnits = {}));
// Disabled rest of the days due to lack of availability of calculating the week number
// See https://www.npmjs.com/package/weeknumber
var DaysOfTheWeek;
(function (DaysOfTheWeek) {
    DaysOfTheWeek[DaysOfTheWeek["Sunday"] = 0] = "Sunday";
    DaysOfTheWeek[DaysOfTheWeek["Monday"] = 1] = "Monday";
    // Tuesday,
    // Wednesday,
    // Thursday,
    // Friday,
    DaysOfTheWeek[DaysOfTheWeek["Saturday"] = 2] = "Saturday";
})(DaysOfTheWeek = exports.DaysOfTheWeek || (exports.DaysOfTheWeek = {}));
