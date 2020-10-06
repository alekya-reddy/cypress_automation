import { Common } from "./Common";

export class Recommend extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/recommend`;
        this.pageTitle = "Recommend Tracks";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

}