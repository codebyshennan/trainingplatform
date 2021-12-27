import { DataInterface, UnitSystem } from './data.interface';
import { DataJSONInterface } from './data.json.interface';
import { DataPositionInterface } from './data.position.interface';
export declare abstract class Data implements DataInterface {
    static type: string;
    static unit: string;
    static displayType?: string;
    static unitSystem: UnitSystem;
    protected value: number | string | boolean | string[] | DataPositionInterface;
    protected constructor(value: string | number | boolean | string[] | DataPositionInterface);
    setValue(value: string | number | boolean | string[] | DataPositionInterface): this;
    getValue(formatForDataType?: string): string | number | boolean | string[] | DataPositionInterface;
    getDisplayValue(): number | string | string[];
    getType(): string;
    getUnit(): string;
    getDisplayUnit(): string;
    getDisplayType(): string;
    getUnitSystem(): UnitSystem;
    isValueTypeValid(value: any): boolean;
    toJSON(): DataJSONInterface;
}
