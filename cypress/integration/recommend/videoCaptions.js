import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const captionsTracks = {
    config1: {
        name: "recommendSettingscaptions.js",
        slug: "recommend-config-captions",
        contents: ["Oracle Cloud captions"],
        captionsLanguage: "German",
        captions:"on",
        index:"0",
        get url(){
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config2: {
        name: "recommendSettingscaptions2.js",
        slug: "recommend-config-captions2",
        contents: ["Oracle Cloud captions"],
        captions:"off",
        index:"0",
        verify:false,
        get url(){
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config3: {
        name: "recommendSettingscaptions.js",
        cloneName: "recommendSettingscaptionsclone.js"
    },
    config4: {
        name: "recommendSettingscaptions3.js",
        slug: "recommendSettingscaptions3",
        contents: ["Brightcove - Used in Cypress automation to test VEX"],
        captionsLanguage: "Japanese",
        captions: "on",
        index: "0",
        get url(){
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config5: {
        name: "recommendSettingscaptions4.js",
        slug: "recommendSettingscaptions4",
        contents: ["Brightcove - Used in Cypress automation to test VEX"],
        captions: "off",
        index: "0",
        verify: false,
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config6: {
        name: "recommendSettingscaptions3.js",
        cloneName: "recommendSettingscaptionsclone3.js"
    },
    config7: {
        name: "recommendSettingscaptions4.js",
        cloneName: "recommendSettingscaptionsclone4.js"
    },
    config8: {
        name: "recommendSettingscaptions5.js",
        slug: "recommendSettingscaptions5",
        contents: ["Brightcove - Used in Cypress automation to test VEX"],
        captionsLanguage: "Polish",
        captions: "on",
        index: "0",
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config9: {
        name: "recommendSettingscaptions6.js",
        slug: "recommendSettingscaptions6",
        contents: ["Brightcove video with no subtitles"],
        captionsLanguage: "English",
        captions: "on",
        index: "0",
        verify: false,
        get url() {
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
}

describe("Target - Video captions", () => {
    it("Visit the recommend track which has subtitle enabled and disabled", () => {
         //Captions off from recommend track and checking in consumption
         authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config2.name)
        authoring.recommend.addTrack(captionsTracks.config2)
        authoring.recommend.configure(captionsTracks.config2)

        cy.visit(captionsTracks.config2.url+"/watch")
        cy.waitForIframeToLoad(consumption.recommend.youtube.iframe, consumption.recommend.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.recommend.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
                cy.get(consumption.recommend.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.recommend.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.wait(1000)
                cy.contains("div.ytp-menuitem-label","Subtitles/CC").parents("div.ytp-menuitem").find(consumption.target.youtube.menuContent).invoke('text').then(text=>{
                    if(text.includes("Off")){
                        cy.contains(consumption.recommend.youtube.menuContent,"Off").should('be.visible',{timeout:10000})
                    }
                    else
                    {
                        cy.contains(consumption.recommend.youtube.menuContent,"English").should('be.visible',{timeout:10000})
                    }
                })
            })
        })


        //Captions on from recommend track and checking in consumption
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config1.name)
        authoring.recommend.deleteTrack(captionsTracks.config3.cloneName)
        authoring.recommend.addTrack(captionsTracks.config1)
        authoring.recommend.configure(captionsTracks.config1)

        cy.visit(captionsTracks.config1.url+"/watch")

        cy.waitForIframeToLoad(consumption.recommend.youtube.iframe, consumption.target.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.recommend.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
                cy.get(consumption.recommend.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.recommend.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.contains(consumption.recommend.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000})
                cy.contains(consumption.recommend.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000}).click()
                cy.contains("Spanish").click()
                cy.contains(consumption.recommend.youtube.menuContent,"Spanish").should('be.visible',{timeout:10000})
            })
        })

        //Clone the recommend track and validate captions are cloned
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.configure(captionsTracks.config3)
        cy.get(`img[alt='${captionsTracks.config1.contents[0]}']`,{timeout:20000}).click()
        cy.get(authoring.recommend.pageSidebar.captions).invoke('css', 'background-color').then(val => {
            expect(val).to.equal('rgb(0, 169, 203)')
        })
        cy.get(authoring.recommend.pageSidebar.pagePreview).within(() => {
            cy.contains('label', 'Language').parent('div').find("span").should("contain", "German")
        })

        cy.contains('a', 'Preview').invoke('attr', 'href').then(link => {
            cy.visit(link)
        })

        cy.waitForIframeToLoad(consumption.recommend.youtube.iframe, consumption.recommend.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.recommend.youtube.iframe).within(() => {
            cy.get("div.ytp-chrome-bottom").then(() => {
                cy.get(consumption.recommend.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.recommend.youtube.settings).should('be.visible', { timeout: 10000 }).click({ force: true })
                cy.contains(consumption.recommend.youtube.menuContent, captionsTracks.config1.captionsLanguage).should('be.visible', { timeout: 10000 })
            })
        })

    })
})
    it.only("Visit the recommend track which has captions toggle enabled and language selection for Brightcove video", () => {
        //Captions on for recommend track, selecting language and checking in consumption
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config4.name)
        authoring.recommend.addTrack(captionsTracks.config4)
        authoring.recommend.configure(captionsTracks.config4)

        cy.visit(captionsTracks.config4.url+"/index-html")
        consumption.vex.expectBrightcove()   
        cy.get(consumption.vex.brightcove.videoPlayer).should('exist').trigger('mouseover')
        cy.get(consumption.vex.brightcove.captionsCC).should('be.visible', { timeout: 10000 }).click({ force: true })
        cy.contains("div[class*='vjs-captions-button'] li[aria-checked='true']", 'Japanese').should('be.visible', { timeout: 10000 })
        
        //Captions off for recommend track,and checking in consumption
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config5.name)
        authoring.recommend.addTrack(captionsTracks.config5)
        authoring.recommend.configure(captionsTracks.config5)
        
        cy.visit(captionsTracks.config5.url+"/index-html")
        consumption.vex.expectBrightcove()
            cy.get(consumption.vex.brightcove.videoPlayer).should('exist').trigger('mouseover')
            cy.get(consumption.vex.brightcove.captionsCC).should('be.visible', { timeout: 10000 }).click({ force: true })
        cy.contains("div[class*='vjs-captions-button'] li[aria-checked='true']", 'captions off').should('be.visible', { timeout: 10000 })

        //Clone the recommend track and validate captions are cloned
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config6.cloneName)
        authoring.recommend.configure(captionsTracks.config6)
        cy.get(`img[alt='${captionsTracks.config4.contents[0]}']`,{timeout:20000}).click()
        cy.get(authoring.recommend.pageSidebar.captions).invoke('css', 'background-color').then(val => {
            expect(val).to.equal('rgb(0, 169, 203)')
        })
        cy.get(authoring.recommend.pagePreview.pagePreview).within(() => {
            cy.contains('label', 'Language').parent('div').find("span").should("contain", "Japanese")
        })

        cy.contains('a', 'Preview').invoke('attr', 'href').then(link => {
            cy.visit(link)
        })
        consumption.vex.expectBrightcove()
        cy.get(consumption.vex.brightcove.videoPlayer).should('exist').trigger('mouseover')
        cy.get(consumption.vex.brightcove.captionsCC).should('be.visible', { timeout: 10000 }).click({ force: true })
        cy.contains("div[class*='vjs-captions-button'] li[aria-checked='true']", 'Japanese').should('be.visible', { timeout: 10000 })
        
        //Clone the recommend track with captions off and validate details are cloned
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config7.cloneName)
        authoring.recommend.configure(captionsTracks.config7)
        cy.get(`img[alt='${captionsTracks.config5.contents[0]}']`,{timeout:20000}).click()
        cy.get(authoring.recommend.pageSidebar.captions).invoke('css', 'background-color').then(val => {
            expect(val).to.equal('rgb(221, 221, 221)')
        })

        cy.contains('a', 'Preview').invoke('attr', 'href').then(link => {
            cy.visit(link)
        })
        consumption.vex.expectBrightcove()
        cy.get(consumption.vex.brightcove.videoPlayer).should('exist').trigger('mouseover')
        cy.get(consumption.vex.brightcove.captionsCC).should('be.visible', { timeout: 10000 }).click({ force: true })
        cy.contains("div[class*='vjs-captions-button'] li[aria-checked='true']", 'captions off').should('be.visible', { timeout: 10000 })

        //Validate if the Selected language is not having captions/Subtitles we show notification message
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config8.name)
        authoring.recommend.addTrack(captionsTracks.config8)
        authoring.recommend.configure(captionsTracks.config8)

        cy.visit(captionsTracks.config8.url+'/index-html')
        consumption.vex.expectBrightcove()
                cy.get(consumption.vex.brightcove.videoPlayer).should('exist')
                cy.wait(1000)
                cy.contains("#video-captions", 'Selected language is not supported. Caption is being displayed in the default language if supported by the player.').should('be.visible', { timeout: 10000 })
                
        //Validate If a Particular Brightcove Video is not having any captions we will not show any captions even if Captions are enabled and will display an notification.
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config9.name)
        authoring.recommend.addTrack(captionsTracks.config9)
        authoring.recommend.configure(captionsTracks.config9)

        cy.visit(captionsTracks.config9.url+'/index-html-1')
        consumption.vex.expectBrightcove()
                cy.get(consumption.vex.brightcove.videoPlayer).should('exist')
                cy.wait(1000)
                cy.contains("#video-captions", 'Selected language is not supported. Caption is being displayed in the default language if supported by the player.').should('be.visible', { timeout: 10000 })

})