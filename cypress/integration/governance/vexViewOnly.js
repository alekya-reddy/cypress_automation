import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "CI Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Custom",
    vexModuleCRUD: false,
    vexView: true,
    vexAnalysticsView: true
}

describe("View Only Permissions", () => {

    it("Vex View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        authoring.vex.visit()
        cy.contains('div', "Added By").should('be.visible')
        cy.get(authoring.common.orgSearch).should("exist")
        cy.get(authoring.vex.addEventButton).should("not.exist")
        cy.contains('span', "Add Folder").should("not.exist")
        cy.contains('span', "1234").should("exist").click()
        cy.get(authoring.common.pageBody).should("exist")
        cy.contains('span', "Root").should("exist").click()
        cy.contains(authoring.vex.editfolder).should("not.exist")
        cy.contains('i[title="Delete Folder"]').should("not.exist")
        cy.get(authoring.common.pageBody).within(() => {
            cy.contains(authoring.vex.editfolder).should("not.exist")
        })

        cy.contains('span', "Name").should("exist")
        cy.contains('span', "Added By").should("exist")
        cy.contains('span', "Updated").should("exist")
        cy.contains('span', "Number of Sessions").should("exist")
        cy.contains('th', "Folder").should("exist")
        cy.contains('span', "Delete").should("not.exist")

        cy.contains('a', "User Roles").should("exist").click()
        cy.contains('h1', "User Roles").should("exist")
        cy.get(authoring.vex.cloneEventButton).should("not.exist")
        cy.get(authoring.vex.deleteEvent).should("not.exist")
        cy.contains('a', 'Preview Event').should("not.exist")
        cy.get(authoring.vex.copyVex).should("not.exist")
        cy.get(authoring.vex.shareIcon).should("not.exist")
        cy.wait(2000)
        cy.get(authoring.vex.startTimeInput).click({ force: true })
        cy.get(authoring.vex.inputModal).should("not.exist")
        cy.get(authoring.vex.endTimeInput).click({ force: true })
        cy.get(authoring.vex.inputModal).should("not.exist")
        cy.get('span[title="(GMT-05:00) Eastern Time (US & Canada)"]').click({ force: true })
        cy.get(authoring.vex.inputModal).should("not.exist")

        authoring.common.togglemethod(authoring.vex.externalIDInput)

        cy.get('span[title="None (Registration Not Required)"]').click()
        cy.get(authoring.vex.inputModal).should("not.exist")
        cy.get('span[title="English"]').click()
        cy.get(authoring.vex.inputModal).should("not.exist")
        cy.get('span[title="No Index, Follow"]').click()
        cy.get(authoring.vex.inputModal).should("not.exist")

        authoring.common.togglemethod(authoring.vex.pageTitle)
        authoring.common.togglemethod(authoring.vex.pageDescription)
        authoring.common.togglemethod(authoring.vex.cookieConsentCheckbox)

        cy.contains('span', 'Change Image').should("not.exist")
        cy.contains('span', 'Clear').should("not.exist")
        cy.contains('label', 'Thumbnail').should("exist")
        cy.contains('span', 'Enable Cookie Consent').should("exist")

        cy.contains('span', 'Show Description on Session Cards').should("exist")
        authoring.common.togglemethod(authoring.vex.sessionDescriptionCheckbox)

        cy.contains('label', "Protection Type").should("exist")
        cy.get('span[title="None"]').click()
        cy.get(authoring.vex.dropDownModal).should("not.exist")
        cy.contains('label', "Groups").should("exist")
        cy.contains('span', "Select...").eq(0).click()
        cy.get(authoring.vex.dropDownModal).should("not.exist")
        cy.contains('label', "Disallow Groups").should("exist")
        cy.contains('span', "Select...").eq(0).click()
        cy.get(authoring.vex.dropDownModal).should("not.exist")
        cy.contains('button', "Save").should("not.exist")
        cy.contains('label', "Reset").should("not.exist")

        cy.contains('a', "Sessions").should("exist").click()
        cy.contains('button', "Add Session").should("not.exist")
        cy.contains('span', "Name").should("exist")
        cy.contains('span', "URL").should("not.exist")
        cy.get(authoring.vex.copyToClipboard).should("not.exist")
        cy.get(authoring.vex.shareIcon).should("not.exist")
        cy.contains('span', "Visibility").should("exist")
        cy.contains('span', "Start Time").should("exist")
        cy.contains('span', "External ID").should("exist")
        cy.contains('span', "Created Date").should("exist")
        cy.contains('th', "Supplemental Content Assets").should("exist")
        cy.contains('span', "Language").should("exist")
        cy.contains('span', "Topics").should("exist")
        cy.contains('span', "Personas").should("exist")
        cy.contains('span', "Industries").should("exist")
        cy.contains('span', "Business Units").should("exist")
        cy.contains('span', "Funnel Stages").should("exist")
        cy.contains('span', "Delete").should("not.exist")
        cy.get(authoring.vex.pageNumber).should("exist")
        cy.contains('a', "Configure").should("exist").click()

        cy.contains('label', "Thumbnail").should("exist")

        cy.get(authoring.vex.radioButtonclick).invoke('attr', 'class').then(val => {
            expect(val).to.equal(authoring.vex.radioButtonDisable)
        })

        cy.contains('label', "Hero Banner Layout").should("exist")
        
        //will remove it once view only bug get fixed
        //authoring.common.togglemethod('button[role="switch"]')
        authoring.common.togglemethod(authoring.vex.sessionSlugInput)
        authoring.common.togglemethod(authoring.vex.engagementThresholdInput)

        cy.contains('’span', "Select On Demand Video").should("not.exist")

        cy.contains('label', "Protection Type").should("exist")
        cy.contains('label', "Groups").should("exist")
        cy.contains('span', "Select...").eq(0).click()
        cy.get(authoring.vex.dropDown).should("not.exist")

        cy.contains('label', "Disallow Groups").should("exist").click()
        cy.get(authoring.vex.dropDown).should("not.exist")
        cy.contains('button', "Save").should("not.exist")
        cy.contains('label', "Reset").should("not.exist")
        cy.contains('button', "Add Content").should("not.exist")
        cy.contains('a', "Widgets").should("exist").click()
        cy.contains('span', "+ Add Widgets").should("not.exist")
        cy.contains('span', "Configure").should("not.exist")
        cy.contains('span', " Remove ").should("not.exist")

        authoring.vex.visit()
        cy.contains('a', "virtual_event").should("exist").click()
        cy.contains('a', "Appearance Setup").should("exist").click()
        cy.get('span[title="Default"]').should("exist").click()
        cy.get(authoring.vex.dropDown).should("not.exist")
        cy.contains('label', "Hero Image Override").should("exist")
        cy.contains('span', "Add Image").should("not.exist")
        cy.get(authoring.vex.appearance.heroHeightInput).invoke('attr', 'value').then(val => {
            expect(val).to.be.equal('250px')
        })
        cy.contains('span', "Save").should("not.exist")
        cy.contains('span', "Reset").should("not.exist")

        cy.get(authoring.vex.headerTitleLocator).should('be.visible').click()
        cy.get(authoring.vex.headerTitleInput).should("not.exist")
        cy.get(authoring.vex.heroSubtitleLocatorDefault).should('be.visible').click()
        cy.get(authoring.vex.headersubTitleInput).should("not.exist")
        cy.get(authoring.vex.contentTitleDefault).should('be.visible').click()
        cy.get(authoring.vex.contentTitleInput).should("not.exist")
        cy.get(authoring.vex.contentDescription).should('be.visible').click()
        cy.get(authoring.vex.contentDescriInput).should("not.exist")


        cy.contains('a', "Session Groups").should("exist").click()
        cy.contains('span', "Add Group").should("not.exist")
        cy.contains('span', "group1").should("exist")
        cy.contains('span', "Rename").should("not.exist")
        cy.contains('span', "Manage Sessions").should("not.exist")
        cy.contains('span', "Remove").should("not.exist")
        cy.contains('span', "Add Sessions to Group").should("not.exist")

        cy.contains('a', "Landing Pages").should("exist").click()
        cy.contains('span', "Add Page").should("not.exist")
        cy.contains('th', "Name").should("exist")
        cy.contains('th', "Visibility").should("exist")
        cy.contains('th', "Slug").should("exist")
        cy.contains('th', "URL").should("not.exist")
        cy.contains('th', "Page Title").should("exist")
        cy.contains('th', "Thumbnail").should("exist")
        cy.contains('th', "Page Description").should("exist")
        cy.contains('th', "External ID").should("exist")
        cy.contains('th', "Home Page").should("exist")
        cy.contains('span', "Modify Page").should("not.exist")
        cy.contains('span', "Edit").should("not.exist")
        cy.contains('span', "Remove").should("not.exist")
        cy.contains('span', "Clone").should("not.exist")

        cy.contains('a', "Navigation").should("exist").click()
        cy.contains('span', "Add Navigation Item").should("not.exist")
        cy.get(authoring.vex.navItemRemove).should("not.exist")
        cy.get(authoring.vex.navItemEdit).should("not.exist")
        cy.get('div[draggable="true"]').should("not.exist")

        cy.contains('a', "Search & Filter").should("exist").click()
        cy.contains('div', "Search").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Topic").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Business Unit").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Persona").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Industry").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Availability").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Funnel Stage").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")
        cy.contains('div', "Language").should("exist")
        cy.get(authoring.vex.serachFilterToggle).next().click()
        cy.get(authoring.vex.toggleChecked).should("not.exist")

        cy.contains('a', "Event Blacklist").should("exist").click()
        cy.contains('span', "Add Email").should("not.exist")

        cy.contains('a', "Analytics").should("exist").click()
        cy.contains('div', "Event Session Overview").should("exist")
        cy.contains('div', "Registrants & Attendees").should("exist")
        cy.contains('div', "Data Tables").should("exist")
        cy.contains('div', "Prospects").should("exist")
   
    })

})

