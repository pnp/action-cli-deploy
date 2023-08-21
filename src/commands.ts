import { Options, Scope } from './validate';

export function getAddCommand(options: Options): string {
  let command: string;

  if (options.SCOPE === Scope.SiteCollection) {
    command = `spo app add --filePath ${options.APP_FILE_PATH} --appCatalogScope ${options.SCOPE} --appCatalogUrl ${options.SITE_COLLECTION_URL}`;
  } else {
    command = `spo app add --filePath ${options.APP_FILE_PATH}`;
  }

  if (options.OVERWRITE) {
    command += ' --overwrite';
  }

  return command;
}

export function getDeployCommand(options: Options, appId: string,): string {
  let command: string;

  if (options.SCOPE === Scope.SiteCollection) {
    command = `spo app deploy --id ${appId} --appCatalogScope ${options.SCOPE} --appCatalogUrl ${options.SITE_COLLECTION_URL}`;
  } else {
    command = `spo app deploy --id ${appId}`;
  }

  if (options.SKIP_FEATURE_DEPLOYMENT) {
    command += ' --skipFeatureDeployment';
  }

  return command;
}