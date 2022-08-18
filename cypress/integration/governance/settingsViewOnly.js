import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "Settings Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role1 = {
    roleName: "Custom",
    imageLibraryCRUD: false,
    imageLibraryView: true,
    accessProtectionCRUD: false,
    accessProtectionView: true,
    externalCodeView: true,
    externalCodeCRUD: false

}

const role2 = {
    roleName: "Custom",
    contentTagsCreateEditView: false,
    contentTagsView: true
}

const role3 = {
    roleName: "Custom",
    appearanceCRUD: false,
    appearanceView: true,
    linksshareView: true,
    linksshareCreateEditView: false,
    formsView: true,
    formsCRUD: false,
    cTASView: true,
    cTASCRUD: false,
}

const role4 = {
    roleName: "Custom",
    webhooksVisitorActivityCRUD: false,
    webhooksVisitorActivityView: true,
    visitorActivityView: true,
    visitorActivityCRUD: false
}

const role5 = {
    roleName: "Custom",
    personalizationCreateEditView: false,
    personalizationView: true
}

const role6 = {
    roleName: "Custom",
    trackLabelsCRUD: false,
    trackLabelsView: true
}

const role7 = {
    roleName: "Custom",
    vexSettingsCRUD: false,
    vexSettingsView: true
}

describe("View Only Permissions", () => {

    it("Image Library  View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role1)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role1.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Image Library").should("exist").click()
        cy.contains("button", "Add Images").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.nameInput).should("not.exist")
        cy.contains("a", "Hero Images").should("exist").click()
        cy.contains("button", "Add Images").should("not.exist")
        cy.get(authoring.common.deleteIcon).should("not.exist")

        //External Code View Permission
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "External Code").should("exist").click()
        cy.contains("button", "Add External Code").should("not.exist")
        cy.get(authoring.common.pageBody).should("exist")
        cy.contains('div', "Body Organization Settings").click()

        cy.contains("h5", "External Code Name").should("exist")
        cy.contains("h5", "External Code Name").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.nameField).should("not.exist")

        cy.contains("h5", "Language Descriptions").click()
        cy.contains("button", "Close").click()

        cy.contains("h5", "Code Snippet").click()
        cy.get(authoring.common.modal).should("exist")
        cy.contains("button", "Close").should("exist").click()

        cy.contains("h5", "Location").should("exist")
        authoring.common.togglemethod(authoring.configurations.externalCode.globalToggleEnabled)
        authoring.common.togglemethod(authoring.configurations.externalCode.thirdPartyCookieToggle)
        cy.get(authoring.configurations.externalCode.deleteIcon).should("not.exist")

        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Access Protection").should("exist").click()

        cy.contains("span", "Add Group").should("not.exist")
        cy.get(authoring.common.pageSidebar).should("exist")
        cy.get(authoring.common.editIcon).should("not.exist")
        cy.get(authoring.common.deleteIcon).should("not.exist")
        cy.contains("button", "Add Domain").should("not.exist")
        cy.contains("button", "Add Email Address").should("not.exist")

        cy.contains("a", "Cisco SSO Visitor Groups").should("exist").click()
        cy.contains("span", "Create Cisco SSO Visitor Group").should("not.exist")
        cy.get(authoring.configurations.segments.deleteIcon).should("not.exist")
        cy.get(authoring.configurations.segments.editSegments).should("not.exist")


    })

    it("Content Tags View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role2)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role2.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Content Tags").should("exist").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.contentTagSetting).should("not.exist")
        cy.contains("button", "Add ").should("not.exist")
        cy.contains("a", "Business Units").should("exist").click()
        cy.contains("button", "Add ").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableListing).should("exist")
        cy.contains("a", "Personas").should("exist").click()
        cy.contains("button", "Add ").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableListing).should("exist")
        cy.contains("a", "Industries").should("exist").click()
        cy.contains("button", "Add ").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableListing).should("exist")
        cy.contains("a", "Content Types").should("exist").click()
        cy.contains("button", "Add ").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableListing).should("exist")

    })

    it("Appearances View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role3)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role3.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Appearances").should("exist").click()
        cy.contains("button", "Add Appearance", { timeout: 5000 }).should("not.exist")
        cy.get(authoring.common.editIcon).should("not.exist")
        cy.get(authoring.common.deleteIcon).should("not.exist")
        cy.contains("div", "+ Add Appearance").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.pagePreview).should("exist")
        cy.contains("button", "Save General Settings").should("not.exist")
        cy.contains("button", "Reset Settings").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.thumbnailSelect).should("not.exist")
        cy.contains("a", "Header").should("exist").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.valueSelector).should("exist").click()
        cy.get(authoring.common.popover).should("not.exist")

        cy.get(authoring.settings.viewOnlySettingsLocators.colorInput).should("exist").click()
        cy.get(authoring.common.popover).should("not.exist")
        authoring.common.togglemethod(authoring.settings.viewOnlySettingsLocators.dynamicLogo)
        authoring.common.togglemethod(authoring.common.checkboxContainer)

        //Links & Sharing View Only Permissions
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Links & Sharing").should("exist").click()
        cy.get(authoring.common.editIcon).should("not.exist")
        cy.get(authoring.common.deleteIcon).should("not.exist")
        cy.contains("div", "+ Add Configuration").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.pagePreview).should("exist")
        cy.get(authoring.common.orgSave).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.emailMsgInput).should("exist")

        cy.get(authoring.settings.viewOnlySettingsLocators.twitterCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.linkedinCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.facebookCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.emailCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.LikeCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.downloadCheckbox).should("exist").click({ force: true })
        cy.get(authoring.settings.viewOnlySettingsLocators.checkboxUnchecked).should("not.exist")

    })

    it("Forms View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role3)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role3.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Forms").should("exist").click()
        cy.contains("button", "Add Form").should("not.exist")
        cy.wait(2000)
        cy.get(authoring.settings.viewOnlySettingsLocators.tableContainer).should("exist")
        cy.contains('div', "Automation").should("exist").click()
        cy.contains("h5", "Form Name").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.formNameInput).should("not.exist")
        authoring.common.togglemethod(authoring.settings.viewOnlySettingsLocators.cookieConsentToggle)
        cy.contains("h5", "Form Preview").should("exist")
        cy.contains("h3", "Fill This Out to Continue").should("exist").click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.captureFirstName).should("exist").click({ force: true })
        cy.get(authoring.common.popover).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.captureLastName).should("exist").click({ force: true })
        cy.get(authoring.common.popover).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.captureTitle).should("exist").click({ force: true })
        cy.get(authoring.common.popover).should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.captureCompany).should("exist").click({ force: true })
        cy.get(authoring.common.popover).should("not.exist")

        cy.contains("button", "Preview Form").should("exist")
        cy.get(authoring.configurations.forms.delete).should("not.exist")

        //CTAs View Only Permissions
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "CTAs").should("exist").click()
        cy.contains("button", "Add CTA").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableContainer).should("exist")
        cy.contains('div', "Form CTA").should("exist").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.previewCTAs).should("exist").click()
        cy.get('#name').should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.previewLabel).should("exist").click()
        cy.get('#label').should("not.exist")
        cy.contains("h5", "Type").should("exist").click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains("h5", "Destination").should("exist").click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.get(authoring.configurations.ctas.delete).should("not.exist")

    })

    it("Webhooks View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role4)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role4.roleName])
        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()

        cy.contains("a", "Webhooks").should("exist").click()
        cy.contains("button", "Add Webhook").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableContainer).should("exist")
        cy.contains('div', "Elq Capture Form").should("exist").click()
        cy.contains("h5", "Webhook Name").should("exist").click()
        cy.get('#name').should("not.exist")
        authoring.common.togglemethod(authoring.website.enabledToggle)
        cy.contains("h5", "Webhook URL").should("exist").click()
        cy.get('#url').should("not.exist")
        cy.contains("h5", "Response Content Type").should("exist").click()
        cy.get('div[class="Select-value"]').should("not.exist")
        cy.contains("h5", "Event Type").should("exist").click()
        cy.get(authoring.common.checkboxContainer).should("not.exist")
        cy.contains("h5", "Event Fields").should("exist").click()
        cy.contains('button', "Close").should("exist").click()
        cy.contains("h5", "Custom Fields").should("exist").click()
        cy.contains('button', "Close").should("exist").click()
        cy.contains("h5", "Fire for Known Visitors only").should("exist")
        cy.contains("h5", "Fire for Invalid Email Domains").should("exist")
        cy.contains("h5", "Custom Delimiter for Multiple Value Fields").should("exist").click()
        cy.get('#listFieldDelimiter').should("not.exist")
        cy.contains("div", "View Logs").should("exist")
        cy.get(authoring.configurations.ctas.delete).should("not.exist")

        //Visitor Activities View Permission
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Visitors Activities").should("exist").click()
        cy.contains("button", "Add Activity").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableContainer).should("exist")
        cy.contains('div', "Engagement Score").should("exist").click()
        cy.contains("h5", "Activity Name").should("exist")
        cy.contains("h5", "Status").should("exist")
        cy.contains("h5", "Published At").should("exist")
        cy.contains("h5", "Activity").should("exist")
        cy.contains("button", "Archive").should("not.exist")

    })

    it("Segments/Routes View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role5)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role5.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.visit(authoring.configurations.pageUrls.segments)
        cy.contains("button", "Create Segment").should("not.exist")
        cy.contains('div', "Expand All Segments Filters").should("exist")
        cy.get(authoring.configurations.segments.deleteIcon).should("not.exist")
        cy.get(authoring.configurations.segments.cloneSegments).should("not.exist")
        cy.get(authoring.configurations.segments.editSegments).should("not.exist")
        cy.get(authoring.common.orgSearch).should("exist")

        cy.visit(authoring.configurations.pageUrls.routes)
        cy.contains("button", "Create Route").should("not.exist")
        cy.get(authoring.configurations.routes.analytics).should("not.exist")
        cy.get(authoring.configurations.routes.editRoutes).should("not.exist")
        cy.get(authoring.configurations.routes.deleteIcon).should("not.exist")
        cy.get(authoring.configurations.routes.copyClipboard).should("exist")
        cy.contains("div", "Fallback Destination:").next().click()
        cy.get(authoring.configurations.routes.editMaping).should("not.exist")
        cy.contains("button", "Add Mapping").should("not.exist")
        cy.get(authoring.common.orgSearch).should("exist")

    })

    it("Track Labels View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role6)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role6.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Track Labels").should("exist").click()
        cy.contains("button", "Add").should("not.exist")
        cy.contains('div', "Name").should("exist")
        cy.get(authoring.common.editIcon).should("not.exist")
        cy.get(authoring.common.deleteIcon).should("not.exist")

    })

    it("Widgets View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role7)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role7.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.contentLibrary.pageUrl)
        cy.get("#configurations").should("exist").click()
        cy.contains("a", "Widgets").should("exist").click()
        cy.contains("button", "Add Widget").should("not.exist")
        cy.get(authoring.settings.viewOnlySettingsLocators.tableContainer).should("exist")
        cy.contains("span", "DoNotDelete").should("exist").click()
        cy.contains("h5", "Widget Name").should("exist").click()
        cy.get(authoring.settings.viewOnlySettingsLocators.nameInput).should("not.exist")
        cy.get(authoring.configurations.widgets.deleteIcon).should("not.exist")

    })


})
