import { DataNumber } from './data.number';
export declare class DataDistance extends DataNumber {
    static type: string;
    static unit: string;
    getDisplayValue(): string;
    getDisplayUnit(): string;
}
export declare class DataDistanceMiles extends DataDistance {
    static type: string;
    static unit: string;
}
