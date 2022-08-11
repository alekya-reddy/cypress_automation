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
    slug: 'recommend-track-01',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/openai`
    }
}

const recommend1 = {
    name: 'clearbit logo',
}

const exploreRecommend = {
    name: 'clearbit logoo',
    experienceType: 'Recommend',
    trackName: recommend1.name,
    slug: 'clearbit-logo-19',

    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
const trackName = recommend1.name

const webContent = ["Website Common Resource", "Youtube Shared Resource", "Bay cat Wikipedia", "Texas Wikipedia", "Pilgrimage - Wikipedia"]

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Setup recommend track if not already done", () => {
        cy.request({ url: recommend.url, failOnStatusCode: false }).then((response) => {
            cy.wait(2000)
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

        cy.get(authoring.configurations.appearances.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.cookieConsentButton).should('not.exist');
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

        cy.get(authoring.configurations.appearances.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.visit(recommend.url);

        cy.get(authoring.configurations.appearances.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');

    })
})