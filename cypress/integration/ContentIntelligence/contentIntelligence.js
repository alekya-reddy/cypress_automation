import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()



describe("Content Intelligence", () => {

    it("Content Intelligence tab and its options availability", () => {
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence,"ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle,"ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle,"ON")
        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')

        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence,"OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle,"OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle,"OFF")
        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('not.exist')
        cy.request({url: authoring.contentIntelligence.contentConfigurations, failOnStatusCode: false}).then((response)=>{
           expect(response.status).to.equal(404)
        })

        cy.request({url: authoring.contentIntelligence.contentStrategy, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.equal(404)
         })
        cy.pause()

    })


})