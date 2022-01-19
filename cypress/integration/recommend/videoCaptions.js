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