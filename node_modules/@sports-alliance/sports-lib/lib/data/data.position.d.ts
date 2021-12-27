import { DataBare } from './data.bare';
import { DataPositionInterface } from './data.position.interface';
export declare class DataPosition extends DataBare {
    static type: string;
    protected value: DataPositionInterface;
    constructor(value: DataPositionInterface);
    getValue(): DataPositionInterface;
    getDisplayValue(): string;
    isValueTypeValid(value: any): boolean;
}
