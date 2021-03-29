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
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
const emailRequiredMsg = "Email confirmation is required"
const emailNotAuthMsg = "Email is not authorized, please try again"
const emailSuccessMsg = "Success! An email has been sent to your inbox"

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

    it("Validate access protection configuration section in Microsite builder", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
        cy.contains(authoring.microsites.antRow, "Protection Type").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).type('Email' + "\n")
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.get(authoring.microsites.dropDown).children().each(($el,index,$list)=>{
            cy.wrap($el).should("not.have.class",'ant-select-item-option-disabled')
        })
        //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.get(authoring.microsites.dropDown).children().each(($el,index,$list)=>{
            if(index==0){
                cy.wrap($el).should("have.class",'ant-select-item-option-selected')
            }else{
                cy.wrap($el).should("have.class",'ant-select-item-option-disabled')
            }
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        //When a group is selected in Allowed Groups list, then that group should be shown in the drop down list of Allowed with area selected and not shown in Disallowed groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.microsites.dropDown).children().each(($el,index,$list)=>{
            cy.wrap($el).invoke('text').then((text)=>{
                if(text == gmailAPGroup){
                    cy.wrap($el).should("have.class",'ant-select-item-option-selected')
                }
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and with area selected in Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.microsites.DisallowGroups).siblings('div').within(()=>{
            cy.get(authoring.microsites.dropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).invoke('text').then((text)=>{
                    if(text == gmailAPGroup){
                        cy.wrap($el).should("have.class",'ant-select-item-option-selected')
                    }
                })
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
        })
        //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.contains("button", "Save").click()
})
    it("Microsite access protection settings should override the access protection settings of the individual track", () => {
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
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
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