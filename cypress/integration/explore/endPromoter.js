import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const email = "EndFormExplore@pathfactory.com"

const target = {
    name: 'EndPromoterTest.js',
    slug: 'endpromoter',
    contents: [webContent.title],
    exit: "off",
    endPromoter: "on",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const targetwithLinkPromoter = {
    name: 'EndPromoterTest.js',
    endPromoterOptions1: {
        link: "https://www.google.com/",
        ctaLabel: "link",
        delay: "1"
    },
}

const targetwithCtaPromoter = {
    name: 'EndPromoterTest.js',
    endPromoterOptions2: {
        cta: "sharedFormCTA",
        delay: "1"
    },
}

const explore = {
    name: 'EndPromoterTestExplore.js',
    experienceType: "Target",
    trackName: target.name,
    slug: 'endpromoter',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

describe("Explore - End Promoter Behaviour", () => {
    it("Setup Target Track if not already done", () => {
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.recommend.addTrack(target)
                authoring.recommend.configure(target)
            }
        })
    })

    it("Setup Explore page if not already done", () => {
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Verify End Promoter Behaviour", () => {
        authoring.common.login()
        cy.visit(explore.url)
        cy.contains('div', "Website Common Resource").click()
        // verify endPromoter Exist and clicking on it will open cta form
        cy.get('#endPromoterCTA').click()
        cy.get('#qa-standard-form').should("exist")
        cy.get(consumption.common.closeModalButton).should("exist").click()
        cy.wait(100)
        cy.get('#endPromoterCTA').should("exist")
    })

    it("Validate end promoter when type is set to link", () => {
        authoring.common.login()
        authoring.target.visit()
        authoring.target.configure(targetwithLinkPromoter)
        cy.visit(explore.url)
        cy.contains('div', "Website Common Resource").click()
        // verify endPromoter Exist and clicking on it will redirect to correct link
        cy.get('#endPromoterCTA').click()
        cy.window().then(win => win.location.href = targetwithLinkPromoter.endPromoterOptions1.link);
             cy.url().should('contain', targetwithLinkPromoter.endPromoterOptions1.link)
    })

    it("Validate end promoter when type is set to cta", () => {
        authoring.common.login()
        authoring.target.visit()
        authoring.target.configure(targetwithCtaPromoter)
        cy.visit(explore.url)
        cy.contains('div', "Website Common Resource").click()
        // verify endPromoter Exist and clicking on it will open cta form and once submitted it will close the form but endPromoter still exist
        cy.get('#endPromoterCTA').click()
        cy.get(consumption.common.standardForm.emailInput).type(email + "\n")  
        cy.reload()
        cy.get('#endPromoterCTA').should("exist")
    })
})