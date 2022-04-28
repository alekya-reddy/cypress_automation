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

const event2 = {
    name: 'vexSearchDirective2.js',
    slug: 'vexSearchDirective2-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
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
    pageTitle:"Landing page title override",
    pageDescription:"Landing page description override",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/bow-tie-businessman-fashion-man.jpg",
    },
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
        },
        {
            type: "Session Group",
            sessionGroup: "All Sessions"
        }
    ]}

    const sessions = [
        {
            name: "On-demand",
            slug: "on-demand",
            get url() {
                return `${event.url}/${this.slug}`
            },
            visibility: 'Public',
            type: 'On Demand',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            override:{
                pageTitle:"Session Page title override",
                maximumChars:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisetr",//more than 255 chars
                pageDescription:"Session Page title description",
            },
            thumbnail: {
                category: "Stock Images",
                url: "/stock/sm/animal-dog-pet-cute.jpg",
            }
        }
    ]


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
                authoring.vex.addVirtualEvent(event)
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
        cy.wait(5000)
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
        cy.wait(7000)
        // Verifying canonical URL of VEX
        cy.get('link[rel="canonical"]').should("have.attr", "href", event.url);
        //VEX landing page: include SEO configuration, og and twitter fields [We can verify SEO configurations with any SED values]
        cy.get('meta[property="og:site_name"]').should("have.attr", "content", "automation-vex");
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://cdn.qa-pathfactory.com/images/default.png"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://cdn.qa-pathfactory.com/images/default.png"); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", "Virtual Event"); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", "Virtual Event");
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576");  
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.name);  
        cy.get('meta[name="description"]').should("have.attr", "content", "Virtual Event"); 
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
        authoring.vex.addVirtualEvent(event1)
        cy.wait(5000)
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.common.antSelectItem).should('have.contain', "Index, Follow")
        }) 
    })

    it("Verify Meta Description, Meta Title and Meta Image for VEX Session page, VEX landing page", () => {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2)
        authoring.vex.configureEvent(event2)
        sessions.forEach((session) => {
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event2.name)
        })

        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.editLandingPage(landingPage)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[1])
        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event2.url)
        cy.wait(5000) // This wait is needed for to update the meta data values in DOM
        //Verify the landing page title,description and Image
        cy.get("meta[property='og:title']").invoke('attr','content').then(value=>{
            expect(value).to.contains(landingPage.pageTitle)
        })

        cy.get("meta[property='og:description']").invoke('attr','content').then(value=>{
            expect(value).to.contains(landingPage.pageDescription)
        })

        cy.get("meta[property='og:image']").invoke('attr','content').then(value=>{
            expect(value).to.contains(landingPage.thumbnail.url)
        })
        cy.wait(2000) // This wait is needed for to update the meta data values in DOM
        cy.contains('div', sessions[0].name).should('be.visible', { timeout: 10000 }).click()

        cy.reload()
        cy.wait(3000) // This wait is needed for to update the meta data values in DOM
        //Verify the Session page title,description and Image
        cy.get("meta[property='og:title']").invoke('attr','content').then(value=>{
            expect(value).to.contains(sessions[0].override.pageTitle)
        })

        cy.get("meta[property='og:description']").invoke('attr','content').then(value=>{
            expect(value).to.contains(sessions[0].override.pageDescription)
        })

        cy.get("meta[property='og:image']").invoke('attr','content').then(value=>{
            expect(value).to.contains(sessions[0].thumbnail.url)
        })
    })
})
