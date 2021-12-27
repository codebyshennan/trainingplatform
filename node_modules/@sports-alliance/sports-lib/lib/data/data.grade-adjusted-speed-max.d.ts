import { DataGradeAdjustedSpeed, DataGradeAdjustedSpeedFeetPerMinute, DataGradeAdjustedSpeedFeetPerSecond, DataGradeAdjustedSpeedKilometersPerHour, DataGradeAdjustedSpeedKnots, DataGradeAdjustedSpeedMetersPerMinute, DataGradeAdjustedSpeedMilesPerHour } from './data.grade-adjusted-speed';
export declare class DataGradeAdjustedSpeedMax extends DataGradeAdjustedSpeed {
    static type: string;
}
export declare class DataGradeAdjustedSpeedMaxKilometersPerHour extends DataGradeAdjustedSpeedKilometersPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMaxMilesPerHour extends DataGradeAdjustedSpeedMilesPerHour {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMaxFeetPerSecond extends DataGradeAdjustedSpeedFeetPerSecond {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMaxMetersPerMinute extends DataGradeAdjustedSpeedMetersPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMaxFeetPerMinute extends DataGradeAdjustedSpeedFeetPerMinute {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMaxKnots extends DataGradeAdjustedSpeedKnots {
    static type: string;
    static displayType: string;
    getDisplayType(): string;
}
