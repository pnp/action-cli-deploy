import * as core from '@actions/core';
import { getOptions, execCommand } from './utils';
import { Options, validate } from './validate';
import { constants } from './constants';
import { existsSync } from 'fs';
import { getAddCommand, getDeployCommand } from './commands';
import { SpoApp } from './models';

async function run(): Promise<void> {

  const options: Options = getOptions([
    constants.ACTION_APP_FILE_PATH,
    constants.ACTION_SCOPE,
    constants.ACTION_SITE_COLLECTION_URL,
    constants.ACTION_SKIP_FEATURE_DEPLOYMENT,
    constants.ACTION_OVERWRITE
  ]);

  try {

    validate(options);
        
    if (existsSync(options.APP_FILE_PATH)) {
      await execCommand(`${constants.CLI_PREFIX} setup --scripting --output none`);

      const addCommand = getAddCommand(options);
      core.info(`Adding app with command: ${addCommand}`);
      const app = await execCommand(`${constants.CLI_PREFIX} ${addCommand}`);
      const { UniqueId: appId } = JSON.parse(app.stdout) as SpoApp;
      core.info(`APP_ID: ${appId}`);
            
      const deployCommand = getDeployCommand(options, appId);
      core.info(`Deploying app with command: ${deployCommand}`);

      await execCommand(`${constants.CLI_PREFIX} ${deployCommand}`);
      core.setOutput('APP_ID', appId);
    }

  } catch (err: unknown) {
    const error = err as Error;
    core.error(`🚨 ${error.message}`);
    core.setFailed(error);
  }
}

run();
