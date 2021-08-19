import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'


const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const content = {
    internalTitle: "limelightVideo.js",
    url: "https://link.videoplatform.limelight.com/media/?channelId=273873a6e9834d0b86e66a63f9bdf767&width=1024&height=576&embedMode=html&htmlPlayerFilename=limelightjs-player.js&embedMode=html&htmlPlayerFilename=limelightjs-player.js&playerForm=LVPPlayer&orgid=6540f51f4b444780ba7c63c5e866d66a"
}

const target = {
    name: 'targetlimelight.js'
}

const vex = {
    name: 'vexlimelight.js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; },
}

const onDemandSession = 'onDemandSession'
const domainName = "pathfactory-tracking-test.com"
const websitePath = "*"
const videoTitle = "Limelight channel - Cigna Collaborative Care Customer Success Story - Shawn King"
const time = "0:10"


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

     it("Limelight for Target", () => {
        authoring.common.login()
        authoring.target.visit()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.addContentTarget(content.internalTitle)
        cy.get(authoring.target.contentClick).click()
        cy.get('h5').contains('Title').should("exist")
        authoring.target.videoStartTime(time)
        cy.get(authoring.target.pagePreview.autoPlayLabel).should("exist")
        cy.get("span:contains('ON')").parent().should("exist")
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target')
        cy.get(authoring.target.previewClick).click({force: true})
       
        //check on consumption that video autoplay, start-time working
       cy.get(consumption.target.limeLightVideo.splashScreen).should("exist")
       cy.get(consumption.target.limeLightVideo.videoControlButton).should("exist")
    
       cy.get(consumption.target.limeLightVideo.videoTime).contains(time).should("exist")
       cy.wait(5000)

       //check on consumption that video play-pause button working
       cy.get(consumption.target.limeLightVideo.videoPauseButton).click()
       
        cy.get(consumption.target.limeLightVideo.videoPlayButton).click()
        cy.wait(10000)
        cy.get(consumption.target.limeLightVideo.videoPauseButton).click()
      
    })
  
     it("Limelight For VEX", () => {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(vex.name)
        authoring.vex.addVirtualEvent(vex)
        cy.get(authoring.vex.clickEvent).contains('vexlimelight.js').click()

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
        cy.get(consumption.vex.limelight.selectVideo).click()
        cy.get(consumption.vex.limelight.play1).click({force: true})
        cy.wait(3000)
        cy.get(consumption.vex.limelight.pause).click()

        //clean up
        authoring.vex.visit()
        cy.get(authoring.vex.clickEvent).contains('vexlimelight.js').click()
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
        cy.contains("span","Featured").click()
        cy.contains("span","Featured Content").click()
        authoring.websiteTools.addContentToFeatured(content.internalTitle)
        cy.contains("span","Save").click()
    })

    it("Validate limelight is laoding on consumption page", () => {
    cy.visit("https://pathfactory-tracking-test.com/how-it-works/?lb-mode=preview")
    cy.get(consumption.websiteTools.featuredblock).contains("Featured").should("exist")
    cy.wait(3000)
    cy.get(consumption.websiteTools.featuredEvent).contains(videoTitle).parent().should("exist").click()

       })
 

})
