import { DataGradeAdjustedSpeed, DataGradeAdjustedSpeedFeetPerMinute, DataGradeAdjustedSpeedFeetPerSecond, DataGradeAdjustedSpeedKilometersPerHour, DataGradeAdjustedSpeedKnots, DataGradeAdjustedSpeedMetersPerMinute, DataGradeAdjustedSpeedMilesPerHour } from './data.grade-adjusted-speed';
export declare class DataGradeAdjustedSpeedAvg extends DataGradeAdjustedSpeed {
    static type: string;
}
export declare class DataGradeAdjustedSpeedAvgKilometersPerHour extends DataGradeAdjustedSpeedKilometersPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedAvgMilesPerHour extends DataGradeAdjustedSpeedMilesPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedAvgFeetPerSecond extends DataGradeAdjustedSpeedFeetPerSecond {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedAvgMetersPerMinute extends DataGradeAdjustedSpeedMetersPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedAvgFeetPerMinute extends DataGradeAdjustedSpeedFeetPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedAvgKnots extends DataGradeAdjustedSpeedKnots {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
