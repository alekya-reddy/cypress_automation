import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance({baseUrl: "https://default.pathfactory-development.com", username: "liming", password: "Password123"});
const consumption = createConsumptionInstance()

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{
    it("should always pass", ()=>{
        cy.log("I always pass")
    })
})