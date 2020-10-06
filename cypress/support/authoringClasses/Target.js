import { Common } from "./Common";

export class Target extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/target`;
        this.pageTitle = "Target Tracks";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

}

