import { Common } from './Common.js'; 
import {ContentLibrary} from './ContentLibrary.js';
import {ClientHQ} from './ClientHQ.js';
import {WebdomainSettings} from './WebdomainSettings.js';
import {WebsiteTools} from './WebsiteTools.js';

export const authoring = {
    common: new Common(),
    contentLibrary: new ContentLibrary(),
    clientHQ: new ClientHQ(),
    webdomainSettings: new WebdomainSettings(),
    websiteTools: new WebsiteTools()
}