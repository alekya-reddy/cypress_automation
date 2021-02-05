import { CommonCX } from "./CommonCX";

export class ExploreCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.header = "#qa-header"
    } 
}