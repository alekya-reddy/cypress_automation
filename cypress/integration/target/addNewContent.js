import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia","Texas Wikipedia","Pilgrimage - Wikipedia"]

const target = {
    name: "target-addNewContent.js",
    slug: "target-anc",
    addContentToBottom:"bottom",
    addContentToTop: "top",
    contents: [webContent[0]],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target1 = {
    name: "deleteTarget1.js",
}

const target2 = {
    name: "deleteTarget2.js",
}
const target3 = {
    name: "deleteTarget3.js",
}

const targetUsedInExplore = {
    name: "DoNotDelete",
}

const ExploreFromTarget = "DoNotDelete"

describe("Target - Add New content", () => {
    it("Validate add content to top or bottom of the target track", () => {
        let a = [],b=[],c=[],d=[];
        authoring.common.login()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)

        //Validate default Selection of add content to selection as 'Bottom of track'
        authoring.target.verifyAddContentTo(target.addContentToBottom)

        //update add contentTo value from edit track and validate in add content pop up
        authoring.target.updateAddContentTo(target.addContentToTop)
        authoring.target.verifyAddContentTo(target.addContentToTop)

        //update add contentTo value to bottom of track
        authoring.target.updateAddContentTo(target.addContentToBottom)
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
        authoring.target.updateAddContentTo(target.addContentToTop)
        authoring.target.verifyAddContentTo(target.addContentToTop)

        //User drag and drop content to target and validate the position of added content
        cy.get("#content-library",{timeout:10000}).should('be.visible').click()
        
        //verify the content count is 3 before dragging the content to target 
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

        //update add contentTo value to bottom of track
        authoring.target.updateAddContentTo(target.addContentToBottom)
        authoring.target.verifyAddContentTo(target.addContentToBottom)

        //User drag and drop content to target and validate the position of added content
        cy.get("#content-library",{timeout:10000}).should('be.visible').click()
        
        //verify the content count is 4 before dragging the content to target 
        cy.contains("div",target.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('4')
        })
        cy.contains("div", webContent[4],{timeout:10000}).trigger("dragstart")
        cy.contains("div",target.name,{timeout:10000}).trigger("drop").trigger("dragend")

         //verify the content count is 5 after dragging the content to target 
        cy.reload()
        cy.contains("div",target.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('5')
        })

        authoring.target.visit();
        authoring.target.goToTrack(target.name)

        cy.wait(3000)
        cy.get(authoring.target.pageContents).each(content => {
            d.push(content.text().trim())
        }).then(() => {
            expect(d.indexOf(webContent[4])).to.equal(4)
        })
    })
        
    it('Verify Delete Option For Multi-Select', function() {
        authoring.common.login();
        authoring.target.visit();
        authoring.target.addTrack(target1)
        authoring.target.addTrack(target2)
        cy.go("back")
        cy.contains('td', target1.name).prev().click()
        cy.contains('td', target2.name).prev().click()
        cy.contains('h5', " Select: ").should("exist")
        cy.contains('h5', "2").should("exist")
        cy.contains('button', " Delete").should("exist").click()
        cy.get(authoring.common.modalBody).within(()=>{
            cy.contains('span', "Yes").should("exist").click()
        })
        cy.contains('td', target1.name).should("not.exist")
        cy.contains('td', target2.name).should("not.exist")

     })

     it('Verify Delete Option And Error Msg For Multi-Select When Track has been used in Microsite/Explore', function() {
        authoring.common.login();
        authoring.target.visit();
        authoring.target.addTrack(target3)
        cy.go("back")
        cy.contains('td', target3.name).prev().click()
        cy.contains('td', targetUsedInExplore.name).prev().click()
        cy.contains('h5', " Select: ").should("exist")
        cy.contains('h5', "2").should("exist")
        cy.contains('button', " Delete").should("exist").click()
        cy.get(authoring.common.modalBody).within(()=>{
            cy.contains('span', "Yes").should("exist").click()
        })
            cy.contains('div', "Track(s) cannot be deleted").should("exist")
            cy.contains('p', "Before you delete the following track(s), you need to remove it from the following Explore page(s) and/or Microsite(s) and/or Route(s):").should("exist")
            cy.contains('li', "DoNotDelete").should("exist")
            cy.contains('span', "OK").should("exist").click()
        cy.contains('td', target3.name).should("not.exist")
        cy.contains('td', targetUsedInExplore.name).should("exist")

     })
})