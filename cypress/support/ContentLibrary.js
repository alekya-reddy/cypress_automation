import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(env, org, userName, password){
        super(env, org, userName, password);
        this.contentLibraryUrl = `${this.baseUrl}/authoring/content-library/content`;
    }

    visit(){
        cy.visit(this.contentLibraryUrl);
    }

}