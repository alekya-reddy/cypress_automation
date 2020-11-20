import { Common } from "./Common";

export class Microsites extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/microsite`;
        this.pageTitle = "Microsites";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

}