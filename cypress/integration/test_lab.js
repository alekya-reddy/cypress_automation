import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance({baseUrl: "https://default.pathfactory-development.com", username: "liming", password: "Password123"});
//const consumption = createConsumptionInstance({org: "automation-microsites", tld: "lookbookhq"})
//const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
//const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
//const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{
    it("should always pass", ()=>{
        cy.log("I always pass")
        authoring.common.login()
        authoring.configurations.configureVEXAppearance({
            appearance: "Delete",
            headerTitleFontFamily: "Overpass",
            headerTitleBoldFont: true,
            backgroundColor: {r: 10, g: 200, b: 155, a: 0.5},
            headerTitleFontSize: "large",
            headerTitleFontColor: {r: 200, g: 50, b: 9, a: 0.25}
        })
    })
})