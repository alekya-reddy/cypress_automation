import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-microsites", tld: "lookbookhq"})

// Yes, this external code is absurdly complicated, but it's meant to simulate the weird external codes our customers have
function waitAndAddAttr (attributeValue) {
    setTimeout(() => {
        if (document.querySelector("#pf-microsite-header")) { 
             document.querySelector("#pf-microsite-header").setAttribute(attributeValue, attributeValue);
        } else {
            console.log("Keep waiting, smarty pants!");
            waitAndAddAttr(attributeValue);
        }
    }, 100)
}
const codeGenerator = (attributeValue) => `<script id="${attributeValue}">${waitAndAddAttr.toString()}; waitAndAddAttr("${attributeValue}");</script>`
// These codes test script codes
const micrositeExternalCode = {name: "microsite externalCode.js", interceptCode: codeGenerator("microsite")}
const targetExternalCode = {name: "target externalCode.js", interceptCode: codeGenerator("target")}
const recommendExternalCode = {name: "recommend externalCode.js", interceptCode: codeGenerator("recommend")}
// These codes test html-element codes
const micrositeAppearanceExternalCode = {name: "External Code 1 - Shared Resource", interceptCode: `<div id="ec-shared-1">External Code 1 - Shared Resource</div>`}
const micrositeSetupExternalCode = {name: "External Code 2 - Shared Resource", interceptCode: `<div id="ec-shared-2">External Code 2 - Shared Resource</div>`}
// A harmless global external code that won't break any tests if left on permanently - it just console.logs a message
const globalExternalCode = {name: "External Code 3 - Shared Resource", interceptCode: `<script id="global">console.log("Global External Code")</script>`}
const testSpecificCodes = [micrositeExternalCode, targetExternalCode, recommendExternalCode]

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const appearance = {
    name: "externalCode.js",
    get microsite () {
        return {
            appearance: this.name,
            externalCodes: micrositeAppearanceExternalCode.name
        } 
    },
    get explore () {
        return {
            appearance: this.name,
            externalCodes: micrositeAppearanceExternalCode.name
        }
    }
}

const microsite = {
    name: "externalCode.js",
    slug: "externalcode-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: appearance.name
}

const target = {
    name: "target externalCode.js",
    slug: "target-ec",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    externalCode: targetExternalCode.name
}

const recommend = {
    name: "rec externalCode.js",
    slug: "rec-ec",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    externalCode: recommendExternalCode.name
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "track",
            track: target.name
        },
        {
            type: "track",
            track: recommend.name
        }
    ]
}

describe("Microsites - External Code", () => {
    it("Setup if not already done", ()=>{
        // The way I've designed this is as follows:
        // The microsite is what gets checked. If not present, automatically tear down all resources, and add them back.
        // This applies only to test specific resources. Common resources never get touched.
        // This way, the only thing that needs to be true to reset the entire setup with no other manual input is for microsite to not exist.
        // If microsite exists, assume entire setup is correct and move on to the actual test
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
                testSpecificCodes.forEach(code => {
                    authoring.configurations.addExternalCode(code)
                })
                authoring.configurations.deleteAppearance(appearance.name)
                authoring.configurations.addNewAppearance(appearance)
                authoring.configurations.configureMicrositesAppearance(appearance.microsite)
                authoring.configurations.configureExploreAppearance(appearance.explore)
                authoring.target.deleteTrack(target.name)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
                authoring.recommend.deleteTrack(recommend.name)
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({recommend: recommend.name, target: target.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Add, remove external code from microsites setup area", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        const micrositeSetupCodes = [micrositeExternalCode.name, micrositeSetupExternalCode.name, targetExternalCode.name, recommendExternalCode.name]
        authoring.microsites.removeExternalCode(micrositeSetupCodes) // This is just a clean up step
        authoring.microsites.addExternalCode(micrositeSetupCodes) // Includes verification
        authoring.microsites.removeExternalCode([target.externalCode, recommend.externalCode]) // Includes verification
        cy.contains("button", "Save").click()
        cy.contains(authoring.common.messages.recordSaved, {timeout: 10000}).should("exist")

        // Verify that the all applicable codes are being applied in the landing page editor
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.get('script[id="global"]').should("exist") // Comes from global external code
        cy.get(`script[id="microsite"]`).should("exist") // Comes from microsite setup
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // Comes from microsite appearance. Make sure no duplicate from Explore.
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("exist") // Comes from microsite setup
    })

    it("Verify on consumption that external codes from microsite, target and recommend are working", () => {
        // To verify that external code scripts are working, check the navigation header for the unique attributes that the external codes have added
        // To verify that external code html are added to the DOM, check for the html contents
        // Global external code should always be present - check for the script tag
        // Microsite external code should be present on all microsite urls - home page, landing page, target or recommend
        cy.visit(microsite.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get('script[id="global"]').should("exist") // From global external code
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // From microsite appearance - make sure no duplicate from explore appearance
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("exist") // From microsite setup area
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite") // From microsite setup area
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target") // Target's external code should not be active
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend") // Recommend's external code should not be active

        cy.visit(landingPage.url)
        cy.get('script[id="global"]').should("exist")
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("exist").should("have.length", 1)
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("exist")
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend")

        // Target external codes should be active only on target
        cy.visit(target.micrositeUrl)
        cy.get('script[id="global"]').should("exist")
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("exist").should("have.length", 1)
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("exist")
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "target", "target")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend")

        // Recommend external codes should be active only on recommend
        cy.visit(recommend.micrositeUrl)
        cy.get('script[id="global"]').should("exist")
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("exist").should("have.length", 1)
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("exist")
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "recommend", "recommend")

        // Visiting a target track (not as part of a microsite) - should see only the target track's external code + the global one
        cy.visit(target.url)
        cy.get('script[id="global"]').should("exist")
        cy.get(`div:contains("${micrositeAppearanceExternalCode.name}")`).should("not.exist")
        cy.get(`div:contains("${micrositeSetupExternalCode.name}")`).should("not.exist")
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
        cy.get('script[id="target"]').should("exist") // since the nav header doesn't exist, just check for the script tag itself
        cy.get('script[id="recommend"]').should("not.exist")
        cy.get('script[id="microsite"]').should("not.exist")
    })
})