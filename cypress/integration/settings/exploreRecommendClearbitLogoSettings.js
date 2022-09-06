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
}
const exploreRecommend = {
    name: 'clearbit logoo',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'clearbitlogoExpRec',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
const trackName = recommend.name

describe("Add Appearance and Verify LastUpdated Date", () => {

    it("Set up if not already done", () => {
        cy.request({ url: exploreRecommend.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(exploreRecommend)
                authoring.explore.configureExplore(exploreRecommend)
            }
        })
    })
    it("Set up if not already done", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(exploreRecommend.name)

        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Recommend Track: ').click();
        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.contains("a", exploreRecommend.name).click();
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.get(authoring.common.cookieConsentAcceptButton).click({ force: true });

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');
        cy.wait(2000);

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        //uploaded logos

        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Recommend Track: ').click();
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.header.headerLogoVisible).should('be.visible');
        cy.get(consumption.common.header.headerTitle).should('have.text', 'Recommended Content');
        cy.get(consumption.common.header.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(consumption.common.flowLogo).should('be.visible');
        cy.get(consumption.common.cookieConsent.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');

    })
})