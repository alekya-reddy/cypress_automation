import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia"]

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
    it("Validate add content at bottom of a track", () => {
        let a = [],b=[];
        authoring.common.login()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)

        //Validate default Selection of Add to content value as Bottom of a track
        authoring.target.verifyAddContentTo(target.addContentToBottom)

        //update add content value from edit track and Validate in add content pop up
        authoring.target.updateAddContentValue(target.addContentToTop)
        authoring.target.verifyAddContentTo(target.addContentToTop)

        //update add content value to bottom of track
        authoring.target.updateAddContentValue(target.addContentToBottom)
        authoring.target.verifyAddContentTo(target.addContentToBottom)
        
        authoring.target.configure(target)
        authoring.target.addContent([webContent[1]], false, target.addContentToTop)
        cy.wait(5000)
        cy.get(authoring.target.pageContents).each(content => {
            a.push(content.text().trim())
        }).then(() => {
            expect(a.indexOf(webContent[1])).to.equal(0)
        })

        authoring.target.addContent([webContent[2]])
        cy.wait(5000)
        cy.get(authoring.target.pageContents).each(content => {
            b.push(content.text().trim())
        }).then(() => {
            expect(b.indexOf(webContent[2])).to.equal(2)
        })
        cy.pause()
    })
})