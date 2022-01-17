import { COROSAPIEventMetaDataInterface, GarminHealthAPIEventMetaDataInterface, ServiceNames, SuuntoAppEventMetaDataInterface } from './event-meta-data.interface';
import { COROSAPIEventMetaDataJsonInterface, GarminHealthAPIEventMetaDataJsonInterface, SuuntoAppEventMetaDataJsonInterface } from './meta-data.json.interface';
export declare class SuuntoAppEventMetaData implements SuuntoAppEventMetaDataInterface {
    serviceWorkoutID: string;
    serviceUserName: string;
    date: Date;
    serviceName: ServiceNames;
    constructor(serviceWorkoutID: string, serviceUserName: string, date: Date);
    toJSON(): SuuntoAppEventMetaDataJsonInterface;
}
export declare class COROSAPIEventMetaData implements COROSAPIEventMetaDataInterface {
    serviceWorkoutID: string;
    serviceOpenId: string;
    serviceFITFileURI: string;
    date: Date;
    serviceName: ServiceNames;
    constructor(serviceWorkoutID: string, serviceOpenId: string, serviceFITFileURI: string, date: Date);
    toJSON(): COROSAPIEventMetaDataJsonInterface;
}
export declare class GarminHealthAPIEventMetaData implements GarminHealthAPIEventMetaDataInterface {
    serviceUserID: string;
    serviceActivityFileID: string;
    serviceActivityFileType: 'FIT' | 'TCX' | 'GPX';
    serviceManual: boolean;
    serviceStartTimeInSeconds: number;
    date: Date;
    serviceName: ServiceNames;
    constructor(serviceUserID: string, serviceActivityFileID: string, serviceActivityFileType: 'FIT' | 'TCX' | 'GPX', serviceManual: boolean, serviceStartTimeInSeconds: number, date: Date);
    toJSON(): GarminHealthAPIEventMetaDataJsonInterface;
}
