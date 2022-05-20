import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-explore", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-explore', tld: 'lookbookhq' })

const captionsTracks = {
    config1: {
        name: "targetSettingscaptions.js",
        slug: "target-config-captions",
        contents: ["Oracle Cloud captions"],
        captionsLanguage: "German",
        captions: "on",
        index: "0",
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config2: {
        name: "targetSettingscaptions2.js",
        slug: "target-config-captions2",
        contents: ["Oracle Cloud captions"],
        captions: "off",
        index: "0",
        verify: false,
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config3: {
        name: "targetSettingscaptions3.js",
        slug: "target-config-captions3",
        contents: ["The New Vimeo Player - used in cypress"],
        captionsLanguage: "English",
        captions: "on",
        index: "0",
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config4: {
        name: "targetSettingscaptions4.js",
        slug: "target-config-captions4",
        contents: ["The New Vimeo Player - used in cypress"],
        captions: "off",
        index: "0",
        verify: false,
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
}

const explorePage = {
    name: 'explorecaptions.js',
    experienceType: 'Target',
    trackName: captionsTracks.config1.name,
    slug: 'explorecaptions-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const explorePage2 = {
    name: 'explorecaptions2.js',
    experienceType: 'Target',
    trackName: captionsTracks.config2.name,
    slug: 'explorecaptions2-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const explorePage3 = {
    name: 'explorecaptions3.js',
    experienceType: 'Target',
    trackName: captionsTracks.config3.name,
    slug: 'explorecaptions3-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const explorePage4 = {
    name: 'explorecaptions4.js',
    experienceType: 'Target',
    trackName: captionsTracks.config4.name,
    slug: 'explorecaptions4-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - Video captions", () => {
    it("Visit the explore page of track which has subtitle enabled and disabled for youtube video", () => {
        //Captions off from target track and checking in explore page consumption
         authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(explorePage2.name)
        authoring.target.deleteTrack(captionsTracks.config2.name)
        authoring.target.addTrack(captionsTracks.config2)
        authoring.target.configure(captionsTracks.config2)
        authoring.explore.addExplore(explorePage2)
        authoring.explore.configureExplore(explorePage2)
        cy.visit(explorePage2.url)
        cy.contains('div',captionsTracks.config2.contents[0]).click()

        cy.waitForIframeToLoad(consumption.explore.youtube.iframe, consumption.explore.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.explore.youtube.iframe).within(() => {
            cy.get("div.ytp-chrome-bottom").then(() => {
                cy.get(consumption.explore.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.explore.youtube.settings).should('be.visible', { timeout: 10000 }).click({ force: true })
                cy.wait(1000)
                cy.contains("div.ytp-menuitem-label", "Subtitles/CC").parents("div.ytp-menuitem").find(consumption.target.youtube.menuContent).invoke('text').then(text => {
                    if (text.includes("Off")) {
                        cy.contains(consumption.explore.youtube.menuContent, "Off").should('be.visible', { timeout: 10000 })
                    }
                    else {
                        cy.contains(consumption.explore.youtube.menuContent, "English").should('be.visible', { timeout: 10000 })
                    }
                })
            })
        })

        //Captions on from target track and checking in explore page consumption
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(explorePage.name)
        authoring.target.deleteTrack(captionsTracks.config1.name)
        authoring.target.addTrack(captionsTracks.config1)
        authoring.target.configure(captionsTracks.config1)
        authoring.explore.addExplore(explorePage)
        authoring.explore.configureExplore(explorePage)
        cy.visit(explorePage.url)
        cy.contains('div',captionsTracks.config1.contents[0]).click()

        cy.waitForIframeToLoad(consumption.explore.youtube.iframe, consumption.explore.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.explore.youtube.iframe).within(() => {
            cy.get("div.ytp-chrome-bottom").then(() => {
                cy.get(consumption.explore.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.explore.youtube.settings).should('be.visible', { timeout: 10000 }).click({ force: true })
                cy.contains(consumption.explore.youtube.menuContent, captionsTracks.config1.captionsLanguage).should('be.visible', { timeout: 10000 })
                cy.contains(consumption.explore.youtube.menuContent, captionsTracks.config1.captionsLanguage).should('be.visible', { timeout: 10000 }).click()
                cy.contains("Spanish").click()
                cy.contains(consumption.explore.youtube.menuContent, "Spanish").should('be.visible', { timeout: 10000 })
            })
        })
    })

    it("Visit the explore page of track which has subtitle enabled and disabled for Vimeo video", () => {
        //Captions off from target track and checking in explore page consumption
         authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(explorePage4.name)
        authoring.target.deleteTrack(captionsTracks.config4.name)
        authoring.target.addTrack(captionsTracks.config4)
        authoring.target.configure(captionsTracks.config4)
        authoring.explore.addExplore(explorePage4)
        authoring.explore.configureExplore(explorePage4)
        cy.visit(explorePage4.url)
        cy.contains('div',captionsTracks.config4.contents[0]).click()

        cy.waitForIframeToLoad(consumption.explore.vimeo.iframe, consumption.explore.vimeo.videoPlayer, 20000)
        cy.getIframeBody(consumption.explore.vimeo.iframe).within(() => {
            cy.get(consumption.explore.vimeo.videoPlayer).should('exist').trigger('mouseover',{force:true})
            cy.get(consumption.explore.vimeo.captions).should('be.visible', { timeout: 10000 }).click({ force: true })
            cy.wait(1000)
            cy.contains("div.vp-menu-option-label","None").parents("li[role='menuitemradio'][aria-checked='true']").should('exist')
        })

        //Captions on from target track and checking in explore page consumption
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(explorePage3.name)
        authoring.target.deleteTrack(captionsTracks.config3.name)
        authoring.target.addTrack(captionsTracks.config3)
        authoring.target.configure(captionsTracks.config3)
        authoring.explore.addExplore(explorePage3)
        authoring.explore.configureExplore(explorePage3)
        cy.visit(explorePage3.url)
        cy.contains('div',captionsTracks.config3.contents[0]).click()

        cy.waitForIframeToLoad(consumption.explore.vimeo.iframe, consumption.explore.vimeo.videoPlayer, 20000)
        cy.getIframeBody(consumption.explore.vimeo.iframe).within(() => {
            cy.get(consumption.explore.vimeo.videoPlayer).should('exist').trigger('mouseover',{force:true})
            cy.get(consumption.explore.vimeo.captions).should('be.visible', { timeout: 10000 }).click({ force: true })
            cy.wait(1000)
            cy.contains("div.vp-menu-option-label",captionsTracks.config3.captionsLanguage).parents("li[role='menuitemradio'][aria-checked='true']").should('exist')
        })

    })
})