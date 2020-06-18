import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = 'configureSessions';

const videos = [
    // We don't own any of these video. If any of them get deleted, find a replacement 
    {
        internalTitle: 'Wistia - Used in Cypress automation for VEX testing',
        type: 'Wistia',
        url: 'https://trialscope.wistia.com/medias/wmcbpksnc9' // Embed iframe format not supported on VEX 'https://trialscope.wistia.com/embed/iframe/5f2j8dgfm3'
    },
    {
        internalTitle: 'Brightcove - Used in Cypress automation to test VEX',
        type: 'Brightcove',
        url: 'https://players.brightcove.net/1532789042001/default_default/index.html?videoId=6151947653001'
    },
    {
        internalTitle: 'Youtube - Used in Cypress automation for VEX testing',
        type: 'Youtube',
        url: 'https://www.youtube.com/watch?v=A0FZIwabctw'
    },
    {
        internalTitle: 'Vimeo - Used in Cypress automation for VEX testing',
        type: 'Vimeo',
        url: 'https://vimeo.com/217449774'
    },
    {
        internalTitle: 'Vidyard - Used in Cypress automation for testing VEX',
        type: 'Vidyard',
        url: 'http://embed.vidyard.com/share/NjgzzK8YVzGyLw4oe4HLA7'
    }
]

const contents = [
    'PDF - Used by Cypress automation for VEX testing',
    'Website - Used by Cypress automation for VEX testing',
    'Image - Used by Cypress automation for VEX testing'
]

const session = {
    name: 'Test Session Configuration',
    newName: 'New Session Name',
    visibility: 'Public',
    slug: 'test-session',
    description: 'Testing 123',
    type: 'On Demand',
    video: videos[2].internalTitle,
    newVideo: videos[3].internalTitle
}

describe('VEX - Virtual Event', function() {
    before(()=>{
        // Clean up - delete previously added event
        authoring.common.login();
        authoring.vex.deleteVirtualEvent(event);
    })

    it('Verify that sessions can be configured', function() {
        authoring.vex.visit();

        // Set up: Add event, add session to it
        authoring.vex.addVirtualEvent(event);
        authoring.vex.goToEventConfig(event);
        authoring.vex.addSession(session.name);

        // Verify that cannot set session to public without first setting an on demand video 
        authoring.vex.goToSessionConfig(session.name)
        cy.get(authoring.vex.publicRadio).click()
        cy.get(authoring.vex.saveButton).click() 
        cy.get('body').should('contain', "required for visibility to be set to public")
        cy.get('body').should('contain', "There was a problem saving this record")

        // Configure the session
        cy.visit(authoring.vex.vexUrl);
        authoring.vex.goToEventConfig(event);
        authoring.vex.configureSession(session);

        // Refresh and verify new session settings have been saved 
        cy.reload();
        cy.get(authoring.vex.sessionNameInput).should('have.value', session.newName);
        cy.get(authoring.vex.sessionSlugInput).should('have.value', session.slug);
        cy.get(authoring.vex.sessionDescriptionInput).should('contain', session.description);
        cy.get(authoring.vex.publicRadio).parent().should('have.class', 'ant-radio ant-radio-checked'); 
        cy.get(authoring.vex.privateRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked'); 
        cy.get(authoring.vex.onDemandRadio).parent().should('have.class', 'ant-radio ant-radio-checked'); 
        cy.containsExact(authoring.vex.onDemandTitleLocator, session.video).should('exist');

        // Make sure all video content types are available to be added as the 'on demand' video (Youtube, Vimeo, Vidyard, Brightcove, Wistia)
        cy.get(authoring.vex.selectVideoButton).click();
        cy.get(authoring.vex.modal).within(()=>{
            videos.forEach((video)=>{
                cy.get(authoring.vex.contentPickerSearchBar).clear().type(video.internalTitle);
                cy.contains(authoring.vex.contentPickerItem, video.internalTitle).should('exist');
            })
            
            // Make sure only 1 can be chosen at at time.
            cy.get(authoring.vex.contentPickerSearchBar).clear().type(videos[0].internalTitle);
            cy.contains(authoring.vex.contentPickerItem, videos[0].internalTitle).click();
            cy.get(authoring.vex.contentPickerSearchBar).clear().type(videos[1].internalTitle);
            cy.contains(authoring.vex.contentPickerItem, videos[1].internalTitle).click();
            cy.containsExact('p', 'Cannot add more than 1 item.').should('exist');
            cy.get(authoring.vex.cancelButton).click(); 
        })

        // Choose a different on demand video to validate that you can change the video, then save
        authoring.vex.pickOnDemandVideo(session.newVideo);
        cy.get(authoring.vex.saveButton).click(); 
        cy.containsExact(authoring.vex.onDemandTitleLocator, session.newVideo).should('exist');

        // Make sure video media type cannot be added as supplemental content 
        cy.get(authoring.vex.addContentButton).click();
        cy.get(authoring.vex.modal).within(()=>{
            videos.forEach((video)=>{
                cy.get(authoring.vex.contentPickerSearchBar).clear().type(video.internalTitle);
                cy.contains(authoring.vex.contentPickerItem, video.internalTitle).should('not.exist');
            })
            cy.get(authoring.vex.cancelButton).click();
        })

        // Add supplemental contents of all valid media types (pdf, image, website), refresh and verify it has been saved 
        authoring.vex.addSupplementalContent(contents);
        contents.forEach((content)=>{
            cy.containsExact(authoring.vex.supplementalContentCardTitle, content).should('exist');
        })

        // Verify can remove supplemental content 
        authoring.vex.removeSupplementalContent(contents[0]); // function already checks that content is removed 
        for(let i = 1; i < contents.length ; i++){
            cy.containsExact(authoring.vex.supplementalContentCardTitle, contents[i]).should('exist');
        }
    })
})