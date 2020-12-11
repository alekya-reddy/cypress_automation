import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance({baseUrl: "https://default.pathfactory-development.com", username: "liming", password: "Lookbook123"});
//const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
//const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
//const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{

    it("should always pass", ()=>{
        cy.log("I always pass")
        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack("SpaceX Target")
        authoring.target.configure({
            name: "SpaceX Target",
            slug: "spacex-awesome",
            //contents: ["North Korea - Wikipedia"],
            flow: "on",
            flowCTA: "Standard Form Email Only",
            endPromoter: "on",
            endPromoterOptions: {
                link: "https://www.google.com"
            },
            exit: "on",
            exitOptions: {
                delay: "0"
            },
            formsStrategy: "on",
            formsStrategyOptions: {
                trackRule: {
                    form: "Standard Form Email Only",
                    timeOnTrack: '0',
                    showToUnknown: "on",
                    showToKnown: "on",
                    dismissable: "on"
                }
            }
        })
    })

})