import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "User should only have access to Campaign Tool Settings",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Campaign Tool Settings Role.Js",
    personalizationCreateEditView: true,
    trackLabelsCRUD: false,
    trackLabelsView: false
}

const route = {
    name: "CampaignToolsSettingsJS",
    type: "URL",
    destination: "https://www.google.com"
}


describe('Campaign Tool Settings User Role', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
        // create user role if do not exist
        authoring.userManagement.addNewUserRole(role.roleName)
        authoring.userManagement.configureUserRole(role)
        // assign that role to the user
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)

        // module navigation
        cy.get("#content-library").should("not.exist")
        cy.get("#campaign-tools").should("not.exist")
        cy.get("#campaign-tools").should("not.exist")
        cy.get("#target").should("not.exist")
        cy.get("#recommend").should("not.exist")
        cy.get("#explore").should("not.exist")
        cy.get("#microsite").should("not.exist")
        cy.get("#website").should("not.exist")
        cy.get("#virtual-events").should("not.exist")
        cy.get("#website-tools").should("not.exist")
        cy.get("#content-configurations").should("not.exist")

        // configurations
        cy.get("#configurations").should("exist")
        cy.get("#configurations").click()

        cy.get(authoring.configurations.dropdownMenuNav).within(() => {
            cy.contains("div", "General").should("exist")
            cy.contains("a", "Image Library").should("not.exist")
            cy.contains("a", "External Code").should("not.exist")
            cy.contains("a", "Access Protection").should("not.exist")
            cy.contains("a", "Content Tags").should("not.exist")

            cy.contains("div", "User Experience").should("not.exist")
            cy.contains("a", "Appearances").should("not.exist")
            cy.contains("a", "Languages").should("not.exist")
            cy.contains("a", "Links & Sharing").should("not.exist")
            cy.contains("a", "Forms").should("not.exist")
            cy.contains("a", "CTAs").should("not.exist")

            cy.contains("div", "Data Configuration").should("not.exist")
            cy.contains("a", "Webhooks").should("not.exist")
            cy.contains("a", "Visitor Activities").should("not.exist")

            cy.contains("div", "Campaign Tools").should("not.exist")
            cy.contains("a", "Personalization").should("exist").click()
            cy.wait(200)
            cy.contains("a", "Segments").should("exist")
            cy.contains("a", "Destination Routes").should("exist")
            cy.contains("a", "Collection Rules").should("exist")
            cy.contains("a", "Track Labels").should("not.exist")
            cy.contains("div", "Virtual Events").should("not.exist")
            cy.contains("a", "Widgets").should("not.exist")

        })

        // settings
        cy.get("#settings").should("exist")
        cy.get("#settings").click()
        cy.get("#organization-management").should("not.exist")
        cy.get("#organization").should("not.exist")
        cy.get("#user-management").should("not.exist")
        cy.get("#knowledge-base").should("exist")
        cy.get("#user-account").should("exist")
        cy.get("#logout").should("exist")

        // links that user don't have access to:
        // Content Library
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Content Library Insights
        cy.visit(authoring.contentLibrary.contentInsightsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.contentInsightsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Target
        cy.visit(authoring.target.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Target Analytics
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/target/analytics?showExcludedVisitors=false&knownVisitorsOnly=false&startDate=03/21/2021&endDate=04/20/2021`)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.targetAnalyticsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Recommend
        cy.visit(authoring.recommend.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.recommend.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Recommend Analytics
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/recommend/analytics?showExcludedVisitors=false&knownVisitorsOnly=false&startDate=03/21/2021&endDate=04/20/2021`)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.recommendAnalyticsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Explore
        cy.visit(authoring.explore.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.explore.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Microsites
        cy.visit(authoring.microsites.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.microsites.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Website
        cy.visit(authoring.website.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.website.websiteCampaignsPageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Website Analytics
        cy.visit(authoring.website.websiteAnalyticsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.website.websiteCampaignsPageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // VEX
        cy.visit(authoring.vex.vexUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Website Tools
        cy.visit(authoring.websiteTools.websiteToolsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.websiteTools.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        
        cy.visit(authoring.contentIntelligence.websiteContentLibrary)
        cy.contains('h1', "All Sources").should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // // COG
        // images
        cy.visit(authoring.configurations.pageUrls.images)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.images).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // external code
        cy.visit(authoring.configurations.pageUrls.externalCode)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.externalCode).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // access protection
        cy.visit(authoring.configurations.pageUrls.accessProtection)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.accessProtection).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // content tags
        cy.visit(authoring.configurations.pageUrls.contentTags)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.contentTags).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // // User Experience
        // Appearance
        cy.visit(authoring.configurations.pageUrls.appearances)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Languages
        cy.visit(authoring.configurations.pageUrls.languages)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.languages).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Links&Sharings
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Forms
        cy.visit(authoring.configurations.pageUrls.forms)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.forms).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
            
        // CTAs
        cy.visit(authoring.configurations.pageUrls.ctas)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.ctas).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // // Data Configuration
        // Webhooks
        cy.visit(authoring.configurations.pageUrls.webhooks)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.webhooks).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
            

        // Visitor Activity
        cy.visit(authoring.configurations.pageUrls.visitorActivities)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.visitorActivities).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        

        // // Campaign Tools -- HAVE ACCESS

        // Segments
        cy.visit(authoring.configurations.pageUrls.segments)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.segments).should("exist")
        authoring.configurations.addSegment("CampaignToolsSettingsJS")
        authoring.configurations.deleteSegment("CampaignToolsSettingsJS")
        
        // Routes
        cy.visit(authoring.configurations.pageUrls.routes)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.routes).should("exist")
        authoring.configurations.addRoute(route)
        authoring.configurations.deleteRoute(route.name)
        
        // Track Labels
        cy.visit(authoring.configurations.pageUrls.trackLabels)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.trackLabels).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        

        // // Virtual Events
        // Widgets
        cy.visit(authoring.configurations.pageUrls.widgets)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.widgets).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // // SETTINGS

        // // Client HQ
        cy.visit(authoring.settings.clientHQ.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.clientHQ.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // // Organization Settings
        // Settings
        cy.visit(authoring.settings.settings.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.settings.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Analytics
        cy.visit(authoring.settings.analytics.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.analytics.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Eloqua Account
        cy.visit(authoring.settings.eloquaAccount.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.eloquaAccount.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // API Configurations
        cy.visit(authoring.settings.apiConfigurations.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.apiConfigurations.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Salesforce
        cy.visit(authoring.settings.salesforce.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.salesforce.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Single Sign On
        cy.visit(authoring.settings.sso.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.sso.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Sales Tools Configuration
        cy.visit(authoring.settings.salesToolsConfiguration.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.salesToolsConfiguration.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Cookie Consent
        cy.visit(authoring.settings.cookieConsent.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.cookieConsent.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        
        // 6 sense
        cy.visit(authoring.settings.sixsense.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.sixsense.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Custom Query Strings
        cy.visit(authoring.settings.customQueryStrings.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.customQueryStrings.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Access Protection
        cy.visit(authoring.settings.accessProtection.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.accessProtection.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Search Engine Directive
        cy.visit(authoring.settings.searchEngineDirective.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.searchEngineDirective.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")


        // // User Management
        // User List
        cy.visit(authoring.userManagement.userList.pageURL)
        cy.contains(authoring.common.pageTitleLocator, authoring.userManagement.userList.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // User Roles
        cy.visit(authoring.userManagement.userRoles.pageURL)
        cy.contains(authoring.common.pageTitleLocator, authoring.userManagement.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // CHECK PA
        // PA Campains Tools 
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/visitors`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/accounts`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/content`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})

        // PA Website Tools
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/account-overview`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/visitor-overview`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-analysis`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-engagement`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
    })
})
