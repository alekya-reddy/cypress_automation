import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const tracks = {
    config1: {
        // Testing sidebar promoter, header promoter, cta forms, form strategy 
        name: "recommendSettings.js 1",
        slug: "recommend-config-1",
        contents: [webContent.title],
        sidebar: "on",
        sidebarOptions: { cta: "Shared Resource Email Only" },
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "on",
                dismissable: "on"
            }
        },
        header: "on"
    },
    config2: {
        // Testing topic sidebar and exit promoters
        name: "recommendSettings.js 2",
        slug: "recommend-config-2",
        contents: [webContent.title],
        topicSidebar: "on"
    }
}

const microsite = {
    name: "recommendSettings.js",
    slug: "recommendsettings-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}


const microsite2 = {
    name: "captionsRecommend.js",
    slug: "captionsrecommend-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
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
            track: tracks.config1.name
        },
        {
            type: "track",
            track: tracks.config2.name
        }
    ]
}

const captionsTracks = {
    config1: {
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
        name: "recommendSettingscaptions.js",
        slug: "recommend-config-captions",
        contents: ["Oracle Cloud captions"],
        captionsLanguage: "German",
        captions:"on",
        index:"0"
    },
    config2: {
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
        name: "recommendSettingscaptions2.js",
        slug: "recommend-config-captions2",
        contents: ["Oracle Cloud captions"],
        captions:"off",
        index:"0",
        verify:false
    }
}

const homePage = {
    name: "Home Page",
    slug: "home-page",
    get url(){
        return `${microsite2.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "track",
            track: captionsTracks.config1.name
        }
    ]
}

const homePage2 = {
    name: "Home Page",
    slug: "home-page",
    get url(){
        return `${microsite2.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "track",
            track: captionsTracks.config2.name
        }
    ]
}
describe("Microsites - Target Settings", () => {
    it("Setup Microsite and target tracks if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()

                Object.values(tracks).forEach(track => {
                    authoring.recommend.addTrack(track)
                    authoring.recommend.configure(track)
                })

                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                const allTracks = Object.values(tracks).map((track) => { return track.name })
                authoring.microsites.addTracks({recommend: allTracks})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit config 1 recommend track and verify sidebar, header, exit promoters, and forms and ctas", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config1.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config1.slug}/${webContent.slug}`)

        // Verify the form strategy and then dismiss the form
        cy.contains(consumption.recommend.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.recommend.closeModalButton).click({force: true})
        })
        cy.contains(consumption.recommend.modal, "Fill This Out to Continue").should("not.be.visible")

        // Verify the sidebar promoter then click the cta and verify it pops up, then dismiss it 
        cy.get(consumption.recommend.sidebar).should('exist').within(() => {
            cy.get(consumption.recommend.ctaButton).click()
        })
        cy.contains(consumption.recommend.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.recommend.closeModalButton).click({force: true})
        })

        // Microsite navigation header should be visible, as well as sharing icons of the track header 
        cy.get(consumption.recommend.header.locator).should("not.exist") 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", microsite.url)
        })
        cy.get(consumption.target.header.facebookIcon).should("exist") 
    })

    it("Visit config 2 recommend track and verify topic sidebar", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config2.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config2.slug}/${webContent.slug}`)

        // Verify topic sidebar
        cy.get(consumption.recommend.topicSidebarDropdown).should("exist")

        // Verify microsites header navigation 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", microsite.url)
        })
    })

    it("Visit the recommend track of microsite which has subtitle enabled and disabled", () => {
        authoring.common.login()

         //Captions off from target track and checking in microsite consumption
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config2.name)
        authoring.recommend.addTrack(captionsTracks.config2)
        authoring.recommend.configure(captionsTracks.config2)
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.setup(microsite2)
        authoring.microsites.addTracks({recommend:captionsTracks.config2.name})
        authoring.microsites.configureLandingPage(homePage2)
        cy.visit(homePage.url)
        cy.contains(consumption.microsites.cardTitle,captionsTracks.config2.contents[0],{timeout:20000}).click()
        cy.waitForIframeToLoad(consumption.microsites.youtube.iframe, consumption.microsites.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.microsites.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then((controllers)=>{
                cy.get(consumption.microsites.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.microsites.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.wait(1000)
                cy.contains("div.ytp-menuitem-label","Subtitles/CC").parents("div.ytp-menuitem").find(consumption.microsites.youtube.menuContent).invoke('text').then(text=>{
                    if(text.includes("Off")){
                        cy.contains(consumption.microsites.youtube.menuContent,"Off").should('be.visible',{timeout:10000})
                    }
                    else
                    {
                        cy.contains(consumption.microsites.youtube.menuContent,"English").should('be.visible',{timeout:10000})
                    }
                })
            })
        })


        //Captions on from target track and checking in microsite consumption
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config1.name)
        authoring.recommend.addTrack(captionsTracks.config1)
        authoring.recommend.configure(captionsTracks.config1)
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.setup(microsite2)
        authoring.microsites.addTracks({recommend:captionsTracks.config1.name})
        authoring.microsites.configureLandingPage(homePage)
        cy.visit(homePage.url)
        cy.contains(consumption.microsites.cardTitle,captionsTracks.config1.contents[0],{timeout:20000}).click()
        cy.waitForIframeToLoad(consumption.microsites.youtube.iframe, consumption.microsites.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.microsites.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
                cy.get(consumption.microsites.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.microsites.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.contains(consumption.microsites.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000})
                cy.contains(consumption.microsites.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000}).click()
                cy.contains("Spanish").click()
                cy.contains(consumption.microsites.youtube.menuContent,"Spanish").should('be.visible',{timeout:10000})
            })
        })

    })
})