import { Common } from './authoringClasses/Common.js'; 
import {ContentLibrary} from './authoringClasses/ContentLibrary.js';
import {ClientHQ} from './authoringClasses/ClientHQ.js';
import {WebdomainSettings} from './authoringClasses/WebdomainSettings.js';
import {WebsiteTools} from './authoringClasses/WebsiteTools.js';
import {Vex} from './authoringClasses/Vex.js';
import {constants} from './constants.js';

import { CommonCX } from './consumptionClasses/CommonCX.js';
import { VexCX } from './consumptionClasses/VexCX.js';

export const createAuthoringInstance = function(config = {}){
    // Set up default values for your convenience 
    const env = config.env ? config.env : constants.testENV;
    const org = config.org ? config.org : constants.orgs['automation'].name 
    const username = config.username? config.username : constants.orgs[org].defaultUser; 
    const password = config.password ? config.password : constants.orgs[org].defaultUserPassword; 
    const tld = config.tld ? config.tld : false;
    const customBaseUrl = (function(configCustomBaseUrl, configTld, configOrg){
        if(configCustomBaseUrl){
            return configCustomBaseUrl;
        } else if ((configTld == 'pathfactory' || configTld == 'lookbookhq' ) && configOrg) {
            return `https://${configOrg}.${constants[`${configTld}Domain`]}`;
        } else {
            return false;
        }
    })(config.customBaseUrl, tld, config.org);

    // Return the page object instance initialized with all the classes and the locators/helper functions contained within 
    return (
        {
            common: new Common(env, org, username, password, customBaseUrl),
            contentLibrary: new ContentLibrary(env, org, username, password, customBaseUrl),
            clientHQ: new ClientHQ(env, org, username, password, customBaseUrl),
            webdomainSettings: new WebdomainSettings(env, org, username, password, customBaseUrl),
            websiteTools: new WebsiteTools(env, org, username, password, customBaseUrl),
            vex: new Vex(env, org, username, password, customBaseUrl)
        }
    );
}

export const createConsumptionInstance = function(config = {}){
    const env = config.env ? config.env : constants.testENV;
    const org = config.org ? config.org : constants.orgs['automation'].name 
    const tld = config.tld ? config.tld : false;
    const customBaseUrl = (function(configCustomBaseUrl, configTld, configOrg){
        if(configCustomBaseUrl){
            return configCustomBaseUrl;
        } else if ((configTld == 'pathfactory' || configTld == 'lookbookhq' ) && configOrg) {
            return `https://${configOrg}.${constants[`${configTld}Domain`]}`;
        } else {
            return false;
        }
    })(config.customBaseUrl, tld, config.org);

    return (
        {
            common: new CommonCX(env, org, customBaseUrl),
            vex: new VexCX(env, org, customBaseUrl)
        }
    );
}