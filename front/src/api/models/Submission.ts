/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlagRecord } from './FlagRecord';
import type { NumberRecord } from './NumberRecord';
import type { TextRecord } from './TextRecord';

export type Submission = {
    id: number;
    date: number;
    records: Array<(FlagRecord | TextRecord | NumberRecord)>;
    form_id: number;
}
