import { isNullOrEmpty } from './utils';

export interface Options {
    APP_FILE_PATH: string;
    SCOPE: Scope;
    SITE_COLLECTION_URL: string;
    SKIP_FEATURE_DEPLOYMENT: boolean;
    OVERWRITE: boolean;
}

export enum Scope {
    Tenant = 'tenant',
    SiteCollection = 'sitecollection'
}

export function validate(options: Options): void | Error {
    // if APP_FILE_PATH is empty, throw error
    if (isNullOrEmpty(options.APP_FILE_PATH)) {
        throw new Error('You must provide APP_FILE_PATH parameters.');
    }

    // if APP_FILE_PATH does not have .sppkg file extension, throw error
    if (!isNullOrEmpty(options.APP_FILE_PATH) && !options.APP_FILE_PATH.endsWith('.sppkg')) {
        throw new Error('APP_FILE_PATH must be a path to a .sppkg file.');
    }

    // if SCOPE is not empty and not tenant or sitecollection, throw error
    if (options.SCOPE !== Scope.Tenant && options.SCOPE !== Scope.SiteCollection) {
        throw new Error(`SCOPE must be either 'tenant' or 'sitecollection'.`);
    }

    // if SCOPE is sitecollection and SITE_COLLECTION_URL is empty, throw error
    if (options.SCOPE === Scope.SiteCollection && isNullOrEmpty(options.SITE_COLLECTION_URL)) {
        throw new Error(`SITE_COLLECTION_URL is required if SCOPE is set to 'sitecollection'.`);
    }
}