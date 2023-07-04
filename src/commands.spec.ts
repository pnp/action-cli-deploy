import * as assert from 'assert';
import { getAddCommand, getDeployCommand, } from './commands';
import { Options, Scope } from './validate';

describe('commands', () => {

    describe('getAddCommand', () => {

        it('returns correct command with options (defaults)', () => {
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.Tenant,
                SITE_COLLECTION_URL: '',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: false
            };
            const command = getAddCommand(options);
            assert.equal(command, `spo app add --filePath solution.sppkg`);
        });

        it('returns correct command with options (site collection)', () => {
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.SiteCollection,
                SITE_COLLECTION_URL: 'https://contoso.sharepoint.com/sites/site1',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: false
            };
            const command = getAddCommand(options);
            assert.equal(command, `spo app add --filePath solution.sppkg --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1`);
        });

        it('returns correct command with options (overwrite)', () => {
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.Tenant,
                SITE_COLLECTION_URL: '',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: true
            };
            const command = getAddCommand(options);
            assert.equal(command, `spo app add --filePath solution.sppkg --overwrite`);
        });

        it('returns correct command with options (site collection, overwrite)', () => {
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.SiteCollection,
                SITE_COLLECTION_URL: 'https://contoso.sharepoint.com/sites/site1',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: true
            };
            const command = getAddCommand(options);
            assert.equal(command, `spo app add --filePath solution.sppkg --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1 --overwrite`);
        });

    });

    describe('getDeployCommand', () => {

        it('returns correct command with options (defaults)', () => {
            const appId = '00000000-0000-0000-0000-000000000000';
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.Tenant,
                SITE_COLLECTION_URL: '',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: false
            };
            const command = getDeployCommand(options, appId);
            assert.equal(command, `spo app deploy --id 00000000-0000-0000-0000-000000000000`);
        });

        it('returns correct command with options (site collection)', () => {
            const appId = '00000000-0000-0000-0000-000000000000';
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.SiteCollection,
                SITE_COLLECTION_URL: 'https://contoso.sharepoint.com/sites/site1',
                SKIP_FEATURE_DEPLOYMENT: false,
                OVERWRITE: false
            };
            const command = getDeployCommand(options, appId);
            assert.equal(command, `spo app deploy --id 00000000-0000-0000-0000-000000000000 --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1`);
        });

        it('returns correct command with options (skip feature deployment)', () => {
            const appId = '00000000-0000-0000-0000-000000000000';
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.Tenant,
                SITE_COLLECTION_URL: '',
                SKIP_FEATURE_DEPLOYMENT: true,
                OVERWRITE: false
            };
            const command = getDeployCommand(options, appId);
            assert.equal(command, `spo app deploy --id 00000000-0000-0000-0000-000000000000 --skipFeatureDeployment`);
        });

        it('returns correct command with options (site collection, skip feature deployment)', () => {
            const appId = '00000000-0000-0000-0000-000000000000';
            const options: Options = {
                APP_FILE_PATH: 'solution.sppkg',
                SCOPE: Scope.SiteCollection,
                SITE_COLLECTION_URL: 'https://contoso.sharepoint.com/sites/site1',
                SKIP_FEATURE_DEPLOYMENT: true,
                OVERWRITE: true
            };
            const command = getDeployCommand(options, appId);
            assert.equal(command, `spo app deploy --id 00000000-0000-0000-0000-000000000000 --appCatalogScope sitecollection --appCatalogUrl https://contoso.sharepoint.com/sites/site1 --skipFeatureDeployment`);
        });
    });
});