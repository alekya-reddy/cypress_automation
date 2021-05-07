import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = 
    {
        role: 'qa-multiuser',
        roleDescription: "User should only have access to Content Library + Insights + Org Settings + User Management + Data Configuration",
        userName: constants.orgs[authoring.common.org].multiUser,
        password: constants.orgs[authoring.common.org].multiUserPassword
    }

const roles = [ 
    "Content Library Feature Access Role.Js",
    "Content Library Insights Role.Js",
    "Organization Settings Role.Js",
    "User Management Role.Js",
    "Data Configuration Settings Role.Js"
    ]

const content = {
    internalTitle: "Content Library Feature Access Role.js",
    publicTitle: "Content Library Feature Access Role JS",
    description: "Content Library Feature Access Role",
    url: "https://en.wikipedia.org/wiki/Governance",
    slug: "cl-feature-access",
    contentType: "Blog",
    language: "English",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg"
    } 
}

const webhook = {
    name: "Data Config Settings JS",
    type: "Visitor Activity"
}

const visitorActivity = {
    name: "Data Config Settings JS",
    type: "Engagement Score",
    score: "2"
}

const newRole = {
    roleName: "New 123 Role",
    imageLibExtCodeAccProtectionAccess: true,
    userManagementCRUD: true,
    campaignToolsSettingsCRUD: true,
    vexModuleCRUD: true
}

const queryString = {
    name: "Organization Settings Role",
    value: "123"
}


describe('Content Library + Insights + Org Settings + User Management + Data Configuration Access', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
        // assign multiple roles to the user
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, roles)

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)

        // module navigation
        cy.get("#content-library").should("exist")
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
            cy.contains("div", "General").should("not.exist")

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

            cy.contains("div", "Data Configuration").should("exist")
            cy.contains("a", "Webhooks").should("exist")
            cy.contains("a", "Visitor Activities").should("exist")

            cy.contains("div", "Campaign Tools").should("not.exist")
            cy.contains("a", "Segments").should("not.exist")
            cy.contains("a", "Routes").should("not.exist")
            cy.contains("a", "Track Labels").should("not.exist")

            cy.contains("div", "Virtual Events").should("not.exist")
            cy.contains("a", "Widgets").should("not.exist")
        })
        
        // settings
        cy.get("#settings").should("exist")
        cy.get("#settings").click()
        cy.get("#organization-management").should("not.exist")
        cy.get("#organization").should("exist")
        cy.get("#user-management").should("exist")
        cy.get("#knowledge-base").should("exist")
        cy.get("#user-account").should("exist")
        cy.get("#logout").should("exist")

        // Content Library
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.pageTitle).should("exist")
        // delete content
        authoring.contentLibrary.delete({url: content.url, wait: 1000})
        // add new content 
        authoring.contentLibrary.addContentByUrl(content)
        // configure
        authoring.contentLibrary.sideBarEdit(content)
        // delete content
        authoring.contentLibrary.delete({url: content.url, wait: 1000})


        // Content Library Insights
        cy.visit(authoring.contentLibrary.contentInsightsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.contentInsightsTitle).should("exist")

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
        cy.visit(authoring.websiteTools.websiteToolsContentConfigurationsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.websiteTools.contentConfigurationsTitle).should("not.exist")
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
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.webhooks).should("exist")
        authoring.configurations.deleteWebhook([webhook.name])
        authoring.configurations.addWebhook(webhook)
            

        // Visitor Activity
        cy.visit(authoring.configurations.pageUrls.visitorActivities)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.visitorActivities).should("exist")
        authoring.configurations.deleteVisitorActivity(visitorActivity.name)
        authoring.configurations.addVisitorActivity(visitorActivity)
    
        
        // // Campaign Tools
        // Segments
        cy.visit(authoring.configurations.pageUrls.segments)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.segments).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        
        // Routes
        cy.visit(authoring.configurations.pageUrls.routes)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.routes).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        
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
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.settings.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Analytics
        cy.visit(authoring.settings.analytics.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.analytics.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Eloqua Account
        cy.visit(authoring.settings.eloquaAccount.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.eloquaAccount.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // API Configurations
        cy.visit(authoring.settings.apiConfigurations.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.apiConfigurations.pageTitle).should("exist")
        authoring.settings.deleteAPIConfigurations("Organization Settings Role")
        authoring.settings.addAPIConfigurations("Organization Settings Role")
        authoring.settings.deleteAPIConfigurations("Organization Settings Role")
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Salesforce
        cy.visit(authoring.settings.salesforce.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.salesforce.pageTitle).should("exist")
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Single Sign On
        cy.visit(authoring.settings.sso.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.sso.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Sales Tools Configuration
        cy.visit(authoring.settings.salesToolsConfiguration.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.salesToolsConfiguration.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Cookie Consent
        cy.visit(authoring.settings.cookieConsent.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.cookieConsent.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")
        
        // 6 sense
        cy.visit(authoring.settings.sixsense.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.sixsense.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Custom Query Strings
        cy.visit(authoring.settings.customQueryStrings.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.customQueryStrings.pageTitle).should("exist")
        authoring.settings.deleteQueryString(queryString.name)
        authoring.settings.addQueryString(queryString)
        authoring.settings.deleteQueryString(queryString.name)

        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Access Protection
        cy.visit(authoring.settings.accessProtection.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.accessProtection.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // Search Engine Directive
        cy.visit(authoring.settings.searchEngineDirective.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.settings.searchEngineDirective.pageTitle).should("exist")
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")


        // // User Management
        // User List
        cy.visit(authoring.userManagement.userList.pageURL)
        cy.contains(authoring.common.pageTitleLocator, authoring.userManagement.userList.pageTitle).should("exist")
        cy.contains("button", "Add User").should("exist")
        // save the same role just to make sure it doen't 403
        authoring.userManagement.assignUserRoles(user.userName, roles)
        // User Roles
        cy.visit(authoring.userManagement.userRoles.pageURL)
        cy.contains(authoring.common.pageTitleLocator, authoring.userManagement.pageTitle).should("exist")
        authoring.userManagement.addNewUserRole(newRole.roleName)
        authoring.userManagement.configureUserRole(newRole)
        authoring.userManagement.deleteUserRole(newRole.roleName)

        // CHECK PA
        // PA Campains Tools 
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/visitors`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/accounts`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/content`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})

        // PA Website Tools
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/account-overview`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/visitor-overview`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-analysis`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-engagement`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
    })
})