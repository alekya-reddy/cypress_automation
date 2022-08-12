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

const recommend = {
    name: 'clearbit logo',
    slug: 'clearbitlogoRecommend',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/openai`
    }
}

const trackName = recommend.name

const webContent = ["Website Common Resource", "Youtube Shared Resource", "Bay cat Wikipedia", "Texas Wikipedia", "Pilgrimage - Wikipedia"]

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Setup recommend track if not already done", () => {
        cy.request({ url: recommend.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.recommend.visit()
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
            }
        })
    })
    it("Set up if not already done", () => {
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.goToTrack(recommend.name)

        cy.contains('uploadedLogos.js').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.sidebarToggle).click();
        cy.visit(recommend.url);
        cy.get(authoring.common.cookieConsentAcceptButton).click()

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click({ force: true });
        cy.visit(recommend.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        //uploaded logos
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');

    })
})