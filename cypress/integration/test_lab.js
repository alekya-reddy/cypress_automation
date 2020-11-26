import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({baseUrl: "https://default.pathfactory-staging.com", username: "liming", password: "Password1234"});
//const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
//const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{

    it("should always pass", ()=>{
        cy.log("I always pass")

        /*const firstBlockText = "hahahahaha"
        const block = {
            type: "HTML",
            content: `<h1>${firstBlockText}</h1>`,
            checkContent: {
                text: [firstBlockText],
                locators: ["h1"]
            },
            typography: {
                color: {r: "255", g: "255", b: "255"},
                textAlign: 'right'
            },
            className: "george",
            background: {
                color: {r: "0", g: "200", b: "200"},
                image: {
                    category: "Stock Images",
                    url: "https://img.cdn.lookbookhq.com/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "top",
                size: "contain"
            },
            spacing: "6rem"
        }

        const trackBlock = {
            type: "Track",
            track: "test track",
            heading: {
                color: {r: "0", g: "255", b: "255"},
                textAlign: 'center'
            },
            background: {
                color: {r: "0", g: "200", b: "100"},
                image: {
                    category: "Stock Images",
                    url: "https://img.cdn.lookbookhq.com/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "bottom",
                size: "cover"
            },
            spacing: "91px"
        }
        
        authoring.common.login()
        authoring.microsites.removeMicrosite("Testing")
        authoring.microsites.removeMicrosite("Delete me")
        authoring.microsites.addMicrosite("Testing")
        //authoring.microsites.goToMicrositeConfig("Testing")
        authoring.microsites.setup({
            name: "Testing",
            newName: "Delete me",
            slug: "sluggggg",
            cookieConsent: true
        })
        authoring.microsites.setup({
            name: "Delete me",
            newName: "Testing",
            slug: "hahah",
            cookieConsent: false
        })
        authoring.microsites.addTracks({target: "test track"})
        authoring.microsites.removeTracks("test track")
        authoring.microsites.addTracks({target: "test track"})
        authoring.microsites.addLandingPages("Test")
        //authoring.microsites.removeLandingPages("Test")
        authoring.microsites.goToPageEditor("Test")
        authoring.microsites.addAdvancedBlock(block)
        authoring.microsites.addAdvancedBlock(trackBlock)
        cy.go("back")
        authoring.microsites.addNavItem({label: "Track", type: "Track", source: "test track"})
        authoring.microsites.addNavItem({label: "Landing page", type: "Landing Page", source: "Test"})
        authoring.microsites.addNavItem({label: "Link", type: "Link", source: "https://wwww.wikipedia.org"})
        authoring.microsites.removeNavItems("Link")*/
    })

})