import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { existsSync } from 'fs';

let cliMicrosoft365Path: string;

async function main() {
    try {
        cliMicrosoft365Path = await which("m365", true);

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
                    appId = await executeCLIMicrosoft365Command(`spo app add -p ${appFilePath} --scope sitecollection --appCatalogUrl ${siteCollectionUrl} ${overwrite}`, true);
                    await executeCLIMicrosoft365Command(`spo app deploy --id ${appId} --scope sitecollection --appCatalogUrl ${siteCollectionUrl} ${skipFeatureDeployment}`);
                }
            } else {
                appId = await executeCLIMicrosoft365Command(`spo app add -p ${appFilePath} ${overwrite}`, true);
                await executeCLIMicrosoft365Command(`spo app deploy --id ${appId} ${skipFeatureDeployment}`);
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

async function executeCLIMicrosoft365Command(command: string, cleanOutput?: boolean): Promise<any> {
    let cliMicrosoft365CommandOutput = '';
    const options: any = {};
    options.listeners = {
        stdout: (data: Buffer) => {
            cliMicrosoft365CommandOutput += data.toString();
        }
    };
    try {
        await exec(`"${cliMicrosoft365Path}" ${command}`, [], options);
        return cleanOutput ? cliMicrosoft365CommandOutput.trim() : cliMicrosoft365CommandOutput;
    }
    catch (err) {
        throw new Error(err);
    }
}

main();