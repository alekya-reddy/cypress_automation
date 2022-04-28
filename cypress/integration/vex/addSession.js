import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const liveSession = "liveSession"
const start = 'Jun 24, 2025 8:00pm'
const end = 'Jun 24, 2025 9:00pm'
const start1 = 'Jun 24, 2025 8:30pm'
const end1 = 'Jun 24, 2025 9:00pm'
const start2 = 'Jun 24, 2025 10:00pm'
const end2 = 'Jun 24, 2025 11:00pm'
const start3 = 'Jun 24, 2025 11:30pm'
const end3 = 'Jun 24, 2025 11:45pm'
const timeZone = '(GMT-05:00) Eastern Time (US & Canada)'
const onDemandSession = 'onDemandSession'
const moreSessionsAddMsg = 'More session times can be added on the configuration page'
const timesOveralappedMsg = 'times are overlapped'
const timezone1 = '(GMT-04:00) Atlantic Time (Canada)'

const videos = [
    {
        internalTitle: 'Youtube - Used in Cypress automation for VEX testing',
        type: 'Youtube',
        url: 'https://www.youtube.com/watch?v=A0FZIwabctw'
    }
]

const event = {
    name: '2addSession.js',
    slug: '2addSession-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; },
}
describe('VEX - Virtual Event', function() {
    it("Add live sessions and validate the authoring behavior with multiple sessions added", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name) // Clean up from previous runs
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)

        // Add live session using the modal 
        authoring.vex.goToSessionList()
        cy.get(authoring.vex.addSessionButton).click()
        cy.contains(authoring.vex.antModal, "Add Session").within(()=>{
            cy.get(authoring.vex.sessionNameInput).clear().type(liveSession)
            cy.get(authoring.vex.liveRadio).click()
            cy.contains(moreSessionsAddMsg).should('exist')
            //While we're here, check to make sure can't input end date that is before start date
            cy.get(authoring.vex.startTimeInput).click().clear().type(end + "\n")
            cy.get(authoring.vex.endTimeInput).click().clear().type(start + "\n")
            cy.get(authoring.vex.addSessionButton).click()
            cy.contains("must be later than start time").should('exist')

            // Now enter proper start and end dates and proceed with test
            cy.get(authoring.vex.startTimeInput).click().clear().type(start + "\n")
            cy.get(authoring.vex.endTimeInput).click().clear().type(end + "\n")
            cy.get(authoring.vex.addSessionButton).click()
        })
        cy.get(authoring.vex.antModal).should('not.be.visible')
        cy.get(authoring.vex.sessionName(liveSession), {timeout: 10000}).should('exist')
        // Go to live session config to verify it has the correct session type and selected times 
        authoring.vex.goToSessionConfig(liveSession)
        cy.contains('div', "Used for title tag, meta title and og title. Appears in search result when event link is shared on social media.").should('exist')
        cy.contains('div', "Used for og image and appears when event link is shared on social media.").should('exist')
        cy.contains('div', "Used for og description and meta description. Appears in search result when event link is shared on social media.").should('exist')
        cy.get(authoring.vex.liveRadio).should("have.attr", "checked")
        cy.get(authoring.vex.onDemandRadio).should("not.have.attr", "checked")
        cy.get(authoring.vex.startTimeEditInput(0)).should("have.attr", "title", start)
        cy.get(authoring.vex.endTimeEditInput(0)).should("have.attr", "title", end)
        cy.get(authoring.vex.publicRadio).click();
        //Add 2nd session which has time overlapped with previous session added above
        cy.contains("span", "Add another session time").click()
        cy.get(authoring.vex.startTimeEditInput(1)).click().clear().type(start1 + "\n")
        cy.get(authoring.vex.endTimeEditInput(1)).click().clear().type(end1 + "\n")
        cy.get(authoring.vex.timeZoneEditSelect(1)).select(timeZone)
        // select live content type as content library,
        cy.get(authoring.vex.liveTypePicker).click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.selectOption('Content Library')).click()
        })
         //Add content in content library
         cy.get(authoring.vex.selectLiveContentButton).click();
         cy.get(authoring.vex.modal).within(()=>{
             cy.get(authoring.vex.contentPickerSearchBar).clear().type(videos[0].internalTitle);
             cy.contains(authoring.vex.contentPickerItem, videos[0].internalTitle).click();
             cy.get(authoring.vex.selectLiveContentButton).click();
         })
         cy.get(this.modal).should('not.exist');
         cy.wait(1000)
        // Save the current settings and verify the session time overlapping message
        cy.get(authoring.vex.saveButton).click()
        cy.contains(timesOveralappedMsg).should('exist')
        cy.contains(authoring.vex.messages.saveFailed).should('exist')

        //Add 2nd session which has time overlapped with previous session added above in different time zone but still overapping as per UTC
        cy.get(authoring.vex.timeZoneEditSelect(1)).select(timezone1)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(timesOveralappedMsg).should('exist')
        cy.contains(authoring.vex.messages.saveFailed).should('exist')

        // Configure the 2nd session with non overalpped timings
        cy.get(authoring.vex.startTimeEditInput(1)).click().clear().type(start2 + "\n")
        cy.get(authoring.vex.endTimeEditInput(1)).click().clear().type(end2 + "\n")
        cy.get(authoring.vex.timeZoneEditSelect(1)).select(timeZone)
        //Add 3rd session which has non overlapped time with previous sessions added above
        cy.contains("span", "Add another session time").click()
        cy.get(authoring.vex.startTimeEditInput(2)).click().clear().type(start3 + "\n")
        cy.get(authoring.vex.endTimeEditInput(2)).click().clear().type(end3 + "\n")
        cy.get(authoring.vex.timeZoneEditSelect(2)).select(timeZone)

        // Save the current settings and verify the session time overlapping message
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")
        //Check that the Default session time cannot be deleted and the additional session times can be deleted
        cy.get(authoring.vex.sessionTimeRow(0)).within(()=>{
            cy.get('span[aria-label="delete"]').should('not.exist')
        })
        cy.get(authoring.vex.sessionTimeRow(1)).within(()=>{
            cy.get('span[aria-label="delete"]').should('exist')
        })
        cy.get(authoring.vex.sessionTimeRow(2)).within(()=>{
            cy.get('span[aria-label="delete"]').should('exist')
        })
    })
    it("Validate the consumption side behavior with multiple sessions added to a vex event", ()=>{
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionCardTitle, liveSession).should('exist').click()
        cy.contains(consumption.vex.sessionPageTitle,liveSession).parent().within(()=>{
            cy.contains('days').should('exist')
            cy.contains('hours').should('exist')
            cy.contains('minutes').should('exist')
            cy.contains('seconds').should('exist')
            cy.contains(consumption.vex.sessionTime,start).should('exist')
        })
        cy.contains('Additional Session Times').parent().parent().within(()=>{
            cy.contains(consumption.vex.sessionTime,start2).should('exist')
            cy.contains(consumption.vex.sessionTime,start3).should('exist')
        })
    })
    it("Add live session which is running live now", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(liveSession)
        //Add the current time so that the session runs live in consumption
        cy.get(authoring.vex.startTimeEditInput(0)).click().clear()
        cy.get(authoring.vex.currentTime).click()
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")
    })
    it("Validate the consumption side behavior with a live session added", ()=>{
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionCardTitle, liveSession).should('exist').click()
        cy.contains(consumption.vex.sessionPageTitle,liveSession).parent().within(()=>{
            cy.contains('Live').should('exist')
        })
        cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')

        //Check that that the video is playing live
        consumption.vex.expectYoutube()
        // Verify can pause, play video, and check video current time
        cy.waitForFrameElementCondition(consumption.vex.youtube.iframe, consumption.vex.youtube.videoPlayer, 3000, (elem)=> { return elem.paused == false; })
        consumption.vex.youtube.pause()
        cy.wait(3000)
        consumption.vex.youtube.play()
        cy.wait(3000)
        consumption.vex.youtube.pause()
    })
    it("Add an On Demand session and check the authoring behavior", ()=>{
        //Add on-demand session using the modal (on-demand session is the default value selected)
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        cy.get(authoring.vex.addSessionButton).click()
        cy.contains(authoring.vex.antModal, "Add Session").within(()=>{
            cy.get(authoring.vex.sessionNameInput).clear().type(onDemandSession)
            cy.get(authoring.vex.addSessionButton).click()
        })
        cy.get(authoring.vex.antModal).should('not.be.visible')
        cy.get(authoring.vex.sessionName(onDemandSession), {timeout: 10000}).should('exist')

        // Go to on demand session config to verify it has the correct session type 
        authoring.vex.goToSessionConfig(onDemandSession)
        cy.get(authoring.vex.liveRadio).should("not.have.attr", "checked")
        cy.get(authoring.vex.onDemandRadio).should("have.attr", "checked")
        cy.get(authoring.vex.startTimeEditInput(0)).should('not.exist')
    })
})