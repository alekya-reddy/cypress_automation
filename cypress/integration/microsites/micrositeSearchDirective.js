import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "micrositeSearchDirective.js",
    slug: "micrositesearchdirective-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: "micrositeSearchDirective.js"
}
const microsite1 = {
    name: "micrositeSearchDirective1.js",
}

const microsite2 = {
    name: "micrositeSearchDirective2.js",
    slug: "micrositesearchdirective2-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const newAppearanceSetting = {
    name:"micrositeSearchDirective.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 100},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 100},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 100}
}

const headerAppearance = {
    appearance: "micrositeSearchDirective.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
   
}

const target = {
    name: "Target 2 Shared Resource",
    slug: "target-2-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-1 Shared Resource", "Wiki-2 Shared Resource", "Wiki-3 Shared Resource","Wiki-4 Shared Resource","Wiki-5 Shared Resource","Wiki-6 Shared Resource"]
}

const target2 = {
    name: "TestTargetCanoinicalOverride",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-7 Shared Resource"],
    searchEngineDirective:"Index, Follow"
}

const target3 = {
    name: "TestTargetCanoinicalOverride",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-7 Shared Resource"],
    searchEngineDirective:"Canonical URL of Track",
    canonical_override:'www.canonicalOverrride123.com'
}

const recommend = {
    name: "TestRecommendCanoinicalOverride",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-6 Shared Resource"],
    searchEngineDirective:"Index, Follow"
}

const recommend2 = {
    name: "TestRecommendCanoinicalOverride",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-6 Shared Resource"],
    searchEngineDirective:"Canonical URL of Track",
    canonical_override:'www.canonicalOverrride123.com'
}


const landingPage = {
    name: "Main Page",
    slug: "main-page",
    description: "Main Page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            titleOverride: "Track Grid",
            layout: "Grid",
            expectContents: target.contents
        },
    ]}
    
    const landingPage2 = {
        name: "Main Page",
        slug: "main-page",
        description: "Main Page",
        get url(){
            return `${microsite.url}/${this.slug}`
        },
        visibility: 'Public',
        setHome: true,
        blocks: [
            {
                id: "Target Block Grid",
                type: "track",
                track: target2.name,
                titleOverride: "Target Track Grid",
                layout: "Grid",
                expectContents: target2.contents
            },
            {
                id: "Recommened Block Grid",
                type: "track",
                track: recommend.name,
                titleOverride: "Recommend Track Grid",
                layout: "Grid",
                expectContents: recommend.contents
            },
        ]}

describe("Microsites - Search Engine Directive and SEO configurations Validations", () => {

    it("Set up Appearance and Microsites if doesn't exist", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.configurations.deleteAppearance(newAppearanceSetting.name)
                authoring.configurations.addNewAppearance(newAppearanceSetting)
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.microsites.removeMicrosite(microsite.name)
                authoring.microsites.addMicrosite(microsite)  
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: target.name})
                authoring.microsites.tabToLandingPages()
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.editLandingPage(landingPage)
                authoring.microsites.configureLandingPage(landingPage)
            }
        }) 
    }) 
    it("Microsite : Search Engine fields and SEO configurations validation in consumption page", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        // Validations for search Engine Directive drop down field values
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(`div[label='${"Canonical URL of Microsite"}']`).should('exist')
        cy.get(`div[label='${"Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"Index, No follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, No Follow"}']`).should('exist')
        // When a canonical URL of Microiste is selected for the microsite, should show the respective URL of the microsite home page/landing page or the microsite track URL in the page source.
        cy.get(authoring.common.antDropSelect.options("Canonical URL of Microsite")).click()
        cy.get(`span[title='${"Canonical URL of Microsite"}']`).should('exist')
        cy.contains('button', 'Save').click({force:true})
        cy.wait(2000)
        cy.visit(landingPage.url)
        // Verifying canonical URL of microsite
        cy.get('link[rel="canonical"]').should("have.attr", "href", landingPage.url);

        //When no index values are selected for the microsite, show the respective meta tag with robots in the page source.
        //Back in authoring,to modify the 'Search Engine Directive' field value
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        // Set field value to "No Index, Follow" and verify in consumption page
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(authoring.common.antDropSelect.options("No Index, Follow")).click()
        cy.get(`span[title='${"No Index, Follow"}']`).should('exist')
        cy.wait(3000)
        cy.contains('button', 'Save').click()
        cy.wait(3000)
        cy.visit(landingPage.url)
        cy.wait(3000)
        cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, follow");

         // Set field value to "No Index, Follow" and verify in consumption page
         // Microsites landing page: include SEO configuration, og and twitter fields [We can verify SEO configurations with any SED values]
         authoring.microsites.visit()
         authoring.microsites.goToMicrositeConfig(microsite.name)
         cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(authoring.common.antDropSelect.options("No Index, No Follow")).click()
        cy.get(`span[title='${"No Index, No Follow"}']`).should('exist')
        cy.wait(4000)
        cy.contains('button', 'Save').click()
        cy.visit(landingPage.url)
        cy.wait(5000)
        cy.reload()
        cy.get('meta[name="robots"]',{timeout:20000}).should("have.attr", "content", "noindex, nofollow");
        cy.get('meta[property="og:site_name"]').should("have.attr", "content", "automation-microsites");
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.name);
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576");  
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.name);  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.description); 
        cy.get('meta[name="twitter:site"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:creator"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingPage.name);

    })
    // ##https://lookbookhq.atlassian.net/browse/DEV-12556 (Taking any one field and validating)
    // Not adding this microsite(microsite1)creation in common method because whatever search engine value admin sets will only reflect in new microsite not the existing/already created ones.
    it('Microsite: Allow admins to set default search engine directive setting', () => {
        authoring.common.login()
        cy.visit(authoring.settings.searchEngineDirective.pageUrl)
        cy.get(authoring.common.dropdown.box).eq(2).click()
        cy.get(authoring.common.dropdown.option("Index, Follow")).click()
        cy.contains("button", "Save").click()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite1.name)
        authoring.microsites.addMicrosite(microsite1) 
        authoring.microsites.goToMicrositeConfig(microsite1.name)
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.common.antSelectItem).should('have.contain', "Index, Follow")
        }) 
    })

    it('Add the ability to override canonical URLs for assets in content tracks', () => {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.target.deleteTrack(target2.name)
        authoring.target.addTrack(target2)
        authoring.target.configure(target2)
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        authoring.microsites.addMicrosite(microsite2)  
        authoring.microsites.setup(microsite2)
        authoring.microsites.addTracks({target: target2.name})
        authoring.microsites.addTracks({recommend: recommend.name})
        authoring.microsites.tabToLandingPages()
        authoring.microsites.addLandingPages(landingPage2.name)
        authoring.microsites.editLandingPage(landingPage2)
        authoring.microsites.configureLandingPage(landingPage2)

        cy.visit(microsite2.url)
        cy.contains('div',target2.contents[0],{timeout:10000}).click()
        cy.waitForIframeToLoad("iframe", 10000)
        cy.getIframeHead("iframe").within(() => {
        cy.get("link[rel='canonical'][href='https://en.wikipedia.org/wiki/7']",{timeout:10000}).should('exist');
        })
        cy.go('back')

        cy.wait(3000)
        cy.contains('div',recommend.contents[0],{timeout:10000}).click()
        cy.waitForIframeToLoad("iframe", 10000)
        cy.getIframeHead("iframe").within(() => {
        cy.get("link[rel='canonical'][href='https://en.wikipedia.org/wiki/6']",{timeout:10000}).should('exist');
        })
        cy.go('back')
        
        authoring.target.visit()
        authoring.target.goToTrack(target3.name)
        authoring.target.selectSearchEngineDirective(target3.searchEngineDirective)
        authoring.target.setCanonicalOverrideUrl(target2.contents[0],target3.canonical_override)

        authoring.recommend.visit()
        authoring.recommend.goToTrack(recommend2.name)
        authoring.recommend.selectSearchEngineDirective(recommend2.searchEngineDirective)
        authoring.recommend.setCanonicalOverrideUrl(recommend2.contents[0],recommend2.canonical_override)
        
        cy.visit(microsite2.url)
        cy.contains('div',target2.contents[0],{timeout:10000}).click()
        cy.get(`link[rel='canonical'][href='${target3.canonical_override}']`,{timeout:10000}).should('exist');
        cy.go('back')

        cy.wait(3000)
        cy.contains('div',recommend.contents[0],{timeout:10000}).click()
        cy.get(`link[rel='canonical'][href='${recommend2.canonical_override}']`,{timeout:10000}).should('exist');
    })
})
