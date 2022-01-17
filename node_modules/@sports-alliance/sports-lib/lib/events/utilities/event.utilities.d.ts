import { EventInterface } from '../event.interface';
export declare class EventUtilities {
    static mergeEvents(events: EventInterface[]): EventInterface;
    static generateStatsForAll(event: EventInterface): void;
    static reGenerateStatsForEvent(event: EventInterface): void;
}
