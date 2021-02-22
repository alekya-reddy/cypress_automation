import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "tracksSetup.js",
    slug: "trackssetup-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target1 = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const target2 = {
    name: "tracksSetup.js target",
    slug: "trackssetup-js-target",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const recommend1 = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const recommend2 = {
    name: "tracksSetup.js recommend",
    slug: "trackssetup-js-rec",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    trackType: "recommend",
    contents: ["Website Common Resource"]
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
            id: "Target Block",
            type: "track",
            track: target2.name,
            expectContents: target2.contents,
        },
        {
            id: "Recommend Featured Content Block",
            type: "featured",
            name: "The Featured Content Block",
            contents: [
                {
                    trackType: recommend2.trackType,
                    track: recommend2.name,
                    name: recommend2.contents[0]
                },
            ],
        }
    ]
}

describe("Microsites - tracks setup", () => {
    it("Add tracks, remove tracks", ()=>{
        authoring.common.login()

        // Delete tracks and microsite to reset test environment, then set them up again 
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.target.deleteTrack(target2.name)
        authoring.target.addTrack(target2)
        authoring.target.configure(target2)
        authoring.recommend.deleteTrack(recommend2.name)
        authoring.recommend.addTrack(recommend2)
        authoring.recommend.configure(recommend2)

        // Go to microsites and test adding tracks
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.addTracks({target: [target1.name, target2.name], recommend: [recommend1.name, recommend2.name]})

        // Add the tracks to a landing page block
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)

        // Should not be able to remove the tracks from the microsite while used in landing page block
        const verify = false
        authoring.microsites.removeTracks(target2.name, verify)
        cy.contains("Before deleting a track(s) from microsite, delete it from landing page/Navigation config").should("exist")
        cy.contains("button", "Cancel").click()
        authoring.microsites.removeTracks(recommend2.name, verify)
        cy.contains("Before deleting a track(s) from microsite, delete it from landing page/Navigation config").should("exist")
        cy.contains("button", "Cancel").click()

        // Delete the landing page (will verify later that you can now remove the tracks from microsite)
        authoring.microsites.removeLandingPages(landingPage.name)
        
        // Go to target and attempt to delete a target track used in a microsite 
        authoring.target.deleteTrack(target2.name, false)
        cy.contains(authoring.target.modal, "Track cannot be deleted").should("exist")
        cy.contains(authoring.target.modal, "Before you delete this Track, you need to remove it from the following Microsite(s):").should("exist")
        cy.contains(authoring.target.modal, microsite.name).should("exist")

        // Go to recommend and attempt to delete a recommend track used in a microsite 
        authoring.recommend.deleteTrack(recommend2.name, false)
        cy.contains(authoring.recommend.modal, "Track cannot be deleted").should("exist")
        cy.contains(authoring.recommend.modal, "Before you delete this Track, you need to remove it from the following Microsite(s):").should("exist")
        cy.contains(authoring.recommend.modal, microsite.name).should("exist")

        // Verify can remove a target and a recommend track from the microsite (after they've been removed from landing page)
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.removeTracks([target2.name, recommend2.name])

        // Now you can delete the 2 tracks that have been removed from the microsite 
        authoring.target.deleteTrack(target2.name)
        authoring.recommend.deleteTrack(recommend2.name)

        // Go back to the microsite and remove the remaining tracks via the 'add track' modal (this is another way to remove tracks from a microsite)
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.removeTracks2({
            target: target1.name,
            recommend: recommend1.name
        })
    })
})