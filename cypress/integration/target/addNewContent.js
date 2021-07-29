import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia","Texas Wikipedia"]

const target = {
    name: "target-addNewContent.js",
    slug: "target-anc",
    addContentToBottom:"bottom",
    addContentToTop: "top", //if true top of a track
    contents: [webContent[0]],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

describe("Target - Add New content", () => {
    it("Validate add contentTo value scenarios for a target", () => {
        let a = [],b=[],c=[];
        authoring.common.login()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)

        //Validate default Selection of add to content value as Bottom of a track
        authoring.target.verifyAddContentTo(target.addContentToBottom)

        //update add contentTo value from edit track and validate in add content pop up
        authoring.target.updateAddContentValue(target.addContentToTop)
        authoring.target.verifyAddContentTo(target.addContentToTop)

        //update add contentTo value to bottom of track
        authoring.target.updateAddContentValue(target.addContentToBottom)
        authoring.target.verifyAddContentTo(target.addContentToBottom)
        
        authoring.target.configure(target)
        authoring.target.addContent([webContent[1]], false, target.addContentToTop)
        cy.wait(3000)
        cy.get(authoring.target.pageContents).each(content => {
            a.push(content.text().trim())
        }).then(() => {
            expect(a.indexOf(webContent[1])).to.equal(0)
        })

        authoring.target.addContent([webContent[2]])
        cy.wait(3000)
        cy.get(authoring.target.pageContents).each(content => {
            b.push(content.text().trim())
        }).then(() => {
            expect(b.indexOf(webContent[2])).to.equal(2)
        })

        //update add contentTo value to Top of track
        authoring.target.updateAddContentValue(target.addContentToTop)
        authoring.target.verifyAddContentTo(target.addContentToTop)

        //User drag and drop content to target and validate the position of added track
        cy.get("#content-library",{timeout:10000}).should('be.visible').click()
        
        //verify the content count is 3 before drag dragging the content to target 
        cy.contains("div",target.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('3')
        })
        cy.contains("div", webContent[3],{timeout:10000}).trigger("dragstart")
        cy.contains("div",target.name,{timeout:10000}).trigger("drop").trigger("dragend")

         //verify the content count is 4 after dragging the content to target 
        cy.reload()
        cy.contains("div",target.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('4')
        })

        authoring.target.visit();
        authoring.target.goToTrack(target.name)

        cy.wait(3000)
        cy.get(authoring.target.pageContents).each(content => {
            c.push(content.text().trim())
        }).then(() => {
            expect(c.indexOf(webContent[3])).to.equal(0)
        })
    })
})