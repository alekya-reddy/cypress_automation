import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "tracksSetup.js",
    slug: "trackssetup-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    showDescription: true
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
    contents: ["Website Common Resource"],
    contentTitleOverRide: "Edited Title for Target track",
    contentDescriptionOverRide: "Edited Description for Target track"
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
    contents: ["Website Common Resource"],
    contentTitleOverRide: "Edited Title for Recommend track",
    contentDescriptionOverRide: "Edited Description for Recommend track"
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

const landingPage2 = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    stayInEditor:true,
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
                    name: recommend2.contentTitleOverRide
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

    it("Verify Track level overrides of Title,Description", () => {
        authoring.common.login()

        // Delete tracks and microsite to reset test environment, then set them up again 
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.setup(microsite)
        authoring.target.deleteTrack(target2.name)
        authoring.target.addTrack(target2)
        authoring.target.configure(target2)
        cy.contains('strong', target2.contents[0]).should('be.visible').click()

        cy.contains('label', 'Content Title Override').parent('div').within(() => {
            cy.contains('span', 'None').should('exist')
        })
        cy.contains('label', 'Content Description Override').parent('div').within(() => {
            cy.contains('span', 'None').should('exist')
        })

        //Overriding the title and Description for Target track
        authoring.target.addContentTitleOverride(target2.contentTitleOverRide)
        authoring.target.addContentDescriptionOverride(target2.contentDescriptionOverRide)

        authoring.recommend.deleteTrack(recommend2.name)
        authoring.recommend.addTrack(recommend2)
        authoring.recommend.configure(recommend2)

        cy.contains('span', recommend2.contents[0]).parent('div').should('be.visible').click()

        cy.contains('label', 'Content Title Override').parent('div').within(() => {
            cy.contains('span', 'None').should('exist')
        })
        cy.contains('label', 'Content Description Override').parent('div').within(() => {
            cy.contains('span', 'None').should('exist')
        })

        //Overriding the title and Description for Target track
        authoring.target.addContentTitleOverride(recommend2.contentTitleOverRide)
        authoring.target.addContentDescriptionOverride(recommend2.contentDescriptionOverRide)

        // Go to microsites and test adding tracks
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.addTracks({ target: [target2.name], recommend: [recommend2.name] })

        // Add the tracks to a landing page block
        authoring.microsites.addLandingPages(landingPage2.name)
        authoring.microsites.configureLandingPage(landingPage2)

        //Validating the Override Title and Description for asset cards authoring side
        cy.get(authoring.microsites.assetCardContent).within(()=>{
            cy.contains('div',target2.contentTitleOverRide).should('exist')
            cy.contains('div',target2.contentDescriptionOverRide).should('exist')
        })

        cy.get(authoring.microsites.assetCardContent).within(()=>{
            cy.contains('div',recommend2.contentTitleOverRide).should('exist')
            cy.contains('div',recommend2.contentDescriptionOverRide).should('exist')
        })
        cy.go("back")
        authoring.microsites.setToHomePage(landingPage2.name)

        cy.visit(landingPage.url)

        //Validating the Override Title and Description for asset cards on consumption
        cy.get(consumption.microsites.cardTitle).within(()=>{
            cy.contains('div',target2.contentTitleOverRide).should('exist')
            cy.contains('div',target2.contentDescriptionOverRide).should('exist')
        })

        cy.get(consumption.microsites.cardTitle).within(()=>{
            cy.contains('div',recommend2.contentTitleOverRide).should('exist')
            cy.contains('div',recommend2.contentDescriptionOverRide).should('exist')
        })
    })
})