import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: "vexSearchDirective.js",
    slug: "vexSearchDirective-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const event1 = {
    name: "vexSearchDirective1.js"
}


const headerAppearance = {
    appearance: "vexSearchDirective.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
   
}

const appearance = {
    appearance: "vexSearchDirective.js",
}

const newAppearanceSetting = {
    name:"vexSearchDirective.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 100},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 100},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 100}
}

const publicSession = {
    name: "public-session",
    slug: "public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
}
const sessionGroupA = {
    name: "Group A",
    sessions: [publicSession.name]
}

const landingPage = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
        },
    ]}


describe("VEX- Search Engine Directive and SEO configurations Validations", () => {

    it("Set up Appearance and VEX if doesn't exist", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.configurations.deleteAppearance(newAppearanceSetting.name)
                authoring.configurations.addNewAppearance(newAppearanceSetting)
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.vex.visit();
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.configureAppearance(appearance)
                authoring.vex.addSession(publicSession.name)
                authoring.vex.configureSession(publicSession)
                authoring.vex.backToEvent(event.name)
                authoring.vex.addSessionGroup(sessionGroupA.name)
                authoring.vex.addToGroup(sessionGroupA)
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.editLandingPage(landingPage)
                authoring.vex.setToHomePage(landingPage.name)
                authoring.vex.goToPageEditor(landingPage.name)
                authoring.vex.addAdvancedBlock(landingPage.blocks[0])
                cy.contains('button', 'Save').click(); 
            }
        }) 
    }) 
    it("VEX : Search Engine fields and SEO configurations validation in consumption page", ()=>{
        authoring.common.login()
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        // Validations for search Engine Directive drop down field values
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(`div[label='${"Canonical URL of VEX"}']`).should('exist')
        cy.get(`div[label='${"Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"Index, No follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, No Follow"}']`).should('exist')

        // When a canonical URL is selected for the VEX, should show the respective URL of the virtual event home page/landing page in the page source.
        cy.get(authoring.common.antDropSelect.options("Canonical URL of VEX")).click()
        cy.get(`span[title='${"Canonical URL of VEX"}']`).should('exist')
        cy.contains('button', 'Save').click()
        cy.visit(event.url)
        // Verifying canonical URL of VEX
        cy.get('link[rel="canonical"]').should("have.attr", "href", event.url);
        //VEX landing page: include SEO configuration, og and twitter fields [We can verify SEO configurations with any SED values]
        cy.get('meta[property="og:site_name"]').should("have.attr", "content", "automation-vex");
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.name);
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576");  
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.name);  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[name="twitter:site"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:creator"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingPage.name);
        cy.wait(1000)
        //When the session URL is rendered from the session, should have a session URL as a canonical URL(in automation it returns event URL) in the page source.
        cy.contains(consumption.vex.sessionCardTitle, publicSession.name).should('exist').click()
        cy.get('link[rel="canonical"]').should("have.attr", "href", event.url);
        //When any supplemental content URL is rendered from the server-side, should have a no_index and no_follow meta name robots the page source.
        cy.get(consumption.vex.supplementalContent).children("li").eq(0).click()
        //NOTE: In automation, "noindex, nofollow" doesn't display for supplemental content. But if you manually/ explicitily do 'View page source' it does return "noindex, nofollow".
        //cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, nofollow");
    })

    // ##https://lookbookhq.atlassian.net/browse/DEV-12556
    // Not adding this VEX (event1)creation in common method because whatever search engine value admin sets will only reflect in new microsite not the existing/already created ones.
    it('VEX: Allow admins to set default search engine directive setting', () => {
        authoring.common.login()
        cy.visit(authoring.settings.searchEngineDirective.pageUrl)
        cy.get(authoring.common.dropdown.box).eq(2).click()
        cy.get(authoring.common.dropdown.option("Index, Follow")).click()
        cy.contains("button", "Save").click()
        authoring.vex.visit() 
        authoring.vex.deleteVirtualEvent(event1.name)
        authoring.vex.addVirtualEvent(event1.name)
        authoring.vex.goToEventConfig(event1.name)
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.common.antSelectItem).should('have.contain', "Index, Follow")
        }) 
   

    })
})