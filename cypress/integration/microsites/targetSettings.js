import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const tracks = {
    config1: {
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
        name: "targetSettings.js 1",
        slug: "target-config-1",
        contents: [webContent.title, youtubeContent.title],
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        endPromoter: "on",
        endPromoterOptions: {
            link: "https://www.google.com"
        },
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "on",
                dismissable: "on"
            }
        }
    },
    config2: {
        // Testing signposts, exit and header promoters
        name: "targetSettings.js 2",
        slug: "target-config-2",
        contents: [webContent.title, youtubeContent.title],
        signposts: "on",
        exit: "on",
        exitOptions: {
            delay: "0"
        },
        header: "on"
    },
    config3: {
        // Testing bottombar promoter
        name: "targetSettings.js 3",
        slug: "target-config-3",
        contents: [webContent.title],
        bottombar: "on",
        header: "on"
    }
}

const microsite = {
    name: "targetSettings.js",
    slug: "targetsettings-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const microsite2 = {
    name: "captionsTarget.js",
    slug: "captionstarget-js",
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
        },
        {
            type: "track",
            track: tracks.config3.name
        }
    ]
}

const captionsTracks = {
    config1: {
        name: "targetSettingscaptions.js",
        slug: "target-config-captions",
        contents: ["How To Translate Your YouTube Video in to ANY Language!"],
        captionsLanguage: "French",
        captions:"on",
        index:"0"
    },
    config2: {
        name: "targetSettingscaptions2.js",
        slug: "target-config-captions2",
        contents: ["How To Translate Your YouTube Video in to ANY Language!"],
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
                    authoring.target.addTrack(track)
                    authoring.target.configure(track)
                })

                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                const allTracks = Object.values(tracks).map((track) => { return track.name })
                authoring.microsites.addTracks({target: allTracks})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit config 1 target track and verify flow and end promoters, and forms and ctas", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config1.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config1.slug}/${webContent.slug}`)

        // Verify the form strategy and then dismiss the form
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).click({force: true})
        })
        cy.contains(consumption.target.modal, "Fill This Out to Continue").should("not.be.visible")

        // Click the cta and verify it pops up, then dismiss it 
        cy.get(consumption.target.flowHeader).within(() => {
            cy.get(consumption.target.ctaButton).click()
        })
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).click({force: true})
        })

        // Microsite navigation header should always be visible even though no header configured for the track
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", microsite.url)
        })

        // Verify flow promoter 
        cy.get(consumption.target.flowSidebar).should("exist")

        // Click to last content to verify end promoter 
        cy.get(consumption.target.flowContent).should("exist").within(() => {
            cy.containsExact("span", youtubeContent.title).click()
        })
        cy.url().should("eq", `${microsite.url}/${tracks.config1.slug}/${youtubeContent.slug}`)

        // https://lookbookhq.atlassian.net/browse/DEV-12066 - end promoter not showing up 
    })

    it("Visit config 2 target track and verify signposts, exit and header promoters", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config2.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config2.slug}/${webContent.slug}`)

        // Verify signpost promoter 
        cy.get(consumption.target.signpostContainer).should("exist")

        // Verify header promoter
        cy.get(consumption.target.header.locator).should("not.exist") // The track's header is no longer used 
        cy.get(consumption.microsites.navigation.header).should("exist") // The microsite navigation header is used instead 
        cy.get(consumption.target.header.facebookIcon).should("exist") // But the track's sharing icons should still be present 

        // Trigger exit promoter and verify it exists
        cy.wait(2000)
        cy.get("body").trigger("mouseleave")
        cy.contains(consumption.target.endPromoterTitle, "Before you go...").should("exist")
    })

    it("Visit config 3 target track and verify bottombar promoter", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config3.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config3.slug}/${webContent.slug}`)

        // Verify the bottombar promoter
        cy.get(consumption.target.bottombarTitle).should("exist")
    })

    it("Visit the target track of microsite which has subtitle enabled and disabled", () => {
        authoring.common.login()

         //Captions off from target track and checking in microsite consumption
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.target.visit()
        authoring.target.deleteTrack(captionsTracks.config2.name)
        authoring.target.addTrack(captionsTracks.config2)
        authoring.target.configure(captionsTracks.config2)
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.setup(microsite2)
        authoring.microsites.addTracks({target:captionsTracks.config2.name})
        authoring.microsites.configureLandingPage(homePage2)
        cy.visit(homePage.url)
        cy.contains(consumption.microsites.cardTitle,captionsTracks.config2.contents[0],{timeout:20000}).click()
        cy.waitForIframeToLoad(consumption.microsites.youtube.iframe, consumption.microsites.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.microsites.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
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
        authoring.target.visit()
        authoring.target.deleteTrack(captionsTracks.config1.name)
        authoring.target.addTrack(captionsTracks.config1)
        authoring.target.configure(captionsTracks.config1)
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.setup(microsite2)
        authoring.microsites.addTracks({target:captionsTracks.config1.name})
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
                cy.contains("Hindi").click()
                cy.contains(consumption.microsites.youtube.menuContent,"Hindi").should('be.visible',{timeout:10000})
            })
        })

    })
})