import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'supplementalContentOrder.js',
    slug: 'supplementalcontentorder-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "Session",
    slug: "session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents: [
        'PDF - Used by Cypress automation for VEX testing',
        'Website - Used by Cypress automation for VEX testing',
        'Image - Used by Cypress automation for VEX testing'
    ]
}

describe("VEX - Reordering Supplemental Content", ()=>{
    it("Set up event and session if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
            }
        })
    })
    it("Reorder supplemental content and confirm on consumption side", ()=>{
        // Get to the session
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(session.name)

        // Get the initial order of the supplemental contents
        let initialOrder = []
        for(let i = 0; i < session.contents.length ; i++){
            cy.get(authoring.vex.draggableMenu).eq(i).siblings("span").invoke('text').then((text)=>{
                initialOrder.push(text)
            })
        }

        // Visit consumption to verify the initial order 
        cy.visit(session.url)
        cy.get("body").then(()=>{ 
            // The get 'body' is required because initialOrder won't be defined until the cy commands start executing. 
            // Putting inside a cy.get forces the variable to be called after it is already defined in previous cy command 
            for(let i = 0; i < initialOrder.length ; i++){
                cy.get(consumption.vex.sessionSidebar, {timeout: 20000}).get(`a[href^="/${event.slug}/${session.slug}"]`, {timeoute: 10000}).eq(i).should("contain", initialOrder[i])
            }
        })

        // Go back to authoring and reorder the supplemental content
        cy.go("back")
        cy.get("body").then(()=>{
            cy.contains("span", initialOrder[initialOrder.length - 1], {timeout: 10000}).siblings(authoring.vex.draggableMenu).then((subject)=>{
                cy.contains("span", initialOrder[0], {timeout: 10000}).siblings(authoring.vex.draggableMenu).then((target)=>{
                    cy.get(subject).drag({to: target, place: 'over'}) // this drags the last content to first place
                })
            })
        })
        

        // Calculate the new expected order 
        let newOrder = []
        cy.get("body").then(()=>{
            newOrder = [...initialOrder] // Javascript arrays and objects are assigneds by reference, so do this to leave original array intact
            let poppedItem = newOrder.pop()
            newOrder.unshift(poppedItem)
        })
        
        // Visit consumption to verify the new order 
        cy.visit(session.url)
        cy.get("body").then(()=>{
            for(let i = 0; i < newOrder.length ; i++){
                cy.get(consumption.vex.sessionSidebar).get(`a[href^="/${event.slug}/${session.slug}"]`).eq(i).should("contain", newOrder[i])
            }
        })
    })
})