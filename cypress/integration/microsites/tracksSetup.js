import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "tracksSetup.js",
    slug: "trackssetup-js",
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

describe("Microsites - tracks setup", () => {
    /*it("Set up tracks if not already done", () => {
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            cy.log(response.status)
            cy.log(target.url)
            if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })

        cy.request({url: recommend.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                cy.url().then((url)=>{
                    if(!url.includes("/content-library")){
                        authoring.common.login()
                    }
                })
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
            }
        })
    })*/

    it("Add tracks, remove tracks, track input fields validation", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
        authoring.microsites.removeTracks(target.name)
    })
})