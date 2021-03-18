import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const recommend = {
    name: 'sharedRecommend'
};

const explore = {
    name: 'ctaButtons.js',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'ctabuttons-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};
const formCTA = 'sharedFormCTA'
const linkCTA = 'sharedLinkCTA'

describe("Explore CTA buttons", () => {

    it("Set up if not already done", ()=>{
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Add and delete CTA buttons", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        // turn CTA toggle ON
        authoring.common.toggle(authoring.explore.pageSidebar.ctaToggle, 'ON')
        // add all CTA's
        authoring.explore.addCTAButton('Hero', formCTA, 'Center')
        authoring.explore.addCTAButton('Body', linkCTA, 'Right')
        authoring.explore.addCTAButton('Footer', formCTA, 'Left')
        
        // check that all CTA button's are shown in authoring
        cy.contains(authoring.explore.heroCTA, formCTA).should('exist')
        cy.contains(authoring.explore.bodyCTA, linkCTA).should('exist')
        cy.contains(authoring.explore.footerCTA, formCTA).should('exist')

        cy.visit(explore.url)
        // check that all CTA button's are shown in consumption
        cy.contains(consumption.explore.hero.heroCTA, formCTA).should('exist')
        cy.contains(consumption.explore.body.bodyCTA, linkCTA).should('exist')
        cy.contains(consumption.explore.footer.footerCTA, formCTA).should('exist')

        // check hero CTA
        cy.get(consumption.explore.hero.heroCTA).click()
        cy.contains(consumption.explore.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.explore.closeModalButton).click({force: true})
        })
        // check body CTA
        cy.get(consumption.explore.body.bodyCTA).should("have.attr", "href", "https://www.google.com")
        // check footer CTA
        cy.get(consumption.explore.footer.footerCTA).click()
        cy.contains(consumption.explore.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.explore.closeModalButton).click({force: true})
        })

        // remove some cta's and check that they are not shown in authoring/consumption
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)

        cy.contains('label', 'Hero').click()
        cy.get(authoring.explore.popover).within(()=>{
            cy.get(authoring.explore.dropdown.box).eq(0).click()
            cy.get(authoring.explore.dropdown.input).eq(0).clear()
            cy.contains('button', 'Update').click({force: true})
        })

        cy.contains('label', 'Body').click()
        cy.get(authoring.explore.popover).within(()=>{
            cy.get(authoring.explore.dropdown.box).eq(0).click()
            cy.get(authoring.explore.dropdown.input).eq(0).clear()
            cy.contains('button', 'Update').click({force: true})
        })

        // check that removed CTAs are not shown in authoring
        cy.contains(authoring.explore.heroCTA, formCTA).should('not.exist')
        cy.contains(authoring.explore.bodyCTA, linkCTA).should('not.exist')
        cy.contains(authoring.explore.footerCTA, formCTA).should('exist')

        cy.visit(explore.url)
        // check that removed CTAs are not shown in consumption
        cy.contains(consumption.explore.hero.heroCTA, formCTA).should('not.exist')
        cy.contains(consumption.explore.body.bodyCTA, linkCTA).should('not.exist')
        cy.contains(consumption.explore.footer.footerCTA, formCTA).should('exist')

        // check that no CTA's present if toggle is off
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        authoring.common.toggle(authoring.explore.pageSidebar.ctaToggle, 'OFF')

        cy.contains(authoring.explore.heroCTA, formCTA).should('not.exist')
        cy.contains(authoring.explore.bodyCTA, linkCTA).should('not.exist')
        cy.contains(authoring.explore.footerCTA, formCTA).should('not.exist')

        cy.visit(explore.url)
        // check that removed CTAs are not shown in consumption
        cy.contains(consumption.explore.hero.heroCTA, formCTA).should('not.exist')
        cy.contains(consumption.explore.body.bodyCTA, linkCTA).should('not.exist')
        cy.contains(consumption.explore.footer.footerCTA, formCTA).should('not.exist')

    })
})


