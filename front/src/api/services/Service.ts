/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Fields } from '../models/Fields';
import type { Form } from '../models/Form';
import type { FormCreate } from '../models/FormCreate';
import type { Forms } from '../models/Forms';
import type { GeneralError } from '../models/GeneralError';
import type { Submission } from '../models/Submission';
import type { SubmissionCreate } from '../models/SubmissionCreate';
import type { Submissions } from '../models/Submissions';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import { request as __request } from '../core/request';

export class Service {

    /**
     * @param requestBody Create User
     * @returns User Created User Object
     * @throws ApiError
     */
    public static async createUser(
        requestBody: UserCreate,
    ): Promise<User> {
        const result = await __request({
            method: 'PUT',
            path: `/users`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param email
     * @returns User User Object with Email
     * @throws ApiError
     */
    public static async getUser(
        email: string,
    ): Promise<User> {
        const result = await __request({
            method: 'GET',
            path: `/users`,
            query: {
                'email': email,
            },
        });
        return result.body;
    }

    /**
     * @param userId
     * @param requestBody Create form
     * @returns Form Created Form Object
     * @returns GeneralError unexpected error
     * @throws ApiError
     */
    public static async createForm(
        userId: number,
        requestBody: FormCreate,
    ): Promise<Form | GeneralError> {
        const result = await __request({
            method: 'PUT',
            path: `/users/${userId}/forms`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param userId
     * @returns Forms Forms created by current user
     * @returns GeneralError unexpected error
     * @throws ApiError
     */
    public static async getForms(
        userId: number,
    ): Promise<Forms | GeneralError> {
        const result = await __request({
            method: 'GET',
            path: `/users/${userId}/forms`,
        });
        return result.body;
    }

    /**
     * @param link
     * @returns Form From description by unique link
     * @returns GeneralError unexpected error
     * @throws ApiError
     */
    public static async getFormByLink(
        link: string,
    ): Promise<Form | GeneralError> {
        const result = await __request({
            method: 'GET',
            path: `/forms`,
            query: {
                'link': link,
            },
        });
        return result.body;
    }

    /**
     * @param formId
     * @returns Form Form
     * @throws ApiError
     */
    public static async getFormById(
        formId: number,
    ): Promise<Form> {
        const result = await __request({
            method: 'GET',
            path: `/forms/${formId}`,
        });
        return result.body;
    }

    /**
     * @param formId
     * @returns Fields Fields of specified form
     * @returns GeneralError unexpected error
     * @throws ApiError
     */
    public static async getFormFields(
        formId: number,
    ): Promise<Fields | GeneralError> {
        const result = await __request({
            method: 'GET',
            path: `/forms/${formId}/fields`,
        });
        return result.body;
    }

    /**
     * @param formId
     * @returns Submissions Submissions of specified form
     * @returns GeneralError unexpected error
     * @throws ApiError
     */
    public static async getFormSubmissions(
        formId: number,
    ): Promise<Submissions | GeneralError> {
        const result = await __request({
            method: 'GET',
            path: `/forms/${formId}/submissions`,
        });
        return result.body;
    }

    /**
     * @param formId
     * @param requestBody
     * @returns Submission Submissions of specified form
     * @throws ApiError
     */
    public static async createFormSubmission(
        formId: number,
        requestBody: SubmissionCreate,
    ): Promise<Submission> {
        const result = await __request({
            method: 'PUT',
            path: `/forms/${formId}/submissions`,
            body: requestBody,
        });
        return result.body;
    }

}