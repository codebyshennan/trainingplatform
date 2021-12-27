import { EventInterface } from '../../event.interface';
import { EventExporter } from './exporter.interface';
export declare class EventExporterGPX implements EventExporter {
    fileType: string;
    fileExtension: string;
    getAsString(event: EventInterface): Promise<string>;
}
