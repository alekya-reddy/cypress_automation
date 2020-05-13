import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(){
        super();
        this.contentLibraryUrl = `${this.baseUrl}/authoring/content-library/content`;
    }

    visit(){
        cy.visit(this.contentLibraryUrl);
    }

}