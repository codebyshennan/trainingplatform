import { DataNumber } from './data.number';
export declare class DataDuration extends DataNumber {
    static type: string;
    static unit: string;
    /**
     * Converts to hhh:mmm:ss:ms
     * @todo should adopt and round depending if needed to show seconds or not
     * @param showDays
     * @param showSeconds
     * @param showMilliseconds
     */
    getDisplayValue(showDays?: boolean, showSeconds?: boolean, showMilliseconds?: boolean): string;
    getDisplayUnit(): string;
}
