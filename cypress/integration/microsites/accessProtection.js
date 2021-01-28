import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "accessProtection.js",
    slug: "accessprotection-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "target accessProtection.js",
    slug: "target-ap",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    accessProtection: {
        type: "Email",
        groups: gmailAPGroup
    }
}

const recommend = {
    name: "rec accessProtection.js",
    slug: "rec-ap",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title]
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

describe("Microsites - Access Protection", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
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

    it("Microsite access protection settings should override the access protection settings of the individual track", () => {
        authoring.common.login()
        authoring.microsites.visit()

        // Add access protection group to microsite and verify this setting applies to all microsite urls (home, landing pages, tracks)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.removeAccessProtection(hotmailAPGroup)
        authoring.microsites.setup({
            name: microsite.name,
            accessProtection: {
                type: "Email",
                groups: hotmailAPGroup
            }
        })

        const emailRequiredMsg = "Email confirmation is required"
        const emailNotAuthMsg = "Email is not authorized, please try again"
        const emailSuccessMsg = "Success! An email has been sent to your inbox"

        const urls = [microsite.url, landingPage.url, target.micrositeUrl, recommend.micrositeUrl]
        urls.forEach( url => {
            cy.visit(url)
            cy.contains(emailRequiredMsg).should("exist")
            cy.url().should("not.eq", url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)

            // Gmail email domain should not be authorized. Hotmail should be authorized
            cy.get(consumption.microsites.trackProtectionEmailInput).type("h8fdj092hy6b@gmail.com" + "\n")
            cy.contains(emailNotAuthMsg).should("exist")
            cy.contains("a", "Go Back").click()
            cy.get(consumption.microsites.trackProtectionEmailInput).type("h8fdj092hy6b@hotmail.com" + "\n")
            cy.contains(emailSuccessMsg).should("exist")
        })

        // Turn off access protection and verify on consumption
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.removeAccessProtection(hotmailAPGroup)
        authoring.microsites.setup({
            name: microsite.name,
            accessProtection: {
                type: "None"
            }
        })
        urls.forEach( url => {
            cy.visit(url)
            cy.url().should("contain", url)
            cy.contains(emailRequiredMsg).should("not.exist")
        })
    })
})