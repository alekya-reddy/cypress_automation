import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = 
    {
        role: 'qa-multiuser',
        roleDescription: "User should have access to Content Library + VEX (module + Seetings) + General Settings",
        userName: constants.orgs[authoring.common.org].multiUser,
        password: constants.orgs[authoring.common.org].multiUserPassword
    }

const roles = [ 
    "Content Library Feature Access Role.Js",
    "Virtual Events Module Role.Js",
    "Virtual Event Settings Role.Js",
    "General Settings Role.Js"
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

const externalCode = {name: "roles js", interceptCode: `<div id="testingRoles">Testing roles</div>`}

const event = {
    name: 'virtualEventModuleRole.js',
    slug: 'virtualeventmodulerole',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const appearance = {
    appearance: "Default",
    headerTitle: "Header Title - {{company.name | default: default text}} {{visitor.email}}"
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${vex.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>{{company.name | default: default text}}</h1><h2>{{visitor.email}}</h2>`,
            className: "landingpageblock",
        }
    ]
}

describe('Content Library + VEX + General Settings Access', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
        // assign that multiple roles to the user
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
        cy.get("#virtual-events").should("exist")
        cy.get("#website-tools").should("not.exist")
        cy.get("#content-configurations").should("not.exist")

        // configurations
        cy.get("#configurations").should("exist")
        cy.get("#configurations").click()
        cy.get(authoring.configurations.dropdownMenuNav).within(() => {
            cy.contains("div", "General").should("exist")

            cy.contains("a", "Image Library").should("exist")
            cy.contains("a", "External Code").should("exist")
            cy.contains("a", "Access Protection").should("exist")
            cy.contains("a", "Content Tags").should("exist")

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
            cy.contains("a", "Segments").should("not.exist")
            cy.contains("a", "Routes").should("not.exist")
            cy.contains("a", "Track Labels").should("not.exist")

            cy.contains("div", "Virtual Events").should("exist")
            cy.contains("a", "Widgets").should("exist")
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

        // Content Library
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.contentLibrary.pageTitle).should("exist")
        // cy.get(authoring.common.pageTitleBar).within(() => {
        //     cy.contains("a", "Content Library Insights").should("not.exist") -- BUG
        // })
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
        cy.contains(authoring.common.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should("exist")
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)
        authoring.vex.configureAppearance(appearance)
        // check that usr doesn't have access to VEX Analytics
        authoring.vex.goToAnalytics()
        cy.contains("div", "You don't have permission to view this page.")
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.configureLandingPage(landingPage)
        authoring.vex.deleteVirtualEvent(event.name)

        // Website Tools
        cy.visit(authoring.websiteTools.websiteToolsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.websiteTools.pageTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")
        cy.visit(authoring.websiteTools.websiteToolsContentConfigurationsUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.websiteTools.contentConfigurationsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")


        // // COG
        // // General -- HAVE ACCESS
        // images
        cy.visit(authoring.configurations.pageUrls.images)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.images).should("exist")
        cy.contains("button", "Add Images").click()
        cy.get(authoring.common.modal).within(() => {
            cy.contains("h3", "What are you adding to the image library?")
        })

        // external code
        cy.visit(authoring.configurations.pageUrls.externalCode)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.externalCode).should("exist")
        authoring.configurations.deleteExternalCode(externalCode.name)
        authoring.configurations.addExternalCode(externalCode)
        authoring.configurations.deleteExternalCode(externalCode.name)

        // access protection
        cy.visit(authoring.configurations.pageUrls.accessProtection)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.accessProtection).should("exist")
        authoring.configurations.deleteAccessProtectionGroup("new config (0)")
        authoring.configurations.addAccessProtectionGroup("new config")
        authoring.configurations.deleteAccessProtectionGroup("new config (0)")
        cy.contains("div", "You don't have permission to view this page.").should("not.exist")

        // content tags
        cy.visit(authoring.configurations.pageUrls.contentTags)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.contentTags).should("exist")

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
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.widgets).should("exist")
        authoring.configurations.deleteWidgets(["vexSettingsJS"])
        authoring.configurations.addWidget({name: "vexSettingsJS"})
        authoring.configurations.deleteWidgets(["vexSettingsJS"])

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
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/content`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})

        // PA Website Tools
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/account-overview`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/visitor-overview`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-analysis`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-engagement`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
    })
})