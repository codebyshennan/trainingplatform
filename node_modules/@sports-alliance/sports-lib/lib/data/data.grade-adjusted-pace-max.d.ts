import { DataGradeAdjustedPace, DataGradeAdjustedPaceMinutesPerMile } from './data.grade-adjusted-pace';
export declare class DataGradeAdjustedPaceMax extends DataGradeAdjustedPace {
    static type: string;
}
export declare class DataGradeAdjustedPaceMaxMinutesPerMile extends DataGradeAdjustedPaceMinutesPerMile {
    static type: string;
    static displayType: string;
    static unit: string;
    getValue(formatForDataType?: string): number;
}
