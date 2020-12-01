import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const supplementalContent = {
    internalTitle: "Wiki99",
    url: "https://en.wikipedia.org/wiki/1999"
}

const videoContent = {
    internalTitle: "Starship",
    url: "https://www.youtube.com/watch?v=zqE-ultsWt0"
}

const supplementalContent2 = {
    internalTitle: "WIki98",
    url: "https://en.wikipedia.org/wiki/1998"
}

const videoContent2 = {
    internalTitle: "Crewdragon",
    url: "https://www.youtube.com/watch?v=FMi_m9-e9MU"
}

const contents = [videoContent, supplementalContent, videoContent2, supplementalContent2]

const event = 'Delete content';

const session = {
    name: 'Stuff To delete',
    video: videoContent.internalTitle,
    contents: [supplementalContent.internalTitle]
}

const session2 = {
    name: 'Second session',
    video: videoContent2.internalTitle,
    contents: [supplementalContent2.internalTitle]
}

const sessions = [session, session2]

// Want to ensure that can/cannot delete vex-associated content in following scenarios: 
// Video used in deleted session can be deleted 
// Video used in deleted event can be deleted 
// Video used in active session cannot be deleted 
// Content used as supplemental content can always be deleted 
// Also check that you can still edit video used in VEX

describe('VEX - Virtual Event', function() {

    it('Verify that deleting content associated with VEX does not result in internal server error', function() {
        authoring.common.login()

        // Delete the event to clear out any bad state - must delete first or else will block from clearing content library
        authoring.vex.deleteVirtualEvent(event)

        // Clean up - delete previously contents as they might have been left in altered state, leading to inconsistency + flakiness 
        authoring.contentLibrary.visit()
        cy.get(authoring.contentLibrary.table.urlCell, {timeout: 20000}).should('exist') // waits for table cells to load
        cy.scrollWithin({ scroller: authoring.contentLibrary.scrollableTable }) // Scrolls whole table to load all content
        contents.forEach((content)=>{
            authoring.contentLibrary.delete({url: content.url, wait: 500, noScroll: true})
        })

        // Add content back in correct state 
        contents.forEach((content)=>{
            authoring.contentLibrary.addContentByUrl(content)
        })
        
        // Add event back and add sessions to it
        authoring.vex.visit();
        authoring.vex.addVirtualEvent(event)
        authoring.vex.goToEventConfig(event)
        sessions.forEach((session)=>{
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event)
        })

        // Return to content library and should be able to delete the supplemental content used in VEX
        authoring.contentLibrary.visit()
        authoring.contentLibrary.delete({internalTitle: supplementalContent.internalTitle})

        // Verify content used as a VEX video can be edited (specifically public title, internal title, description, slug, thumbnail - there was a bug where could not edit) 
        authoring.contentLibrary.sideBarEdit({
            internalTitle: videoContent.internalTitle,
            publicTitle: "Different public title",
            newInternalTitle: "Different internal title", 
            description: "Different description",
            slug: "different-slug",
            thumbnail: {
                category: "Stock Images",
                url: "/stock/sm/animal-dog-pet-cute.jpg"
            } 
        })
        
        // Verify content currently used as a VEX video cannot be deleted 
        authoring.contentLibrary.delete({url: videoContent.url, verify: false})
        cy.contains(authoring.contentLibrary.antNotification, `Different internal title cannot be deleted as it is used in the following Virtual Event Session: ${session.name}`).should('exist')
        cy.containsExact(authoring.contentLibrary.table.internalTitleCell, 'Different internal title').should('exist')

        // Go into the session and verify that supplemental content is gone since it was deleted 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.goToSessionConfig(session.name)
        cy.containsExact("span", supplementalContent.internalTitle).should('not.exist')

        // Now remove the session and verify that video can now be deleted from content library
        cy.contains('a', event).click()
        authoring.vex.removeSession(session.name)
        authoring.contentLibrary.delete({url: videoContent.url})

        // Now delete the entire event, and make sure video and supplemental content used in the second session can be deleted
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event)
        authoring.contentLibrary.delete(videoContent2) 
        authoring.contentLibrary.delete(supplementalContent2)

    })
})