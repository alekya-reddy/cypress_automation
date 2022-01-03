import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const captionsTracks = {
    config1: {
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
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
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
        name: "recommendSettingscaptions2.js",
        slug: "recommend-config-captions2",
        contents: ["Oracle Cloud captions"],
        captions:"off",
        index:"0",
        verify:false,
        get url(){
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    }
}

describe("Target - Video captions", () => {
    it("Visit the recommend track which has subtitle enabled and disabled", () => {
        authoring.common.login()

         //Captions off from recommend track and checking in consumption
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(captionsTracks.config2.name)
        authoring.recommend.addTrack(captionsTracks.config2)
        authoring.recommend.configure(captionsTracks.config2)

        cy.pause()
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

    })
})