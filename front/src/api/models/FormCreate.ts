/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldCreate } from './FieldCreate';

export type FormCreate = {
    title?: string;
    subtitle?: string;
    available_from?: number;
    available_to?: number;
    json_schema?: string;
    fields?: Array<FieldCreate>;
}
