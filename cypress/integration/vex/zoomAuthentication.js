import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'zoomAuthentication.js',
    slug: 'zoomauthentication-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: 'Zoom authentication',
    slug: 'zoom-authentication',
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: {
            picker: authoring.vex.startTimeInput,
            month: 'Jan',
            year: '2020',
            day: '1',
            hour: '10',
            minute: '45',
            xm: 'AM'
        },
        end: {
            picker: authoring.vex.endTimeInput,
            month: 'Oct',
            year: '2029',
            day: '15',
            hour: '05',
            minute: '30',
            xm: 'PM'
        },
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Zoom',
        zoomNum: '111 111 111',
        zoomPW: 'No Password',
        video: false,
    }
}

// Currently, zoom authentication does nothing - feature not yet implemented 
describe('VEX - Virtual Event', function() {
    it('Test that zoom attendee authentication works after setting it up on authoring side', function() {
        /*
        authoring.common.login()
        authoring.vex.visit() 
        //authoring.vex.addVirtualEvent(event.name)
        authoring.vex.goToEventConfig(event.name)
        //authoring.vex.addSession(session.name)
        authoring.vex.configureSession(session)
        */
    })
})