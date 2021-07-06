import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'dynamicFieldMerge.js',
    slug: 'dynamicfieldMergeVex',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const appearance = {
    appearance: "Default",
    headerTitle: "Header Title - {{company.name | default: default text}} {{visitor.email}}",
    headerSubtitle: "Header SubTitle - {{company.name | default: default text}}",
    contentTitle: "VEX Content Title - {{company.name | default: default text}}",
    contentDescription: "VEX Content Description - {{company.name | default: default text}}",
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${vex.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>{{company.name | default: default text}}</h1><h2>{{visitor.email}}</h2>`,
            className: "landingpageblock",
        }
    ]
}

const company = {
    ip: "76.9.217.70",
    name: "PathFactory",
    country: "Canada",
    city: "Toronto"
}

const nonCompany = {
    ip: "171.117.159.107",
}

const visitor = "test@gmail.com"


describe("VEX - Dynamic Field Merge", () => {
    it("Set up if not already done", () => {
         cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                cy.viewport(1500, 1000)
                authoring.common.login()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.configureAppearance(appearance)
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("Verify that dynamic field merge works", () => { 
        // Note: A field merge is a variable in the VEX (inside an html block). It could be any one of 6sense's datapoints 
        // about a visitor, such as company name, country etc. Depending on the data returned by 6sense, you will see the value 
        // of that variable displayed inside the html block. 
        cy.viewport(1500, 1000)
        authoring.common.login()
        // set landing page as Home page in authoring.
        // This is already done in set up however this is to make sure 'setHome' is always set to true as we change the value later  
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureLandingPage({
            name: landingPage.name,
            setHome: true,
        })

        // value in the field merge when visiting with spoofed pathfactory IP address
        cy.visit(event.url + `?lbhqip=${company.ip}&lb_email=${visitor}`)
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", company.name).should("exist")
            cy.contains("h2", visitor).should("exist")
        })

        // Verify that dynamic field merges are their default values when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(event.url + "?lbhqip=" + nonCompany.ip)
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", "default text").should("exist")
        })

         // Verify that if there is no known visitor, the email field would be blank
         cy.clearCookies()
         cy.visit(event.url)
         cy.get(`.${landingPage.blocks[0].className}`).within(() => {
             cy.get("h1").should("exist")
             cy.contains("h2", visitor).should("not.exist")
         }) 

        // Veify the merge fields in Vex Event appearance setting text fields
        // Unset landing page in authoring to see event appearance headers 
        authoring.common.login()
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureLandingPage({
            name: landingPage.name,
            unsetHome: true,
        })
        // value in the field merge when visiting with spoofed pathfactory IP address
        cy.visit(event.url + `?lbhqip=${company.ip}&lb_email=${visitor}`)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - PathFactory test@gmail.com", {timeout: 20000}).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, "Header SubTitle - PathFactory").should('exist')
        cy.contains(consumption.vex.eventContentTitle, "VEX Content Title - PathFactory").should('exist')
        cy.contains(consumption.vex.eventContentDescription, "VEX Content Description - PathFactory").should('exist')

        // Verify that dynamic field merges are their default values when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(event.url + "?lbhqip=" + nonCompany.ip)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - default text test@gmail.com", {timeout: 20000}).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, "Header SubTitle - default text").should('exist')
        cy.contains(consumption.vex.eventContentTitle, "VEX Content Title - default text").should('exist')
        cy.contains(consumption.vex.eventContentDescription, "VEX Content Description - default text").should('exist')

        // Verify that if there is no known visitor, the email field would be blank
        cy.clearCookies()
        cy.visit(event.url)
        cy.wait(5000)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - default text", {timeout: 20000}).should('exist')            
    })    
})    