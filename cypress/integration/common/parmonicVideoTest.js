import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()


const content = {
    internalTitle: "parmonic.js",
    url: "https://parmonic.ai/videos/t10c323de7f6467be"
}

const target = {
    name: 'targetparmonic.js',
    slug: 'targetparmonic',
    contentslug: 'website-shared-resource',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${this.contentslug}`
    }
}

const vex = {
    name: 'vexparmonic.js',
    slug: 'vexlimelight-js',
    get url(){ 
        return `${authoring.common.baseUrl}/${this.slug}`
     },
}

const onDemandSession = 'onDemandSession'
const domainName = "pathfactory-qa-wp.com"
const websitePath = "*"
const targetElementID = "content"
const videoTitle = "Mergers and Acquisitions and its impact on sales tax"
const time = "0:10"
const time1= '0:10 / 1:43'

describe("Native Support For Limelight Video Test", function() {
    it("Add Limelight-Video to Content Library", () => {
        authoring.common.login()
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.pageTitle).should("exist")
        // delete content
         authoring.contentLibrary.delete({url: content.url, wait: 1000})
        // add new content 
         authoring.contentLibrary.addContentByUrl(content)
    })

    it("Setup Target track if not already done", () => { 
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
             if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
             }
        })
        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack(target.name)
        authoring.target.addContentTarget(content.internalTitle)
        cy.get(authoring.target.contentClick).click()
        cy.get('h5').contains('Title').should("exist")
        authoring.target.videoStartTime(time)
        cy.get(authoring.target.pagePreview.autoPlayLabel).should("exist")
        cy.get("span:contains('ON')").parent().should("exist")
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target')
        cy.get(authoring.target.previewClick).click()

        //check on consumption that video start time and buttons are working
        cy.get(consumption.target.parmonicVideo.videoControlButton).should("exist").click()
        cy.get(consumption.target.parmonicVideo.videoTime).should('have.text', time1)
        cy.wait(5000)
        cy.get(consumption.target.parmonicVideo.playAndpauseButton).contains('pause').click()

         //clean up
         authoring.target.visit()
         authoring.target.goToTrack(target.name)
         cy.get(authoring.target.contentClick).click()
         cy.get(authoring.target.deleteContent).click()
         cy.get(authoring.target.modal).within(()=>{
             cy.get(authoring.target.removeButton).contains('Remove Item').click()
         })

 })

 it("Set up if not already done", () => {
    cy.request({url: vex.url, failOnStatusCode: false}).then((response)=>{
        if(response.status == 404){ 
            cy.viewport(1500, 1000)
            authoring.common.login()
            authoring.vex.addVirtualEvent(vex)
            authoring.vex.configureEvent(vex)
         }
    })
    authoring.common.login()
    authoring.vex.visit()
    cy.get(authoring.vex.clickEvent).contains('vexparmonic.js').click()
    
    //add seession
    authoring.vex.goToSessionList()
    cy.get(authoring.vex.addSessionButton).click()
    cy.contains(authoring.vex.antModal, "Add Session").within(()=>{
        cy.get(authoring.vex.sessionNameInput).clear().type(onDemandSession)
        cy.get(authoring.vex.addSessionButton).click()
    })
    cy.get(authoring.vex.antModal).should('not.be.visible')
    cy.get(authoring.vex.sessionName(onDemandSession), {timeout: 10000}).should('exist')

    authoring.vex.goToSessionConfig(onDemandSession)
    cy.get(authoring.vex.onDemandRadio).should("have.attr", "checked")
    cy.get(authoring.vex.visibilityPublic).click()
    authoring.vex.pickOnDemandVideo(content.internalTitle)
    cy.get(authoring.vex.saveButton).click()
    cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")
    cy.go("back")
    cy.get(authoring.vex.previewClick).invoke('removeAttr', 'target')
    cy.get(authoring.vex.previewClick).click()

    //check on consumption side that video can play
    cy.get(consumption.vex.parmonic.selectVideo).click()
    cy.get(consumption.vex.parmonic.playButton).should("exist").click()
    cy.wait(5000)
    cy.get(consumption.vex.parmonic.playAndpauseButton).contains('pause').click()

    //clean up
    authoring.vex.visit()
    cy.get(authoring.vex.clickEvent).contains('vexparmonic.js').click()
    authoring.vex.removeSession(onDemandSession)
    
})

it("Limelight for WT", () => {
    authoring.common.login()
    authoring.websiteTools.visit()
    cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
        cy.contains("button", "Delete").click()
    })
    cy.contains(authoring.common.antModal, "Are you sure?").contains("button", "Delete").click()
    cy.get(authoring.websiteTools.addProperty).click()
        cy.get(authoring.websiteTools.antModal).within(() => {
            cy.get(authoring.websiteTools.enterDomainName).type(domainName)
            cy.get(authoring.websiteTools.addProperty).click()
        })
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.contains("a","Add Website Path").click()
        cy.get(authoring.websiteTools.websitePath).type(websitePath)
        cy.contains("span","Guide").click()
        cy.contains("span","Concierge").click()
        cy.get(authoring.websiteTools.targetElementID).type(targetElementID)
        cy.contains("span","Featured").click()
        cy.contains("span","Featured Content").click()
        authoring.websiteTools.addContentToFeatured(content.internalTitle)
        cy.get(authoring.websiteTools.selectOpen).eq(3).click()
        cy.get(authoring.websiteTools.selectOption("both")).click()
        cy.contains("span","Save").click()
    })

        it("Validate Parmonic is loading on Consumption Page", () => {
        cy.visit("https://pathfactory-qa-wp.com/?lb-mode=preview")
        cy.get(consumption.websiteTools.featuredblock).contains("Featured").should("exist")
        cy.wait(3000)
        cy.get(consumption.websiteTools.featuredEvent).contains(videoTitle).parent().should("exist").click()

    


                    })

    })

