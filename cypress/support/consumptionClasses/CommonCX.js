
export class CommonCX {
    constructor(env, org, customBaseUrl){
        this.org = org;
        this.env = env;
        this.customBaseUrl = customBaseUrl;
        this.baseUrl = customBaseUrl ? customBaseUrl : `https://${org}.${env}.com`;
    }
}