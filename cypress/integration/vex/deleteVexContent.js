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

describe('VEX - Virtual Event', function() {
    before(()=>{
        // Clean up - delete previously added event and contents 
        authoring.common.login();
        authoring.vex.deleteVirtualEvent(event);
        contents.forEach((content)=>{
            authoring.contentLibrary.deleteContent(content.internalTitle)
        })
    })

    it('Verify that deleting content associated with VEX does not result in internal server error', function() {
        // Add content 
        authoring.contentLibrary.visit()
        contents.forEach((content)=>{
            authoring.contentLibrary.addContentByUrl(content)
        })
        
        // Set up: Add event, add sessions to it
        authoring.vex.visit();
        authoring.vex.addVirtualEvent(event);
        authoring.vex.goToEventConfig(event);
        authoring.vex.addSession(session.name);

        // Add the video and supplemental content 
        authoring.vex.configureSession(session)

        // Return to content library and delete the VEX associated contents
        authoring.contentLibrary.visit()
        authoring.contentLibrary.deleteContent(contents[0].internalTitle) // Supplemental content should be deleted 
        authoring.contentLibrary.deleteContent(contents[1].internalTitle, ()=>{
            // For video content, expect a warning message that it is tied to a VEX session and cannot be deleted 
            cy.contains(authoring.contentLibrary.antNotification, `${contents[1].internalTitle} cannot be deleted as it is used in the following Virtual Event Session: ${session.name}`).should('exist')
            cy.containsExact(authoring.contentLibrary.internalTitleCell, contents[1].internalTitle).should('exist')
        })

        // Go into the session and verify that supplemental content is gone
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.goToSessionConfig(session.name)

        // Now remove the session and verify that video can now be deleted from content library
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.removeSession(session.name)
        authoring.contentLibrary.visit()
        authoring.contentLibrary.deleteContent(contents[1].internalTitle)

        // This test file has not yet been validated fully as it is failing due to unresolved bug involving vex content deletion 
    })
})