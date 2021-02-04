import { createAuthoringInstance, createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: 'cloneMicrosite.js',
    slug: 'clonemicrosite-js',
    appearance: 'cloneMicrosite.js',
    externalCode: "clone cloneMicrosite.js",
    accessProtection: {
        type: "None",
        groups: ""
    },
    disallowGroups: "Default",
    searchEngineDirective: "No Index, Follow",
    cookieConsent: true,
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const clonedAllMicrosite = {
    name: "Clone of cloneMicrosite.js",
    slug: "clone-all",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const clonedTracksAndNavigation = {
    name: "Clone Tracks and Navigation cloneMicrosite.js",
    slug: "clone-tracks-nav",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const clonedLandingPagesAndNavigation = {
    name: "Clone Landing Page and Navigation cloneMicrosite.js",
    slug: "clone-lp-nav",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const clonedTracksAndLandingPages = {
    name: "Clone Tracks and Landing Pages cloneMicrosite.js",
    slug: "clone-tracks-lp",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const defaultLandingPage = {
    name: "landing Page Home Page",
    visibility: "Public",
    slug: "landing-page-home-pa",
    get url(){
        return `${microsite.url}/${this.slug}`
    }
}
const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name,
            expectContents: target.contents,
            searchConfiguration: {
                enableToggle: true,
                textColor: {r: "87", g: "255", b: "78", position: 0},
                backgroundColor: {r: "43", g: "91", b: "200", position: 1}
            }
        },
        {
            id: "Recommend Block",
            type: "track",
            track: recommend.name,
            titleOverride: `Overrided title`,
            expectContents: recommend.contents,
            heading: {
                color: {r: "0", g: "255", b: "255"},
                textAlign: 'center'
            },
            spacing: "91px",
            card: {
                color: {r: "43", g: "91", b: "200"},
                textAlign: "right",
                fontSize: "17px"
            },
            searchConfiguration: {
                enableToggle: true,
                textColor: {r: "87", g: "255", b: "78", position: 0},
                backgroundColor: {r: "43", g: "91", b: "200", position: 1}
            }
        }
    ]
}

const navigations = [ 
    {
        label: "navigation_clone_Microsite.js",
        type: "Track",
        source: target.name
    },
    {
        label: "navigation_Link_clone_Microsite.js",
        type: "Link",
        source: "www.google.com"
    }
]

const verifyMicrositeSetup = (microsite) => {
    cy.get(authoring.microsites.setupPage.nameInput).should("have.value", clonedAllMicrosite.name)
    cy.get(authoring.microsites.setupPage.slugInput).should("not.have.value", microsite.slug) // the slug should not be cloned
    cy.contains(authoring.microsites.antRow, "Appearance").should("contain", microsite.appearance) // appearance
    cy.contains(authoring.microsites.antRow, "External Codes").should("contain", microsite.externalCode) // external code
    cy.contains(authoring.microsites.antRow, "Protection Type").should("contain", microsite.accessProtection.type) // protection type
    cy.contains(authoring.microsites.antRow, "Access Protection").should("contain", microsite.accessProtection.groups) // access protection
    cy.contains(authoring.microsites.antRow, "Disallow Groups").should("contain", microsite.disallowGroups) // disallow
    cy.contains(authoring.microsites.antRow, "Search Engine Directive").should("contain", microsite.searchEngineDirective) //search  engine directive

    // Cookie consent
    if(microsite.cookieConsent == false){
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            expect(attr).not.to.include("ant-checkbox-checked")
        }) 
    }
    if(microsite.cookieConsent == true){
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            expect(attr).to.include("ant-checkbox-checked")
        }) 
    }
}

const verifyNavigation =(navigation) => {
    cy.containsExact(authoring.microsites.navigation.navTitle, navigation.label).should('exist').parent().within(()=>{
        if(navigation.type == "Link" && microsite.newTab){
            cy.containsExact(authoring.microsites.navigation.navSubtitle, `${navigation.type}: ${navigation.source} (new tab)`).should('exist')
        } else {
            cy.containsExact(authoring.microsites.navigation.navSubtitle, `${navigation.type}: ${navigation.source}`).should('exist')
        }
    })
}


describe("Microsite - Clone Microsite, Tracks, Landing Page, Navigation", ()=>{
    it("Set up if not already done", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
                // Add a new landing page and fully configure it with landing page blocks. Set this page as home page.
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
                navigations.forEach((navigation) => {
                    authoring.microsites.addNavItem(navigation)
                })
            }
        })
    })

    it("Clone everything within the microsite", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(clonedAllMicrosite.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.cloneMicrosite({
            name: clonedAllMicrosite.name,
            micrositeSetup: true,
            tracks: true,
            landingPages: true,
            navigation: true
        })
        
        // Verify cloned Microsite Setup
        verifyMicrositeSetup(microsite)

        // Change slug in order to test consumption later
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(clonedAllMicrosite.slug)
        cy.contains('button', 'Save').click()

        // Verify Tracks
        authoring.microsites.verifyTracks({target: target.name, recommend: recommend.name})
        
        // Verify Navigation tab
        authoring.microsites.tabToNavigation()
        navigations.forEach((navigation) => {
            verifyNavigation(navigation)
        })
        
        // Verify cloned Landing pages
        authoring.microsites.tabToLandingPages()
        // Verify there are two Landing Pages
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        cy.containsExact(authoring.microsites.antTable.cell, landingPage.name, {timeout: 10000}).should("exist")
        authoring.microsites.goToPageEditor(landingPage.name)
        landingPage.blocks.forEach((block) => {
            authoring.microsites.verifyBlock(block)
        })

        // Verify consumption
        cy.visit(clonedAllMicrosite.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })
        // Verify navigation 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.contains("a", "navigation_clone_Microsite.js").eq(0).should("exist")
            cy.get("a").eq(1).should("have.attr", "href", "www.google.com")
        })
    })

    it("Clone only Tracks and Navigation", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(clonedTracksAndNavigation.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.cloneMicrosite({
            name: clonedTracksAndNavigation.name,
            micrositeSetup: false,
            tracks: true,
            landingPages: false,
            navigation: true
        })

        // Verify that Microsite Setup was not cloned
        cy.get(authoring.microsites.setupPage.nameInput).should("have.value", clonedTracksAndNavigation.name)
        cy.get(authoring.microsites.setupPage.slugInput).should("not.have.value", microsite.slug)
        cy.contains(authoring.microsites.antRow, "Appearance").should("not.contain", microsite.appearance) // appearance
        cy.contains(authoring.microsites.antRow, "External Codes").should("not.contain", microsite.externalCode) // external code
        cy.contains(authoring.microsites.antRow, "Disallow Groups").should("not.contain", microsite.disallowGroups) // disallow
        // Cookie consent should be unchecked
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            expect(attr).not.to.include("ant-checkbox-checked")
        }) 

        // Change slug in order to test consumption later
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(clonedTracksAndNavigation.slug)
        cy.contains('button', 'Save').click()

        // Verify that Tracks was cloned
        authoring.microsites.verifyTracks({target: target.name, recommend: recommend.name})
        
        // Verify that Navigation was cloned
        authoring.microsites.tabToNavigation()
        navigations.forEach((navigation) => {
            verifyNavigation(navigation)
        })

        // Verify that Landing pages are not cloned
        // Every new microsite has a default landing page with these settings: 
        authoring.microsites.tabToLandingPages()
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        .parents(authoring.microsites.antTable.row).within(() => {
            cy.get(authoring.microsites.antTable.cell).eq(5).should("contain", "Home Page").should("not.contain", "Set as Home Page")
            cy.contains("button", "Remove").should("not.exist") // Any landing page that is set to home page cannot be removed 
        })
        authoring.microsites.goToPageEditor(defaultLandingPage.name)
        cy.get(authoring.microsites.landingPages.micrositeCardTitle).should("not.exist")

        cy.visit(clonedTracksAndNavigation.url)
        cy.get(consumption.cardTitle).should("not.exist")
        // Verify navigation 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.contains("a", "navigation_clone_Microsite.js").eq(0).should("exist")
            cy.get("a").eq(1).should("have.attr", "href", "www.google.com")
        })

    })

    it("Clone only Landing Page and Navigation", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(clonedLandingPagesAndNavigation.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.cloneMicrosite({
            name: clonedLandingPagesAndNavigation.name,
            micrositeSetup: false,
            tracks: false,
            landingPages: true,
            navigation: true
        })

        // Verify that Microsite Setup was not cloned
        cy.get(authoring.microsites.setupPage.nameInput).should("have.value", clonedLandingPagesAndNavigation.name)
        cy.get(authoring.microsites.setupPage.slugInput).should("not.have.value", microsite.slug)
        cy.contains(authoring.microsites.antRow, "Appearance").should("not.contain", microsite.appearance) // appearance
        cy.contains(authoring.microsites.antRow, "External Codes").should("not.contain", microsite.externalCode) // external code
        cy.contains(authoring.microsites.antRow, "Disallow Groups").should("not.contain", microsite.disallowGroups) // disallow
        // Cookie consent should be unchecked
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            expect(attr).not.to.include("ant-checkbox-checked")
        }) 

        // Change slug in order to test consumption later
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(clonedLandingPagesAndNavigation.slug)
        cy.contains('button', 'Save').click()

        // Verify that Tracks was not cloned
        authoring.microsites.tabToTracks()
        cy.get(authoring.microsites.tracks.emptyTracksTabImage).should("exist")

        // Verify that only Link exists in Navigation because we didn't clone Tracks
        authoring.microsites.tabToNavigation()
        cy.containsExact(authoring.microsites.navigation.navSubtitle, "Link: www.google.com").should('exist')
        cy.containsExact(authoring.microsites.navigation.navSubtitle, `Track: ${target.name}`).should('not.exist')

        // Verify that Landing Pages are cloned
        authoring.microsites.tabToLandingPages()
        // Verify there are two Lnding Pages
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        cy.containsExact(authoring.microsites.antTable.cell, landingPage.name, {timeout: 10000}).should("exist")
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.get(authoring.microsites.landingPages.micrositeCardTitle).should("not.exist")
        
        // Check consumption
        cy.visit(clonedLandingPagesAndNavigation.url)
        cy.get(consumption.cardTitle).should("not.exist")
        // navigation link should be there
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", "www.google.com")
            // navigation track should not be there
            cy.contains("a", "navigation_clone_Microsite.js").should("not.exist")
        })
    })

    it("Clone only Track and Landing Page", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(clonedTracksAndLandingPages.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.cloneMicrosite({
            name: clonedTracksAndLandingPages.name,
            micrositeSetup: false,
            tracks: true,
            landingPages: true,
            navigations: false
        })

        // Verify that Microsite Setup was not cloned
        cy.get(authoring.microsites.setupPage.nameInput).should("have.value", clonedTracksAndLandingPages.name)
        cy.get(authoring.microsites.setupPage.slugInput).should("not.have.value", microsite.slug)
        cy.contains(authoring.microsites.antRow, "Appearance").should("not.contain", microsite.appearance) // appearance
        cy.contains(authoring.microsites.antRow, "External Codes").should("not.contain", microsite.externalCode) // external code
        cy.contains(authoring.microsites.antRow, "Disallow Groups").should("not.contain", microsite.disallowGroups) // disallow
        // Cookie consent should be unchecked
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            expect(attr).not.to.include("ant-checkbox-checked")
        }) 

        // Change slug in order to test consumption later
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(clonedTracksAndLandingPages.slug)
        cy.contains('button', 'Save').click()

        // Verify that Tracks was cloned
        authoring.microsites.verifyTracks({target: target.name, recommend: recommend.name})

        // Verify that Navigation was not cloned
        authoring.microsites.tabToNavigation()
        cy.containsExact(authoring.microsites.navigation.navSubtitle, "Link: www.google.com").should('not.exist')
        cy.containsExact(authoring.microsites.navigation.navSubtitle, `Track: ${target.name}`).should('not.exist')

        // Verify cloned Landing pages
        authoring.microsites.tabToLandingPages()
        // Verify there are two Landing Pages
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        cy.containsExact(authoring.microsites.antTable.cell, landingPage.name, {timeout: 10000}).should("exist")
        authoring.microsites.goToPageEditor(landingPage.name)
        landingPage.blocks.forEach((block) => {
            authoring.microsites.verifyBlock(block)
        })

        // Verify consumption
        cy.visit(clonedTracksAndLandingPages.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })
        cy.contains(authoring.microsites.navigation.navSubtitle).should("not.exist")
    })
})
