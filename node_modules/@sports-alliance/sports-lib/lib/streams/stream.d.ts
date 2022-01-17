import { StreamDataItem, StreamInterface } from './stream.interface';
import { StreamFilterInterface } from './stream.filter.interface';
export declare class Stream implements StreamInterface {
    readonly type: string;
    protected data: (number | null)[];
    protected filter: StreamFilterInterface | null;
    constructor(type: string, data?: (number | null)[]);
    clearFilters(): this;
    useFilter(filter: StreamFilterInterface): this;
    hasFilter(): boolean;
    getData(onlyNumeric?: boolean, filterInfinity?: boolean): (number | null)[];
    setData(data: (number | null)[]): this;
    getStreamDataByTime(startDate: Date, onlyNumeric?: boolean, filterInfinity?: boolean): StreamDataItem[];
    getStreamDataByDuration(offset?: number, onlyNumeric?: boolean, filterInfinity?: boolean): StreamDataItem[];
    isExportable(): boolean;
    toJSON(): StreamJSONInterface;
    private shouldDataBeFiltered;
}
export interface StreamJSONInterface {
    type: string;
    data: (number | null)[];
}
