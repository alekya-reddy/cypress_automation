import { Common } from "./Common";

export class ClientHQ extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/settings/organization-management`;
        this.pageTitle = "Client HQs";
        this.domainPreview = '[data-qa-hook="preview-section-default-tld"]';
        this.domainInput = '#defaultTld';
        this.targetToggle = `[data-qa-hook="enableTarget"]`
        this.recommendToggle = `[data-qa-hook="enableRecommend"]`
        this.formsStrategyToggle = `[data-qa-hook="enableFormsStrategy"]`
        this.targetExploreToggle = `[data-qa-hook="enableTargetLandingExperiences"]`
        this.recommendExploreToggle = `[data-qa-hook="enableRecommendLandingExperiences"]`
        this.topicSidebarToggle = `[data-qa-hook="enableTopicSidebar"]`
        this.contentTrackLabelsToggle = `[data-qa-hook="enableContentTrackLabels"]`
        this.segmentsToggle = `[data-qa-hook="enableSegments"]`
        this.routesToggle = `[data-qa-hook="enableRoutes"]`
        this.virtualEventToggle = '[data-qa-hook="enableVirtualEvents"]';
        this.micrositesToggle = "[data-qa-hook='enableMicrosites']";
        this.queryStringPassThroughToggle = `[data-qa-hook="enableQueryStringPassThrough"]`
        this.publicAPIToggle = `[data-qa-hook="enablePublicApi"]`
        this.crmIntegrationToggle = `[data-qa-hook="enableCrmIntegration"]`
        this.accountAnalyticsToggle = `[data-qa-hook="enableAccountAnalytics"]`
        this.sixSenseToggle = `[data-qa-hook="enableSixSense"]`
        this.websiteJourneyTrackingToggle = `[data-qa-hook="enableWebsiteVisitorTracking"]`
        this.websiteToolsV2Toggle = `[data-qa-hook="enableWebsiteToolsV2"]`
        this.websiteToolsToggle = '[data-qa-hook="enableWebsiteJourney"]'
        this.oceToggle = '[data-qa-hook="enableOce"]'
        this.authoringToggle = 'div[data-qa-hook="active"]'
        this.consumptionToggle = 'div[data-qa-hook="offline"]'
        this.contentIntelligence="[data-qa-hook='enableContentIntelligence']"
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    visitOrgConfig(){
        cy.get(this.pageTitleLocator).invoke('text').then((title)=>{
            if(title !== `Configure ${this.org}`){
                this.visit()
                cy.containsExact('a', this.org, {timeout: 20000}).should("exist").click()
            }
        })
    }

    clientHQToggle(toggle, on_off){
        this.visitOrgConfig()
        this.toggle(toggle, on_off)
        cy.contains('Save').click({force: true})
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }
    
    clientHQToggleDeactive(toggle, on_off){
        this.toggle(toggle, on_off)
        cy.contains('Save').click({force: true})
        cy.contains('button', "Yes, Deactivate").click() 
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }

    clientHQToggleactive(toggle, on_off){
        this.toggle(toggle, on_off)
        cy.contains('Save').click({force: true})
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }

    switchDomain(domain){
        this.visitOrgConfig()
        cy.get(this.domainPreview).within(()=>{
            cy.get(this.editPencil).click()
            cy.get(this.domainInput).click()
            cy.get(`div[aria-label="${domain}"]`).click()
            cy.contains('button', 'Ok').click()
        })
        cy.get(this.domainPreview).should('contain', domain)
        cy.contains('button', 'Save').click()
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }
}