import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Configurations } from '../../support/authoringClasses/Configurations.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: "vexSessionTagging.js",
    slug: "vexSessionTagging-js",
    cloneName: "Clone of vexSessionTagging.js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    
}

const publicSession = [
    {
    name: "public-session",
    slug: "public-session",
    cloneName: "Clone of public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
    },
    {
    name: "Live ended without on-demand",
    slug: "ended",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
    }]

    const multipleSessionTagging = {
        sessionName: publicSession[0].name,
        language: 'Vex-SearchAndFilter',
        topics: ['General Use','Aerospace'],
        businessUnits: ['General Use','Matrix'],
        personas: ['Automation Persona','Test Persona'],
        industry: ['Marketing','Test Industry'],
        funnelStages: ['Top of Funnel','Middle of Funnel','Bottom of Funnel']
    }
    
    const singleSessionTagging = {
        sessionName: publicSession[1].name,
        language: 'Vex-SearchAndFilter',
        topics: ['Aerospace'],
        businessUnits: ['Product'],
        personas: ['Automation Persona'],
        industry: ['Marketing'],
        funnelStages: ['Top of Funnel']
    }

    const sessiontaggingfilterValues={
        topics: [{label:'General Use',check:true},{label: 'Aerospace',check:false}],
        businessUnits: [{label:'Matrix',check:true}],
        personas: [{label:'Automation Persona',check:true}],
        industry: [{label:'Marketing',check:true}],
        funnelStages: [{label:'Middle of Funnel',check:true}]

    }

    // verifySession method is specific for this file to test the sessionTagging values in clone session
    const verifySession = (session,sessionTaggingValues) => {
            authoring.vex.goToSessionEditTags(session.cloneName)
            cy.get(authoring.vex.antModal).within(()=>{
                cy.contains(authoring.vex.antRow, "Language").within(()=>{
                    cy.contains('span',sessionTaggingValues.language).should('exist')
                })
                cy.contains(authoring.vex.antRow, "Topics").within(()=>{
                    cy.contains('span',sessionTaggingValues.topics[0]).should('exist')
                    cy.contains('span',sessionTaggingValues.topics[1]).should('exist')  
                })
                cy.contains(authoring.vex.antRow, "Business Units").within(()=>{
                    cy.contains('span',sessionTaggingValues.businessUnits[0]).should('exist')
                    cy.contains('span',sessionTaggingValues.businessUnits[1]).should('exist')  
                })
                cy.contains(authoring.vex.antRow, "Personas").within(()=>{
                    cy.contains('span',sessionTaggingValues.personas[0]).should('exist')
                    cy.contains('span',sessionTaggingValues.personas[1]).should('exist')  
                })
                cy.contains(authoring.vex.antRow, "Industries").within(()=>{
                    cy.contains('span',sessionTaggingValues.industry[0]).should('exist')
                    cy.contains('span',sessionTaggingValues.industry[1]).should('exist')  
                })
                cy.contains(authoring.vex.antRow, "Funnel Stages").within(()=>{
                    cy.contains('span',sessionTaggingValues.funnelStages[0]).should('exist')
                    cy.contains('span',sessionTaggingValues.funnelStages[1]).should('exist')
                    cy.contains('span',sessionTaggingValues.funnelStages[2]).should('exist')  
                })
            })
        cy.contains("button", "Cancel").click({force:true})
    }    

    describe("VEX- Update session tagging configuration for VEX events", () => {
       it("Set up VEX if doesn't exist", ()=>{
            authoring.common.login()
            authoring.vex.visit();
            authoring.vex.deleteVirtualEvent(event.name)
            authoring.vex.addVirtualEvent(event)
            authoring.vex.configureEvent(event)
            publicSession.forEach((session)=>{
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
                authoring.vex.backToEvent(event.name)
            })
            //Validate if the Edit tags link for each session is visible in the sessions list
            //Validate if click on Edit tags will open modal with all content tags and language options.
            //Validate if all content tags are multi-select and language with a single selection.
            //Validate if all content tags and language are saved for each session.
            authoring.vex.configureSessionTagging(singleSessionTagging)
            authoring.vex.configureSessionTagging(multipleSessionTagging)
            //Validate if each content tag and language options shown in the sessions list with horizontal scrolling in the list.
            authoring.vex.filterTopicsVisibility(sessiontaggingfilterValues.topics)
            authoring.vex.filterIndustriesVisibility(sessiontaggingfilterValues.industry)
            authoring.vex.filterFunnelStagesVisibility(sessiontaggingfilterValues.funnelStages)
            cy.get(authoring.vex.sessionName(publicSession[0].name)).should('exist')
            //Validate sessions tags, language columns are cloning on virtual events session cloning
            //Validate if event sessions are creating and updating the data as expected.
            authoring.vex.cloneSession({
                name: publicSession[0].cloneName,
                template: publicSession[0].name
            })
            cy.go("back")
            verifySession(publicSession[0], multipleSessionTagging)
            //Validate sessions tags,language columns are cloning on virtual event cloning
            authoring.vex.visit()
            authoring.vex.deleteVirtualEvent(event.cloneName)
            authoring.vex.goToEventConfig(event.name)
            authoring.vex.cloneEvent({
                name: event.cloneName,
                sessions: true,
               
            })
            authoring.vex.goToSessionList()
            verifySession(publicSession[0], multipleSessionTagging)
        })   
    })