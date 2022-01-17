import { DataPace } from './data.pace';
export declare class DataGradeAdjustedPace extends DataPace {
    static type: string;
    static unit: string;
    getValue(formatForDataType?: string): number;
}
export declare class DataGradeAdjustedPaceMinutesPerMile extends DataGradeAdjustedPace {
    static type: string;
    static displayType: string;
    static unit: string;
    getValue(formatForDataType?: string): number;
}
