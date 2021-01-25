import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const event = 'configureSessions';
const successfulDeletedMessage = "The on demand video was removed successfully.";

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

const webpageAsVideo = "configureSessions.js" // The content type is set to video even though it is mediatype of webpage 

const session = {
    name: 'Test Session Configuration',
    newName: 'New Session Name',
    visibility: 'Public',
    slug: 'test-session',
    description: 'Testing 123',
    topics: "General Use",
    type: 'On Demand',
    video: videos[2].internalTitle,
    newVideo: videos[3].internalTitle
}
const session_live = {
    name: "zoom",
    newName: "zoom",
    slug: "zoom",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2020 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Zoom',
        zoomNum: '111 111 111',
        zoomAuth: 'No Password',
    },
    maxAttendees: "1",
    stayOnPage: true,
    video: videos[2].internalTitle
}

describe('VEX - Virtual Event', function() {

    it('Verify that sessions can be configured', function() {
        // Clean up - delete previously added event
        authoring.common.login()
        authoring.vex.deleteVirtualEvent(event)

        // Set up: Add event, add session to it
        authoring.vex.addVirtualEvent(event)
        authoring.vex.goToEventConfig(event)
        authoring.vex.addSession(session.name)

        // Verify that cannot set session to public without first setting an on demand video 
        authoring.vex.goToSessionConfig(session.name)
        cy.get(authoring.vex.publicRadio).click()
        cy.get(authoring.vex.saveButton).click() 
        cy.get('body').should('contain', "required for visibility to be set to public")
        cy.get('body').should('contain', "There was a problem saving this record")

        // Configure the session
        authoring.vex.configureSession(session);

        // Refresh and verify new session settings have been saved 
        cy.reload();
        cy.get(authoring.vex.sessionNameInput).should('have.value', session.newName);
        cy.get(authoring.vex.sessionSlugInput).should('have.value', session.slug);
        cy.get(authoring.vex.sessionDescription.editor).should('contain', session.description);
        cy.get(authoring.vex.publicRadio).parent().should('have.class', 'ant-radio ant-radio-checked'); 
        cy.get(authoring.vex.privateRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked'); 
        cy.get(authoring.vex.onDemandRadio).parent().should('have.class', 'ant-radio ant-radio-checked'); 
        cy.contains(authoring.vex.onDemandTitleLocator, session.video).should('exist');
        cy.containsExact(authoring.vex.topicsTag, session.topics).should("exist")

        // Verify can remove topics
        authoring.vex.removeTopics(session.topics)

        // Test the video picker
        cy.get(authoring.vex.selectVideoButton).click();
        cy.get(authoring.vex.modal).within(()=>{
            // Make sure all  content with mediatype = video are available to be added as the 'on demand' video (Youtube, Vimeo, Vidyard, Brightcove, Wistia)
            videos.forEach((video)=>{
                cy.get(authoring.vex.contentPickerSearchBar).clear().type(video.internalTitle)
                cy.contains(authoring.vex.contentPickerItem, video.internalTitle).should('exist')
            })

            // Content with content_type = video should also be listed here 
            cy.get(authoring.vex.contentPickerSearchBar).clear().type(webpageAsVideo)
            cy.contains(authoring.vex.contentPickerItem, webpageAsVideo).should('exist')

            // Make sure other content/media types are not seen here
            contents.forEach((content)=>{
                cy.get(authoring.vex.contentPickerSearchBar).clear().type(content);
                cy.contains(authoring.vex.contentPickerItem, content).should('not.exist')
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
        cy.contains(authoring.vex.onDemandTitleLocator, session.newVideo).should('exist');

        // Verify the contents listed in the supplemental content picker
        cy.get(authoring.vex.addContentButton).click();
        cy.get(authoring.vex.modal).within(()=>{
            //Contents with media-type = video cannot be added as supplemental content 
            videos.forEach((video)=>{
                cy.get(authoring.vex.contentPickerSearchBar).clear().type(video.internalTitle);
                cy.contains(authoring.vex.contentPickerItem, video.internalTitle).should('not.exist');
            })

            // Contents that aren't media-type = video but are content-type=video should be available here 
            cy.get(authoring.vex.contentPickerSearchBar).clear().type(webpageAsVideo)
            cy.contains(authoring.vex.contentPickerItem, webpageAsVideo).should('exist')

            cy.get(authoring.vex.cancelButton).click();
        })

        // Add supplemental contents of all valid media types (pdf, image, website) and verify it has been saved 
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
    it('Verify that an on demand video can be deleted from a configured session when the session type is live', function() {
        // Clean up - delete previously added event
        authoring.common.login()
        authoring.vex.deleteVirtualEvent(event)

        // Set up: Add event, add session to it
        authoring.vex.addVirtualEvent(event)
        authoring.vex.goToEventConfig(event)
        authoring.vex.addSession(session_live.name)
        authoring.vex.goToSessionConfig(session_live.name)
        // Configure the session
        authoring.vex.configureSession(session_live);
        // Add an on demand video and see that it can be deleted when the session Type is live
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("exist")
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").click()
        cy.get(".ant-popover-buttons").within(()=>{
            cy.contains('button', "Delete").click()
        })
        cy.contains(successfulDeletedMessage, {timeout: 20000}).should("exist")
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("not.exist")

        //On Video cannot be deleted when the session Type is not live
        cy.get(authoring.vex.onDemandRadio).click()
        authoring.vex.pickOnDemandVideo(session_live.video);
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("not.exist")
    })
})