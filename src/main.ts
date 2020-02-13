import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { existsSync } from 'fs';

let o365CLIPath: string;

async function main() {
    try {
        o365CLIPath = await which("o365", true);

        const appFilePath: string = core.getInput("APP_FILE_PATH", { required: true });
        const scope: string = core.getInput("SCOPE", { required: false });
        const siteCollectionUrl: string = core.getInput("SITE_COLLECTION_URL", { required: false });
        const skipFeatureDeployment: string = core.getInput("SKIP_FEATURE_DEPLOYMENT", { required: false }) == "true" ? "--skipFeatureDeployment" : "";
        const overwrite: string = core.getInput("OVERWRITE", { required: false }) == "true" ? "--overwrite" : "";

        let appId: string;

        if (existsSync(appFilePath)) {
            core.info("ℹ️ Starting upload and deployment...");
            if (scope == "sitecollection") {
                if (!siteCollectionUrl.length) {
                    core.error("🚨 Site collection URL - SITE_COLLECTION_URL - is needed when scope is set to sitecollection.");
                    core.setFailed("SITE_COLLECTION_URL not specified");
                } else {
                    appId = await executeO365CLICommand(`spo app add -p ${appFilePath} --scope sitecollection --appCatalogUrl ${siteCollectionUrl} ${overwrite}`);
                    await executeO365CLICommand(`spo app deploy --scope sitecollection --appCatalogUrl ${siteCollectionUrl} ${skipFeatureDeployment} --id ${appId}`);
                }
            } else {
                appId = await executeO365CLICommand(`spo app add -p ${appFilePath} ${overwrite}`);
                await executeO365CLICommand(`spo app deploy ${skipFeatureDeployment} --id ${appId}`);
            }
            core.info("✅ Upload and deployment complete.");
            core.setOutput("APP_ID", appId);
        } else {
            core.error("🚨 Please check if the app file path - APP_FILE_PATH - is correct.");
            core.setFailed("Path incorrect");
        }
    } catch (err) {
        core.error("🚨 Deployment failed.");
        core.setFailed(err);
    }
}

async function executeO365CLICommand(command: string): Promise<any> {
    let o365CLICommandOutput = '';
    const options: any = {};
    options.listeners = {
        stdout: (data: Buffer) => {
            o365CLICommandOutput += data.toString();
        }
    };
    try {
        await exec(`"${o365CLIPath}" ${command}`, [], options);
        return o365CLICommandOutput;
    }
    catch (err) {
        throw new Error(err);
    }
}

main();
