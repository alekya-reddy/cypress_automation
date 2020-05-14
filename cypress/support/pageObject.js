import { Common } from './Common.js'; 
import {ContentLibrary} from './ContentLibrary.js';
import {ClientHQ} from './ClientHQ.js';
import {WebdomainSettings} from './WebdomainSettings.js';
import {WebsiteTools} from './WebsiteTools.js';
import {constants} from './constants.js';

export const createAuthoringInstance = function(config = {}){
    const env = config.env ? config.env : constants.testENV;
    const org = config.org ? config.org : constants.automationSubdomain;
    const username = config.username? config.username : constants.automationUser;
    const password = config.password ? config.password : constants.automationUserPassword;
    const customBaseUrl = config.customBaseUrl ? config.customBaseUrl : false;

    return (
        {
            common: new Common(env, org, username, password, customBaseUrl),
            contentLibrary: new ContentLibrary(env, org, username, password, customBaseUrl),
            clientHQ: new ClientHQ(env, org, username, password, customBaseUrl),
            webdomainSettings: new WebdomainSettings(env, org, username, password, customBaseUrl),
            websiteTools: new WebsiteTools(env, org, username, password, customBaseUrl)
        }
    );
}