import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
//For now, we need to execute this spec on automation org as this domain is configured to work with automation org along with other wtV2 specs in testing-scripts repo.
//Once all wtV2 scripts are migrated to cypress repo, we can point to automation-wt org accordingly
//const authoring = createAuthoringInstance({org: "automation-wt", tld: "lookbookhq"})
//const consumption = createConsumptionInstance({org: "automation-wt", tld: "lookbookhq"})
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance() // When nothing is specified, this defaults to our original 'automation' org
const domainName = "pathfactory-qa-wp.com"
const websitePath = "automation-analytics"
const contentpoolName = "Wordpress"
const formCTA = "formCTA_wt" 
const linkCTA = "linkCTA_wt"
const emailCTA = "emailCTA_wt"
const consumptionURL = "http://"+domainName+"/"+websitePath
describe("Configure and validate CTAs in Guide Promoter", () => {
    it("Configure and add form cta type in Guide Promoter", () => {
        authoring.common.login()
        authoring.websiteTools.visit()
        //Add a new website property
        cy.get(authoring.websiteTools.addProperty).click()
        cy.get(authoring.websiteTools.antModal).within(() => {
            cy.get(authoring.websiteTools.enterDomainName).type(domainName)
            cy.get(authoring.websiteTools.addProperty).click()
        })
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.contains("a","Add Website Path").click()
        cy.get(authoring.websiteTools.websitePath).type(websitePath)
        cy.contains("span","Guide").click()
        cy.get(authoring.websiteTools.enterselectOption('contentPool')).type(contentpoolName +"\n",{force: true})
        cy.get(authoring.websiteTools.enterselectOption('cta')).type(formCTA +"\n",{force: true})
        cy.get(authoring.websiteTools.promoterList).click()
        cy.get(authoring.websiteTools.selectOption("Guide")).click()
        cy.contains("span","Save").click()
    })
    it("Validate form cta type in Guide Promoter on consumption page", () => {
        consumption.websiteTools.modifyIframeBlockingCode()
        cy.visit(consumptionURL)
        cy.wait(4000)
        //cy.pause()
        cy.get(consumption.websiteTools.guidecta).click()
        cy.get(consumption.websiteTools.qaModal).should('exist')
    })
    it("Configure and add link cta type in Guide Promoter", () => {
        authoring.common.login()
        authoring.websiteTools.visit()
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.ifElementExists(authoring.websiteTools.websiteurlPath(domainName+"/"+websitePath), 5000, ()=>{
            cy.get(authoring.websiteTools.websiteurlPath(domainName+"/"+websitePath)).siblings("td:contains('Edit')").within(()=>{
                cy.contains('a', 'Edit').click()
            })
        })
        cy.get(authoring.websiteTools.enterselectOption('cta')).type(linkCTA +"\n",{force: true})
        cy.contains("span","Save").click()
    })
    it("Validate link cta type in Guide Promoter on consumption page", () => {
        consumption.websiteTools.modifyIframeBlockingCode()
        cy.visit(consumptionURL)
        cy.wait(4000)
        //As it is link cta, a new window which is opened cannot be verified in cypress, so verified the href attribute of guite cta link
        cy.get(consumption.websiteTools.guidecta).invoke("attr", "href").then((href)=>{
            expect(href).to.include('http://google.com')
        })
    })
    it("Configure and add email cta type in Guide Promoter", () => {
        authoring.common.login()
        authoring.websiteTools.visit()
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.ifElementExists(authoring.websiteTools.websiteurlPath(domainName+"/"+websitePath), 5000, ()=>{
            cy.get(authoring.websiteTools.websiteurlPath(domainName+"/"+websitePath)).siblings("td:contains('Edit')").within(()=>{
                cy.contains('a', 'Edit').click()
            })
        })
        cy.get(authoring.websiteTools.enterselectOption('cta')).type(emailCTA +"\n",{force: true})
        cy.contains("span","Save").click()
    })
    it("Validate email cta type in Guide Promoter on consumption page", () => {
        consumption.websiteTools.modifyIframeBlockingCode()
        cy.visit("http://pathfactory-qa-wp.com/automation-analytics/?lb-mode=preview")
        cy.wait(4000)
        //As it is email cta, a new email window is opened which cannot be verified in cypress, so verified the href attribute of guite cta link
        cy.get(consumption.websiteTools.guidecta).invoke("attr", "href").then((href)=>{
            expect(href).to.include('mailto:bobman3743345@gmail.com')
        })
    })
    it("Clean up", () => {
        authoring.common.login()
        authoring.websiteTools.visit()
        //Delete the website property
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Delete").click()
        })
        cy.contains(authoring.common.antModal, "Are you sure?").contains("button", "Delete").click()
    })
})