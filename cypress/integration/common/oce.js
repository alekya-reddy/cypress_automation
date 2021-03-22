import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

//const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const authoring = createAuthoringInstance()

const oauthClientId = constants.orgs[authoring.common.org].oceOauthClientId
const oauthClientSecret = constants.orgs[authoring.common.org].oceOauthClientSecret
const instanceUrl = constants.orgs[authoring.common.org].oceInstanceUrl
const idcsUrl = constants.orgs[authoring.common.org].oceidcsUrl
const serviceInstanceBaseUrl = constants.orgs[authoring.common.org].oceServiceInstanceBaseUrl
const recordSaved = "The record was saved successfully"
const oceAcctNotVerified = "The OCE account is not verified."
const cantbeBlank = "can't be blank"
const  oceAcctVerified = "The OCE account is verified."
const invalidAcct = "Given details could not be authenticated. Please check your credentials and try again."

describe("oce configuration", () => {
    it("Valid the oce configuration when oce Account is toggled on in Client HQs settings ", () => {
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.oceToggle, 'on');
        authoring.settings.visitoceAccount();
        //Verify the oce account cannot be saved when instanceUrl, idcsUrl, serviceInstanceBaseUrl are not provided and invalid values are provided for oauthClientId, oauthClientSecret
        cy.get(authoring.settings.oceAccount.oce_oauthClientId).clear().type('a')
        cy.get(authoring.settings.oceAccount.oce_oauthClientSecret).clear().type('b')
        cy.get(authoring.settings.oceAccount.oce_instanceUrl).clear()
        cy.get(authoring.settings.oceAccount.oce_idcsUrl).clear()
        cy.get(authoring.settings.oceAccount.oce_serviceInstanceBaseUrl).clear()
        cy.contains("button", "Save").click()
        cy.contains(invalidAcct).should('exist')
        cy.get(authoring.settings.oceAccount.oce_instanceUrl).parent().parent().within(()=>{
            cy.contains(cantbeBlank).should('exist')
        })
        cy.get(authoring.settings.oceAccount.oce_idcsUrl).parent().parent().within(()=>{
            cy.contains(cantbeBlank).should('exist')
        })
        cy.get(authoring.settings.oceAccount.oce_serviceInstanceBaseUrl).parent().parent().within(()=>{
            cy.contains(cantbeBlank).should('exist')
        })
        //Verify the oce account is not verified but can be saved when oauthClientId and oauthClientSecret are not updated
        cy.get(authoring.settings.oceAccount.oce_oauthClientId).clear()
        cy.get(authoring.settings.oceAccount.oce_oauthClientSecret).clear()
        cy.get(authoring.settings.oceAccount.oce_instanceUrl).clear().type(instanceUrl);
        cy.get(authoring.settings.oceAccount.oce_idcsUrl).clear().type(idcsUrl);
        cy.get(authoring.settings.oceAccount.oce_serviceInstanceBaseUrl).clear().type(serviceInstanceBaseUrl);
        cy.contains("button", "Save").click()
        cy.contains(recordSaved).should('exist')
        cy.contains(oceAcctNotVerified).should('exist')
        //Verify the oce account is verified and saved when all fields are provide with valid values
        cy.get(authoring.settings.oceAccount.oce_oauthClientId).clear().type(oauthClientId);
        cy.get(authoring.settings.oceAccount.oce_oauthClientSecret).clear().type(oauthClientSecret);
        cy.contains("button", "Save").click()
        cy.contains(recordSaved).should('exist')
        cy.contains(oceAcctVerified).should('exist')
        //Verify that Turning off oce Account toggle from Client HQs settings disables 
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'off');
    })
    it('When oce Account is toggled off, you should see pemission denied message when oce Account is navigated', function() {
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.oceToggle, 'off');
        authoring.settings.visitoceAccount()
        cy.contains("You don't have permission to view this page.").should('exist');
    })
})