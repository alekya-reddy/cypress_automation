import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const captionsTracks = {
    config1: {
        name: "targetSettingscaptions.js",
        slug: "target-config-captions",
        contents: ["Oracle Cloud captions"],
        captionsLanguage: "German",
        captions:"on",
        index:"0",
        get url(){
            return `${authoring.common.baseUrl}/${this.slug}`
        }
    },
    config2: {
        name: "targetSettingscaptions2.js",
        slug: "target-config-captions2",
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
    it("Visit the target track which has subtitle enabled and disabled", () => {
        authoring.common.login()

         //Captions off from target track and checking in consumption
        authoring.target.visit()
        authoring.target.deleteTrack(captionsTracks.config2.name)
        authoring.target.addTrack(captionsTracks.config2)
        authoring.target.configure(captionsTracks.config2)

        cy.visit(captionsTracks.config2.url)
        cy.waitForIframeToLoad(consumption.target.youtube.iframe, consumption.target.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.target.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
                cy.get(consumption.target.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.target.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.wait(1000)
                cy.contains("div.ytp-menuitem-label","Subtitles/CC").parents("div.ytp-menuitem").find(consumption.target.youtube.menuContent).invoke('text').then(text=>{
                    if(text.includes("Off")){
                        cy.contains(consumption.target.youtube.menuContent,"Off").should('be.visible',{timeout:10000})
                    }
                    else
                    {
                        cy.contains(consumption.target.youtube.menuContent,"English").should('be.visible',{timeout:10000})
                    }
                })
            })
        })


        //Captions on from target track and checking in consumption
        authoring.common.login()
        authoring.target.visit()
        authoring.target.deleteTrack(captionsTracks.config1.name)
        authoring.target.addTrack(captionsTracks.config1)
        authoring.target.configure(captionsTracks.config1)

        cy.visit(captionsTracks.config1.url)

        cy.waitForIframeToLoad(consumption.target.youtube.iframe, consumption.target.youtube.videoPlayer, 20000)
        cy.getIframeBody(consumption.target.youtube.iframe).within(() => {   
            cy.get("div.ytp-chrome-bottom").then(()=>{
                cy.get(consumption.target.youtube.videoPlayer).should('exist').trigger('mouseover')
                cy.get(consumption.target.youtube.settings).should('be.visible',{timeout:10000}).click({force:true})
                cy.contains(consumption.target.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000})
                cy.contains(consumption.target.youtube.menuContent,captionsTracks.config1.captionsLanguage).should('be.visible',{timeout:10000}).click()
                cy.contains("Spanish").click()
                cy.contains(consumption.target.youtube.menuContent,"Spanish").should('be.visible',{timeout:10000})
            })
        })

    })
})