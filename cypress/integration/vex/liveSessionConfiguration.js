import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'liveSessionConfiguration.js',
    slug: 'livesessionconfiguration-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; },
}

const sessions = [
    {
        name: 'Live zoom before start',
        slug: 'live-zoom-before-start',
        get url(){ return `${event.url}/${this.slug}`; },
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomPW: 'No Password',
            video: false
        },
        video: false,
        contents: []
    }
]

describe('VEX - Virtual Event', function() {
    it('Set up all the sessions if they do not exist', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.goToEventConfig(event.name)
        sessions.forEach((session)=>{
            authoring.vex.removeSession(session.name)
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
        })
      
        // Scenarios
        // live Zoom before start
        // live Zoom after end 
        // live Zoom during 
        // live zoom with on demand before start
        // live zoom with on demand after end 
        // live zoom with on demand during 
        // live video before start
        // live video after end 
        // live video during 

    })
})