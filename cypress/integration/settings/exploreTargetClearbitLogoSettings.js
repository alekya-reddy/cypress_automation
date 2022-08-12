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
}

const exploreTarget = {
    name: 'clearbit logo',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'clearbitlogoExpTar',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
const trackName = target.name

describe("Add Appearance and Verify LastUpdated Date", () => {

    it("Set up if not already done", () => {
        cy.request({ url: exploreTarget.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(exploreTarget)
                authoring.explore.configureExplore(exploreTarget)
            }
        })
    })
    it("Set up if not already done", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(exploreTarget.name)

        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Target Track: ').click();
        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.contains("a", exploreTarget.name).click();
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(1000);
        cy.get(authoring.common.cookieConsentAcceptButton).click({ force: true });

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');
        cy.wait(3000);

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');
        cy.wait(5000);

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        //uploaded logos:

        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Target Track: ').click();
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');;

    })
})