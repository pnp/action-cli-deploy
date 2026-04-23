import esmock from 'esmock';
import { getOptions, isNullOrEmpty, isStringBoolean } from './utils.js';
import { Options, Scope } from './validate.js';
import { constants } from './constants.js';
import * as assert from 'assert';

describe('utils', () => {

  describe('isNullOrEmpty', () => {

    it('returns true when empty string is passed', () => {
      const expected = true;
      const actual = isNullOrEmpty('');
      assert.equal(actual, expected);
    });

    it('returns true when undefined passed', () => {
      const expected = true;
      const actual = isNullOrEmpty(undefined);
      assert.equal(actual, expected);
    });

    it('returns true when null passed', () => {
      const expected = true;
      const actual = isNullOrEmpty(null);
      assert.equal(actual, expected);
    });

    it('returns false when string is passed', () => {
      const expected = false;
      const actual = isNullOrEmpty('string');
      assert.equal(actual, expected);
    });
  });

  describe('isStringBoolean', () => {

    it('returns true when string is "true"', () => {
      const expected = true;
      const actual = isStringBoolean('true');
      assert.equal(actual, expected);
    });

    it('returns true when string is "false"', () => {
      const expected = true;
      const actual = isStringBoolean('false');
      assert.equal(actual, expected);
    });

    it('returns false when string is not "true" or "false"', () => {
      const expected = false;
      const actual = isStringBoolean('string');
      assert.equal(actual, expected);
    });

    it('returns false when string is empty', () => {
      const expected = false;
      const actual = isStringBoolean('');
      assert.equal(actual, expected);
    });
  });

  describe('getOptions', () => {

    it('throws error when no options are passed', () => {
      const optionsList: string[] = [];
      assert.throws(() => getOptions(optionsList), Error, 'Option names are required');
    });

    it('returns correct object', () => {
      const optionsList: string[] = ['APP_FILE_PATH', 'SCOPE', 'SITE_COLLECTION_URL', 'SKIP_FEATURE_DEPLOYMENT', 'OVERWRITE'];
      const actual = getOptions(optionsList);
      const expected: Options = {
        APP_FILE_PATH: '',
        SCOPE: '' as Scope,
        SITE_COLLECTION_URL: '',
        SKIP_FEATURE_DEPLOYMENT: Boolean(''),
        OVERWRITE: Boolean('')
      };
      assert.deepEqual(actual, expected);
    });

    it('returns correct object with parameters', async () => {
      const optionsList: string[] = ['APP_FILE_PATH', 'SCOPE', 'SITE_COLLECTION_URL', 'SKIP_FEATURE_DEPLOYMENT', 'OVERWRITE'];

      const inputs: Record<string, string> = {
        APP_FILE_PATH: 'solution.sppkg',
        SCOPE: 'tenant',
        SITE_COLLECTION_URL: '',
        SKIP_FEATURE_DEPLOYMENT: 'false',
        OVERWRITE: 'true'
      };

      const utilsMocked = await esmock<typeof import('./utils.js')>('./utils.js', {
        '@actions/core': {
          getInput: (name: string) => inputs[name] ?? ''
        }
      });

      const actual = utilsMocked.getOptions(optionsList);

      const expected: Options = {
        APP_FILE_PATH: 'solution.sppkg',
        SCOPE: 'tenant' as Scope,
        SITE_COLLECTION_URL: '',
        SKIP_FEATURE_DEPLOYMENT: false,
        OVERWRITE: true
      };
      assert.deepEqual(actual, expected);
    });
  });

  describe('execCommand', () => {

    it('returns correct object', async () => {
      const command = `${constants.CLI_PREFIX} spo app add --filePath solution.sppkg`;

      const utilsMocked = await esmock<typeof import('./utils.js')>('./utils.js', {
        '@actions/exec': {
          exec: async (_command: string, _args: string[], options: { listeners?: { stdout?: (data: Buffer) => void } }) => {
            options!.listeners!.stdout!(Buffer.from('hello world'));
            return 0;
          }
        }
      });

      const { stdout } = await utilsMocked.execCommand(command);
      assert.equal(stdout, 'hello world');
    });
  });
});
