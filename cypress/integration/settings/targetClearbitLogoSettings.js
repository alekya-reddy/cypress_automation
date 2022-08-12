import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Explore } from '../../support/authoringClasses/Explore'
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const appearance = {
    name: "companyLogos.js"
}
const appearance2 = {
    name: "uploadedLogos.js"
}

const target = {
    name: 'clearbit logo',
    slug: 'clearbitlogoTarget',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/openai`
    }
}
const trackName = target.name

const webContent = ["Website Common Resource", "Youtube Shared Resource", "Bay cat Wikipedia", "Texas Wikipedia", "Pilgrimage - Wikipedia"]

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Setup Target track if not already done", () => {
        cy.request({ url: target.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.target.visit()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })
    it("Set up if not already done", () => {
        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack(target.name)

        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click({ force: true });
        cy.visit(target.url);
        cy.get(authoring.common.cookieConsentAcceptButton).click()

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('be.visible');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click({ force: true });
        cy.visit(target.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.flowCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click({ force: true });
        cy.visit(target.url);


        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click({ force: true });
        cy.visit(target.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.flowCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        //uploaded logos
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click({ force: true });
        cy.visit(target.url);

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.visit(target.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.flowCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.visit(target.url);

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.visit(target.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.flowCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitText).should('not.exist');

    })
})