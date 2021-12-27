import { StreamFilterInterface } from './stream.filter.interface';
import { LowPassFilter } from '../events/utilities/grade-calculator/low-pass-filter';
export declare class LowPassStreamFilter implements StreamFilterInterface {
    lowPassFilter: LowPassFilter;
    filterData(data: (number | null)[]): (number | null)[];
}
