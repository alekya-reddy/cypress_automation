import { Common } from './Common.js'; 
import {ContentLibrary} from './ContentLibrary.js';
import {ClientHQ} from './ClientHQ.js';
import {WebdomainSettings} from './WebdomainSettings.js';
import {WebsiteTools} from './WebsiteTools.js';

export const createAuthoringInstance = function(config = {}){
    const env = config.env ? config.env : Cypress.env('TEST_ENV');
    const org = config.org ? config.org : 'automation';
    const username = config.username? config.username : "qa-automation";
    const password = config.password ? config.password : "Capybara123";

    return (
        {
            common: new Common(env, org, username, password),
            contentLibrary: new ContentLibrary(env, org, username, password),
            clientHQ: new ClientHQ(env, org, username, password),
            webdomainSettings: new WebdomainSettings(env, org, username, password),
            websiteTools: new WebsiteTools(env, org, username, password)
        }
    );
}