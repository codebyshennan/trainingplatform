import { DataSpeed } from './data.speed';
export declare class DataGradeAdjustedSpeed extends DataSpeed {
    static type: string;
    getValue(formatForDataType?: string): number;
}
export declare class DataGradeAdjustedSpeedKilometersPerHour extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMilesPerHour extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedFeetPerSecond extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedMetersPerMinute extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedFeetPerMinute extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
export declare class DataGradeAdjustedSpeedKnots extends DataGradeAdjustedSpeed {
    static type: string;
    static displayType: string;
    static unit: string;
    getDisplayType(): string;
}
