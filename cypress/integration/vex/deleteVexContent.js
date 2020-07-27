import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = 'Delete VEX associated content';

const contents = [
    {
        internalTitle: "Wikipedia 1999",
        url: "https://en.wikipedia.org/wiki/1999"
    },
    {
        internalTitle: "Starship Back to Earth",
        url: "https://www.youtube.com/watch?v=zqE-ultsWt0"
    }
]

const session = {
    name: 'Contains Content To Be Deleted',
    video: contents[1].internalTitle,
    contents: [contents[0].internalTitle]
}

// Want to ensure that can/cannot delete vex-associated content in following scenarios: 
// Video used in deleted session can be deleted 
// Video used in deleted event can be deleted 
// Video used in active session cannot be deleted 
// Content used as supplemental content can always be deleted 
// Also check that you can still edit video used in VEX

describe('VEX - Virtual Event', function() {
    before(()=>{
        // Clean up - delete previously added event and contents 
        authoring.common.login();
        authoring.vex.deleteVirtualEvent(event);
        authoring.contentLibrary.deleteContentByUrl({urls: [contents[0].url, contents[1].url]})
    })

    it('Verify that deleting content associated with VEX does not result in internal server error', function() {
        // Add content 
        authoring.contentLibrary.visit()
        contents.forEach((content)=>{
            authoring.contentLibrary.addContentByUrl(content)
        })
        
        // Add event, add sessions to it
        authoring.vex.visit();
        authoring.vex.addVirtualEvent(event);
        authoring.vex.goToEventConfig(event);
        authoring.vex.addSession(session.name);

        // Add the video and supplemental content 
        authoring.vex.configureSession(session)

        // Return to content library and should be able to delete the supplemental content used in VEX
        authoring.contentLibrary.visit()
        authoring.contentLibrary.deleteContent(contents[0].internalTitle) 

        // Verify content used as a VEX video can be edited (specifically public title, internal title, description, slug, thumbnail - there was a bug where could not edit) 
        authoring.contentLibrary.sideBarEdit({
            search: contents[1].internalTitle,
            publicTitle: "Different public title",
            internalTitle: "Different internal title", 
            description: "Different description",
            slug: "different-slug",
            thumbnail: {
                category: "Stock Images",
                url: "https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg"
            } 
        })
        
        // Verify content currently used as a VEX video cannot be deleted 
        authoring.contentLibrary.deleteContentByUrl({urls: [contents[1].url], verifyDeleted: false})
        cy.contains(authoring.contentLibrary.antNotification, `Different internal title cannot be deleted as it is used in the following Virtual Event Session: ${session.name}`).should('exist')
        cy.containsExact(authoring.contentLibrary.internalTitleCell, 'Different internal title').should('exist')

        // Go into the session and verify that supplemental content is gone since it was deleted 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.goToSessionConfig(session.name)
        cy.containsExact(authoring.vex.sessionCardTitle, session.name).should('not.exist')

        // Now remove the session and verify that video can now be deleted from content library
        cy.contains('a', event).click()
        authoring.vex.removeSession(session.name)
        authoring.contentLibrary.deleteContentByUrl({urls:[contents[1].url]})

        // Now add the video back as well as the session, then delete the event, and make sure video can be deleted 
        cy.reload()
        contents.forEach((content)=>{
            authoring.contentLibrary.addContentByUrl(content)
        })
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.addSession(session.name)
        authoring.vex.configureSession(session)
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event)
        authoring.contentLibrary.visit()
        authoring.contentLibrary.deleteContent(contents[0].internalTitle) 
        authoring.contentLibrary.deleteContent(contents[1].internalTitle)

    })
})