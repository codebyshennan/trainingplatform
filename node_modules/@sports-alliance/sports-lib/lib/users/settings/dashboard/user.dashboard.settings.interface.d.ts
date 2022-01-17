import { ActivityTypes } from '../../../activities/activity.types';
import { TileSettingsInterface } from '../../../tiles/tile.settings.interface';
export interface UserDashboardSettingsInterface {
    dateRange: DateRanges;
    startDate: number;
    endDate: number;
    tiles: TileSettingsInterface[];
    tableSettings: TableSettings;
    activityTypes?: ActivityTypes[];
}
export interface TableSettings {
    eventsPerPage: number;
    active: string;
    direction: 'asc' | 'desc';
    selectedColumns: string[];
}
export declare enum DateRanges {
    thisWeek = 0,
    lastWeek = 1,
    lastSevenDays = 2,
    thisMonth = 3,
    lastMonth = 4,
    lastThirtyDays = 5,
    thisYear = 6,
    lastYear = 7,
    custom = 8,
    all = 9
}
