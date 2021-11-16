import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org

describe("Content Intelligence", () => {

    it("Content Intelligence tab and its options availability", () => {
        // Content intelligence & website tools are Enabled: show both Content configurations and Content strategy
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "ON")
        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')

        // Content intelligence & website tools are disabled: Don't show both Content configurations and Content strategy
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "OFF")

        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('not.exist')

        cy.request({ url: authoring.contentIntelligence.contentConfigurations, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

        cy.request({ url: authoring.contentIntelligence.contentStrategy, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

        //Content Intelligence is enabled and website tools is disabled: Show both Content configurations and Content strategy
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "OFF")

        cy.visit(authoring.contentIntelligence.contentConfigurations)
        cy.contains("You don't have permission to view this page.", { timeout: 10000 }).should('exist')

        cy.visit(authoring.contentIntelligence.contentStrategy)
        cy.contains("Content Strategy Overview", { timeout: 10000 }).should('exist')

        // Content Intelligence is disabled and Website tools is enabled: Show only Content configurations
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "ON")

        cy.visit(authoring.contentIntelligence.contentConfigurations)
        cy.contains("You don't have permission to view this page.", { timeout: 10000 }).should('not.exist')

        //Content Intelligence is disabled and if the user directly open the content-starategy url, redirect to forbidden page
        cy.request({ url: authoring.contentIntelligence.contentStrategy, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

    })


})