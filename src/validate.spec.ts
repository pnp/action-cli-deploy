import * as assert from 'assert';
import { Options, Scope, validate } from './validate';

describe('validate', () => {

  it('throws error if APP_FILE_PATH is not passed ', () => {
    const options: Options = {
      APP_FILE_PATH: '',
      SCOPE: Scope.Tenant,
      SITE_COLLECTION_URL: '',
      SKIP_FEATURE_DEPLOYMENT: false,
      OVERWRITE: false
    };
    assert.throws(() => validate(options), Error, 'You must provide APP_FILE_PATH parameters.');
  });

  it('throws error if APP_FILE_PATH does not have .sppkg file extension', () => {
    const options: Options = {
      APP_FILE_PATH: 'solution.exe',
      SCOPE: Scope.Tenant,
      SITE_COLLECTION_URL: '',
      SKIP_FEATURE_DEPLOYMENT: false,
      OVERWRITE: false
    };
    assert.throws(() => validate(options), Error, 'APP_FILE_PATH must be a path to a .sppkg file.');
  });

  it('throws error if SCOPE is not tenant or sitecollection', () => {
    const options: Options = {
      APP_FILE_PATH: 'solution.sppkg',
      SCOPE: 'invalid' as Scope,
      SITE_COLLECTION_URL: '',
      SKIP_FEATURE_DEPLOYMENT: false,
      OVERWRITE: false
    };
    assert.throws(() => validate(options), Error, `SCOPE must be either 'tenant' or Scope.SiteCollection.`);
  });

  it('throws error if SCOPE is sitecollection and SITE_COLLECTION_URL is empty', () => {
    const options: Options = {
      APP_FILE_PATH: 'solution.sppkg',
      SCOPE: Scope.SiteCollection,
      SITE_COLLECTION_URL: '',
      SKIP_FEATURE_DEPLOYMENT: false,
      OVERWRITE: false
    };
    assert.throws(() => validate(options), Error, 'SITE_COLLECTION_URL is required if SCOPE is set to Scope.SiteCollection.');
  });

  it('does not throw error if SCOPE is sitecollection and SITE_COLLECTION_URL is not empty', () => {
    const options: Options = {
      APP_FILE_PATH: 'solution.sppkg',
      SCOPE: Scope.SiteCollection,
      SITE_COLLECTION_URL: 'url',
      SKIP_FEATURE_DEPLOYMENT: false,
      OVERWRITE: false
    };
    assert.doesNotThrow(() => validate(options));
  });
});