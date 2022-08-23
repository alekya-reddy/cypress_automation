import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const genericErrorMessage = "There was a problem saving this record.";
const duplicateMessage = "already exists";
const invalidCharacterMessage = 'Only alphanumeric characters, hyphens and underscores are allowed';
const successfulSaveMessage = "The record was saved successfully.";

const event = {
    name: 'sessionSlugValidation.js'
}
const session1 = {
    name: 'Test Session',
    slug: 'test-session'
}

const session2 = {
    name: 'Test Session 2',
    testSlugs: [
        {
            value: 'test-session',
            expect: duplicateMessage
        },
        {
            value: ' space1',
            expect: invalidCharacterMessage
        },
        {
            value: 'space2 ', 
            expect: invalidCharacterMessage
        },
        {
            value: 'space2 ', 
            expect: invalidCharacterMessage
        },
        {
            value: "valid_slug",
            expect: successfulSaveMessage
        },
        {
            value: "valid-slug",
            expect: successfulSaveMessage
        },
        {
            value: "validslug123",
            expect: successfulSaveMessage
        }
    ]
}

describe('VEX - Virtual Event', function() {

    it('Verify that session slugs are validated to make sure they are unique and valid', function() {
        // Clean up - delete previously added event
        authoring.common.login();
        authoring.vex.deleteVirtualEvent(event.name);

        // Set up: Add event, add sessions to it
        authoring.vex.addVirtualEvent(event);
        authoring.vex.addSession(session1.name);
        authoring.vex.addSession(session2.name);

        // Now attempt to save various values for slug for session2 to check error messages 
        authoring.vex.goToSessionConfig(session2.name)
        session2.testSlugs.forEach((slug)=>{
            cy.get(authoring.vex.sessionSlugInput,{timeout:20000}).clear().type(slug.value)
            cy.get(authoring.vex.saveButton).click()
            cy.get('body').should('contain', slug.expect)
            slug.expect !== successfulSaveMessage ? cy.contains(genericErrorMessage).should('exist') : null ;
            cy.reload()
            cy.wait(5000)
            if(slug.expect == successfulSaveMessage){
                cy.get(authoring.vex.sessionSlugInput).should('have.value', slug.value);
            } else {
                cy.get(authoring.vex.sessionSlugInput).should('not.have.value', slug.value)
            }
        })
    })
})