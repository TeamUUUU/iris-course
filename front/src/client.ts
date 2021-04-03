
import { GeneralError } from './api'

type Response<Result> = GeneralError | Result;

export function getResult<Result>(response: Response<Result>): Result {
    if ((response as GeneralError).error) {
        throw (response as GeneralError).error;
    }
    return response as Result;
};
