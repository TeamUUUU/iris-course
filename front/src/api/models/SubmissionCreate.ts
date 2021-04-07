/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlagRecordCreate } from './FlagRecordCreate';
import type { NumberRecordCreate } from './NumberRecordCreate';
import type { TextRecordCreate } from './TextRecordCreate';

export type SubmissionCreate = {
    date?: number;
    records?: Array<(FlagRecordCreate | TextRecordCreate | NumberRecordCreate)>;
}
