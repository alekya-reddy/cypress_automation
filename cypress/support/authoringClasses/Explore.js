import { Common } from "./Common";

export class Explore extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/explore`;
        this.pageTitle = "Explore Pages";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

}