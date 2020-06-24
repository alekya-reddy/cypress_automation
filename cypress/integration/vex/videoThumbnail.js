import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'videoThumbnail.js',
    slug: 'videothumbnail-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; },
}

const sessions = [
    {
        name: 'live-zoom',
        slug: 'live-zoom',
        get url(){ return `${event.url}/${this.slug}`; }
    },
    /*{
        // There is existing bug where a live session that uses video from content library would cause consumption page to go blank 
        // The session for this one is temporarily set to private so that it doesn't block the rest of the test
        name: 'live-video',
        slug: 'live-video',
        get url(){ return `${event.url}/${this.slug}`; }
    },*/
    {
        // This case will fail as there's a bug where thumbnail doesn't apply to on-demand videos
        name: 'on-demand',
        slug: 'on-demand',
        get url(){ return `${event.url}/${this.slug}`; }
    }
]

const thumbnail1 = {
    category: 'Stock Images',
    url: 'https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg'
}
const thumbnail2 = {
    category: 'Stock Images',
    url: 'https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-labrador.jpg' 
}


describe('VEX - Virtual Event', function() {
    it('Test video thumbnail configuration', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)

        // Set the thumbnail for each session
        // Each test run, we are alternating the thumbnail. This way, no need to have before hooks to reset thumbnail each time, thus saving time 
        sessions.forEach((session)=>{
            authoring.vex.goToSessionConfig(session.name)
            cy.ifElementExists(`img[src="${thumbnail1.url}"]`, 1000, ()=>{
                authoring.vex.selectThumbnail(thumbnail2)
                session.thumbnail = thumbnail2
            })
            cy.get('body').then(()=>{
                if(!session.thumbnail){
                    authoring.vex.selectThumbnail(thumbnail1)
                    session.thumbnail = thumbnail1
                }
            })
            cy.get(authoring.vex.saveButton).click()
            cy.get('body').should('contain', 'The record was saved successfully')
            cy.contains('a', event.name).click()
        })

        // Now visit the event page on consumption and verify the correct thumbnails are applied
        cy.visit(event.url)
        sessions.forEach((session)=>{
            cy.get(`a[href="/${event.slug}/${session.slug}"]`).within(()=>{
                cy.get(`img[src="${session.thumbnail.url}"]`).should('exist')
            })
        })

    })

})