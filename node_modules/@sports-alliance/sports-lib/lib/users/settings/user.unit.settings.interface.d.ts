export interface UserUnitSettingsInterface {
    speedUnits: SpeedUnits[];
    gradeAdjustedSpeedUnits: GradeAdjustedSpeedUnits[];
    verticalSpeedUnits: VerticalSpeedUnits[];
    paceUnits: PaceUnits[];
    gradeAdjustedPaceUnits: GradeAdjustedPaceUnits[];
    swimPaceUnits: SwimPaceUnits[];
    startOfTheWeek: DaysOfTheWeek;
}
export declare enum SpeedUnits {
    KilometersPerHour = "Speed in kilometers per hour",
    MilesPerHour = "Speed in miles per hour",
    MetersPerSecond = "Speed",
    FeetPerSecond = "Speed in feet per second",
    Knots = "Speed in knots"
}
export declare enum GradeAdjustedSpeedUnits {
    KilometersPerHour = "Grade Adjusted Speed in kilometers per hour",
    MilesPerHour = "Grade Adjusted Speed in miles per hour",
    MetersPerSecond = "Grade Adjusted Speed",
    FeetPerSecond = "Grade Adjusted Speed in feet per second",
    Knots = "Grade Adjusted Speed in knots"
}
export declare enum SpeedUnitsToGradeAdjustedSpeedUnits {
    'Speed in kilometers per hour' = "KilometersPerHour",
    'Speed in miles per hour' = "MilesPerHour",
    'Speed' = "MetersPerSecond",
    'Speed in feet per second' = "FeetPerSecond",
    'Speed in meters per minute' = "MetersPerMinute",
    'Speed in feet per minute' = "FeetPerMinute",
    'Speed in knots' = "Knots"
}
export declare enum VerticalSpeedUnits {
    MetersPerSecond = "Vertical Speed",
    FeetPerSecond = "Vertical speed in feet per second",
    MetersPerMinute = "Vertical speed in meters per minute",
    FeetPerMinute = "Vertical speed in feet per minute",
    MetersPerHour = "Vertical speed in meters per hour",
    FeetPerHour = "Vertical speed in feet per hour",
    KilometersPerHour = "Vertical speed in kilometers per hour",
    MilesPerHour = "Vertical speed in miles per hour"
}
export declare enum PaceUnits {
    MinutesPerKilometer = "Pace",
    MinutesPerMile = "Pace in minutes per mile"
}
export declare enum GradeAdjustedPaceUnits {
    MinutesPerKilometer = "Grade Adjusted Pace",
    MinutesPerMile = "Grade Adjusted Pace in minutes per mile"
}
export declare enum PaceUnitsToGradeAdjustedPaceUnits {
    'Pace' = "MinutesPerKilometer",
    'Pace in minutes per mile' = "MinutesPerMile"
}
export declare enum SwimPaceUnits {
    MinutesPer100Meter = "Swim Pace",
    MinutesPer100Yard = "Swim Pace in minutes per 100 yard"
}
export declare enum DaysOfTheWeek {
    Sunday = 0,
    Monday = 1,
    Saturday = 2
}
