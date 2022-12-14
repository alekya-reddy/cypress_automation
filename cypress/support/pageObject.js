import { Common } from './authoringClasses/Common.js'; 
import {ContentLibrary} from './authoringClasses/ContentLibrary.js';
import {ClientHQ} from './authoringClasses/ClientHQ.js';
import {WebsiteTools} from './authoringClasses/WebsiteTools.js';
import {Vex} from './authoringClasses/Vex.js';
import {Configurations} from './authoringClasses/Configurations.js';
import {Settings} from './authoringClasses/Settings.js';
import {Target} from './authoringClasses/Target.js';
import {Recommend} from './authoringClasses/Recommend.js';
import {Explore} from './authoringClasses/Explore.js';
import {Website} from './authoringClasses/Website.js';
import {Microsites} from './authoringClasses/Microsites.js';
import {constants} from './constants.js';
import {UserManagement} from './authoringClasses/UserManagement.js';
import {ContentIntelligence} from './authoringClasses/ContentIntelligence.js';


import { CommonCX } from './consumptionClasses/CommonCX.js';
import { VexCX } from './consumptionClasses/VexCX.js';
import { MicrositesCX } from './consumptionClasses/MicrositesCX.js';
import { TargetCX } from './consumptionClasses/TargetCX.js';
import { RecommendCX } from './consumptionClasses/RecommendCX.js';
import { ExploreCX } from './consumptionClasses/ExploreCX.js';
import { WebsiteToolsCX } from './consumptionClasses/WebsiteToolsCX.js';

export const createAuthoringInstance = function(config = {}){
    // Set up default values for your convenience 
    const env = constants
    const org = config.org ? config.org : "automation" 
    const tld = config.tld ? config.tld : "pathfactory";
    const username = config.username ? config.username : constants.orgs[org].defaultUser; 
    const password = config.password ? config.password : constants.orgs[org].defaultUserPassword; 
    const baseUrl = (()=>{
        if(config.baseUrl){
            return config.baseUrl
        } else {
            return `https://${org}.${constants.domain[tld][constants.TEST_ENV]}`
        }
    })()


    // Return the page object instance initialized with all the classes and the locators/helper functions contained within 
    return (
        {
            common: new Common(env, org, tld, username, password, baseUrl),
            contentLibrary: new ContentLibrary(env, org, tld, username, password, baseUrl),
            clientHQ: new ClientHQ(env, org, tld, username, password, baseUrl),
            websiteTools: new WebsiteTools(env, org, tld, username, password, baseUrl),
            vex: new Vex(env, org, tld, username, password, baseUrl),
            configurations: new Configurations(env, org, tld, username, password, baseUrl),
            settings: new Settings(env, org, tld, username, password, baseUrl),
            target: new Target(env, org, tld, username, password, baseUrl),
            recommend: new Recommend(env, org, tld, username, password, baseUrl),
            explore: new Explore(env, org, tld, username, password, baseUrl),
            website: new Website(env, org, tld, username, password, baseUrl),
            microsites: new Microsites(env, org, tld, username, password, baseUrl),
            userManagement: new UserManagement(env, org, tld, username, password, baseUrl),
            contentIntelligence: new ContentIntelligence(env, org, tld, username, password, baseUrl)
        }
    );
}

export const createConsumptionInstance = function(config = {}){
    const env = config.env ? config.env : constants.testENV;
    const org = config.org ? config.org : constants.orgs['automation'].name;
    const tld = config.tld ? config.tld : "lookbookhq";
    const baseUrl = (()=>{
        if(config.baseUrl){
            return config.baseUrl
        } else {
            return `https://${org}.${constants.domain[tld][constants.TEST_ENV]}`
        }
    })()

    return (
        {
            common: new CommonCX(env, org, tld, baseUrl),
            vex: new VexCX(env, org, tld, baseUrl),
            microsites: new MicrositesCX(env, org, tld, baseUrl),
            target: new TargetCX(env, org, tld, baseUrl),
            recommend: new RecommendCX(env, org, tld, baseUrl),
            explore: new ExploreCX(env, org, tld, baseUrl),
            websiteTools: new WebsiteToolsCX(env, org, tld, baseUrl),
        }
    );
}