import { DataGradeAdjustedSpeed, DataGradeAdjustedSpeedFeetPerMinute, DataGradeAdjustedSpeedFeetPerSecond, DataGradeAdjustedSpeedKilometersPerHour, DataGradeAdjustedSpeedKnots, DataGradeAdjustedSpeedMetersPerMinute, DataGradeAdjustedSpeedMilesPerHour } from './data.grade-adjusted-speed';
export declare class DataGradeAdjustedSpeedMin extends DataGradeAdjustedSpeed {
    static type: string;
}
export declare class DataGradeAdjustedSpeedMinKilometersPerHour extends DataGradeAdjustedSpeedKilometersPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMinMilesPerHour extends DataGradeAdjustedSpeedMilesPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMinFeetPerSecond extends DataGradeAdjustedSpeedFeetPerSecond {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMinMetersPerMinute extends DataGradeAdjustedSpeedMetersPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMinFeetPerMinute extends DataGradeAdjustedSpeedFeetPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMinKnots extends DataGradeAdjustedSpeedKnots {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
