import { DataGradeAdjustedPace, DataGradeAdjustedPaceMinutesPerMile } from './data.grade-adjusted-pace';
export declare class DataGradeAdjustedPaceAvg extends DataGradeAdjustedPace {
    static type: string;
}
export declare class DataGradeAdjustedPaceAvgMinutesPerMile extends DataGradeAdjustedPaceMinutesPerMile {
    static type: string;
    static displayType: string;
    static unit: string;
    getValue(formatForDataType?: string): number;
}
