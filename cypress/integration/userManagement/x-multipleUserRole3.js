import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = 
    {
        role: 'qa-multiuser',
        roleDescription: "User should have access to Campaign Tools Module + CT Settings + User Experience Settings",
        userName: constants.orgs[authoring.common.org].multiUser,
        password: constants.orgs[authoring.common.org].multiUserPassword
    }

const roles = [ 
    "Campaign Tools Module Role.Js",
    "Campaign Tool Settings Role.Js",
    "User Experience Settings Role.Js"
 ]

const target = {
    name: 'campaign Tools Module.js',
    language: "English",
    appearance: "Default",
    slug: 'tcampaigntoolsmodulejs',
    externalCode: "External Code 1 - Shared Resource",
    contents:[
        "Website Shared Resource",
    ],
    sidebar: "on",
    formsStrategy: "on",
    formsStrategyOptions: {
        trackRule: {
            form: "Standard",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "off",
            dismissable: "off"
        }
    },
    accessProtection: {
        type: "None",
        groups: ["None"]
    }
}

const recommend = {
    name: 'campaign Tools Module.js',
    language: "English",
    appearance: "Default",
    slug: 'rcampaigntoolsmodulejs',
    externalCode: "External Code 1 - Shared Resource",
    contents:[
        "Website Shared Resource",
    ],
    topicSidebar: "on",
    formsStrategy: "on",
    formsStrategyOptions: {
        trackRule: {
            form: "Standard",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "off",
            dismissable: "off"
        }
    },
    accessProtection: {
        type: "None",
        groups: ["None"]
    }
}

const explore = {
    name: 'campaign Tools Module.js',
    experienceType: 'Target',
    trackName: "T2 authoring cx",
    slug: 'campaigntoolsmodulejs',
    externalCode: "External Code 1 - Shared Resource",
    appearance: "Default",
    publicTitle: "Public Title",
    filters: "on",
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const microsite = {
    name: 'campaign Tools Module.js',
    slug: 'mcampaigntoolsmodulejs',
    appearance: 'Default',
    externalCode: "External Code 1 - Shared Resource",
    accessProtection: {
        type: "None",
        groups: ""
    },
    disallowGroups: "Default",
    searchEngineDirective: "No Index, Follow",
    cookieConsent: true,
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
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

const navigations = [ 
    {
        label: "campaigntoolsmodulejs.js",
        type: "Link",
        source: "www.google.com"
    }
]

const website = {
    url: "https://google.com/governance",
    enabled: "on"
}

const cta = {
    name: "1 UserExperienceJS",
    label: "1 UserExperienceJS",
    ctaType: "Link",
    destination: "https://www.google.com"
}

const route = {
    name: "CampaignToolsSettingsJS",
    type: "URL",
    destination: "https://www.google.com"
}

describe('Campaign Tools Module + CT Settings + User Experience Settings Access', function() {
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
        cy.get("#content-library").should("not.exist")
        cy.get(authoring.common.contentActivation).should("exist").click()
        cy.get("#campaign-tools").should("exist")
        cy.get("#campaign-tools").click()
        cy.get("#target").should("exist")
        cy.get("#recommend").should("exist")
        cy.get("#explore").should("exist")
        cy.get("#microsite").should("exist")
        cy.get("#website").should("exist")
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

            cy.contains("div", "User Experience").should("exist")
            cy.contains("a", "Appearances").should("exist")
            cy.contains("a", "Languages").should("exist")
            cy.contains("a", "Links & Sharing").should("exist")
            cy.contains("a", "Forms").should("exist")
            cy.contains("a", "CTAs").should("exist")

            cy.contains("div", "Data Configuration").should("not.exist")
            cy.contains("a", "Webhooks").should("not.exist")
            cy.contains("a", "Visitor Activities").should("not.exist")

            cy.contains("div", "Campaign Tools").should("exist")
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

        // Target -- HAVE ACCESS
        cy.visit(authoring.target.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.pageTitle).should("exist")
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.configure(target)
        authoring.target.deleteTrack(target.name)

        // Target Analytics
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/target/analytics?showExcludedVisitors=false&knownVisitorsOnly=false&startDate=03/21/2021&endDate=04/20/2021`)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.targetAnalyticsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Recommend -- HAVE ACCESS
        cy.visit(authoring.recommend.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.recommend.pageTitle).should("exist")
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        authoring.recommend.deleteTrack(recommend.name)

        // Recommend Analytics
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/recommend/analytics?showExcludedVisitors=false&knownVisitorsOnly=false&startDate=03/21/2021&endDate=04/20/2021`)
        cy.contains(authoring.common.pageTitleLocator, authoring.target.recommendAnalyticsTitle).should("not.exist")
        cy.contains("div", "You don't have permission to view this page.")

        // Explore -- HAVE ACCESS
        cy.visit(authoring.explore.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.explore.pageTitle).should("exist")
        authoring.explore.deleteExplore(explore.name)
        authoring.explore.addExplore(explore)
        authoring.explore.configureExplore(explore)
        authoring.explore.deleteExplore(explore.name)

        // Microsites -- HAVE ACCESS
        cy.visit(authoring.microsites.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.microsites.pageTitle).should("exist")
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        // Add a new landing page and fully configure it with landing page blocks. Set this page as home page.
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)
        navigations.forEach((navigation) => {
            authoring.microsites.addNavItem(navigation)
        })
        authoring.microsites.removeMicrosite(microsite.name)

        // Website -- HAVE ACCESS
        cy.visit(authoring.website.pageUrl)
        cy.contains(authoring.common.pageTitleLocator, authoring.website.websiteCampaignsPageTitle).should("exist")
        authoring.website.deleteWebsite(website.url)
        authoring.website.addWebsite(website.url)
        authoring.website.configureWebsite(website)
        authoring.website.deleteWebsite(website.url)

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
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("exist")
        authoring.configurations.addNewAppearance({name: "User Experience Settings js"})
        authoring.configurations.deleteAppearance("User Experience Settings js")

        // Languages
        cy.visit(authoring.configurations.pageUrls.languages)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.languages).should("exist")
        authoring.configurations.addNewLanguage({name: "UserExperienceJS", code: "usr"})
        authoring.configurations.deleteLanguage("UserExperienceJS")

        // Links&Sharings
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("exist")
        authoring.configurations.deleteLinksAndSharing("UserExperienceJS")
        authoring.configurations.addLinksAndSharing("UserExperienceJS")

        // Forms
        cy.visit(authoring.configurations.pageUrls.forms)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.forms).should("exist")
        authoring.configurations.deleteForm("UserExperienceJS")
        authoring.configurations.addForm("UserExperienceJS")
            
        // CTAs
        cy.visit(authoring.configurations.pageUrls.ctas)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.ctas).should("exist")
        authoring.configurations.deleteCTA(cta.name)
        authoring.configurations.addCTA(cta)
        authoring.configurations.deleteCTA(cta.name)

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
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/campaign-tools/visitors`)
        cy.contains("div", "You don't have permission to view this page.", {timeout: 30000})
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
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-analysis`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
        // cy.visit(`${authoring.common.baseUrl}/authoring/content-library/path-analytics/website-tools-pa/content-engagement`)
        // cy.contains("div", "You don't have permission to view this page.", {timeout: 10000})
    })
})