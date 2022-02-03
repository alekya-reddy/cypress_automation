import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "CI Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role1 = {
    roleName: "Custom",
    imageLibExtCodeAccProtectionAccess: false,
    imageLibExtCodeAccProtectionView:true
}

const role2 = {
    roleName: "Custom",
    contentTagsCreateEditView: false,
    contentTagsView:true
}

const role3 = {
    roleName: "Custom",
    userExperienceSettingsCreateEditView: false,
    userExperienceSettingsCreateEditViewPermission:true
}

const role4 = {
    roleName: "Custom",
    webhooksVisitorActivityCRUD: false,
    webhooksVisitorActivityView:true
}

const role5 = {
    roleName: "Custom",
    campaignToolsSettingsCRUD: false,
    campaignToolsSettingsView:true
}

const role6 = {
    roleName: "Custom",
    trackLabelsCRUD: false,
    trackLabelsView:true
}

const role7 = {
    roleName: "Custom",
    vexSettingsCRUD: false,
    vexSettingsView:true
}

describe("View Only Permissions", () => {

    it("Settings View Only Permissions", () => {
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
           cy.get('div[style*="background-image"]').click()
           cy.contains("h5", "Image Name").should("exist")
           cy.contains("h5", "Image Name").next().click()
           cy.get('textarea[name="name"]').should("not.exist")
           cy.contains("h5", "Alt Text").should("exist")
           cy.contains("h5", "Alt Text").next().click()
           cy.get('textarea[name="altText"]').should("not.exist")
           cy.get('i[title="delete"]').should("not.exist")

           cy.get("#configurations").should("exist").click()
          
           cy.contains("a", "External Code").should("exist").click()
           cy.contains("button", "Add External Code").should("not.exist")
           cy.get(authoring.common.pageBody).should("exist")
           cy.contains('div', "Body Organization Settings").click()

           cy.contains("h5", "External Code Name").should("exist")
           cy.contains("h5", "External Code Name").click()
           cy.get('input[name="name"]').should("not.exist")

           cy.contains("h5", "Language Descriptions").click()
           cy.contains("button", "Close").click()

           cy.contains("h5", "Code Snippet").click()
           cy.get(authoring.common.modal).should("exist")
           cy.contains("button", "Close").should("exist").click()

           cy.contains("h5", "Location").should("exist")
           authoring.common.togglemethod(authoring.configurations.externalCode.globalToggleEnabled)
           authoring.common.togglemethod(authoring.configurations.externalCode.thirdPartyCookieToggle)
           cy.get('i[title="Delete External Code"]').should("not.exist")

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
           cy.get('i[title="Delete Segment"]').should("not.exist")
           cy.get('i[title="Edit Segment"]').should("not.exist")


    })

    it("Settings View Only Permissions", () => {
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
           cy.get('svg[data-icon="setting"]').should("not.exist")
           cy.contains("button", "Add ").should("not.exist")
           cy.contains("a", "Business Units").should("exist").click()
           cy.contains("button", "Add ").should("not.exist")
           cy.get('div[data-qa-hook="page-body"]>div>div').should("exist")
           cy.contains("a", "Personas").should("exist").click()
           cy.contains("button", "Add ").should("not.exist")
           cy.get('div[data-qa-hook="page-body"]>div>div').should("exist")
           cy.contains("a", "Industries").should("exist").click()
           cy.contains("button", "Add ").should("not.exist")
           cy.get('div[data-qa-hook="page-body"]>div>div').should("exist")
           cy.contains("a", "Content Types").should("exist").click()
           cy.contains("button", "Add ").should("not.exist")
           cy.get('div[data-qa-hook="page-body"]>div>div').should("exist")

     })

     it("Settings View Only Permissions", () => {
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
           cy.wait(4000)
           cy.contains("button", "Add Appearance").should("not.exist")
           cy.get(authoring.common.editIcon).should("not.exist")
           cy.get(authoring.common.deleteIcon).should("not.exist")
           cy.contains("div", "+ Add Appearance").should("not.exist")
           cy.get('div[data-qa-hook="page-preview"]').should("exist")
           cy.contains("button", "Save General Settings").should("not.exist")
           cy.contains("button", "Reset Settings").should("not.exist")
           cy.get('i[title="Select a thumbnail"]').should("not.exist")
           cy.contains("a", "Header").should("exist").click()
           cy.get('span[class="Select-value-label"]').should("exist").click()
           cy.get(authoring.common.popover).should("not.exist")

           cy.get('span[id="titleColor"]').should("exist").click()
           cy.get(authoring.common.popover).should("not.exist")
           authoring.common.togglemethod('div[data-qa-hook="dynamicLogo"]')
           authoring.common.togglemethod('div[data-qa-hook="checkbox"]') 
           cy.contains("a", "Virtual Event").should("exist").click()
           cy.get('input[name="cardCornerRadius"]').invoke('attr', 'value').then(val => {
           expect(val).to.equal('5')
        })
  })    

  it("Settings View Only Permissions", () => {
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
       cy.contains("a", "Links & Sharing").should("exist").click()
       cy.get(authoring.common.editIcon).should("not.exist")
       cy.get(authoring.common.deleteIcon).should("not.exist")
       cy.contains("div", "+ Add Configuration").should("not.exist")
       cy.get('div[data-qa-hook="page-preview"]').should("exist")
       cy.get(authoring.common.orgSave).should("not.exist")
       cy.get('input[name="emailMessage"]').should("exist")

       cy.get('label[for="twitterEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")
       cy.get('label[for="linkedinEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")
       cy.get('label[for="facebookEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")
       cy.get('label[for="emailEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")
       cy.get('label[for="likeEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")
       cy.get('label[for="downloadEnabled"]').should("exist").click({force: true})
       cy.get('div[class*="Checkbox__checkbox-container--unchecked"]').should("not.exist")

  }) 

  it("Settings View Only Permissions", () => {
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
       cy.get('div[class*="Table__table-container"]').should("exist")
       cy.contains('div', "Automation").should("exist").click()
       cy.contains("h5", "Form Name").click()
       cy.get('input[id="name"]').should("not.exist")
       authoring.common.togglemethod('div[data-qa-hook="enableCookieConsentMessage"]')
       cy.contains("h5", "Form Preview").should("exist")
       cy.contains("h3", "Fill This Out to Continue").should("exist").click()
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('input[id="captureFirstName"]').should("exist").click({force: true})
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('input[id="captureLastName"]').should("exist").click({force: true})
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('input[id="captureTitle"]').should("exist").click({force: true})
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('input[id="captureCompany"]').should("exist").click({force: true})
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('input[id="captureLastName"]').should("exist").click({force: true})
       cy.get(authoring.common.popover).should("not.exist")

       cy.contains("button", "Preview Form").should("exist")
       cy.get('i[title="Delete form"]').should("not.exist")

  })

  it("Settings View Only Permissions", () => {
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
       cy.contains("a", "CTAs").should("exist").click()
       cy.contains("button", "Add CTA").should("not.exist")
       cy.get('div[class*="Table__table-container"]').should("exist")
       cy.contains('div', "Form CTA").should("exist").click()
       cy.get('div[data-qa-hook="preview-section-cta-name"]').should("exist").click()
       cy.get('input[id="name"]').should("not.exist")
       cy.get('div[data-qa-hook="preview-section-button-label"]').should("exist").click()
       cy.get('input[id="label"]').should("not.exist")
       cy.get('div[data-qa-hook="preview-section-cta-name"]').should("exist").click()
       cy.get('input[id="name"]').should("not.exist")
       cy.contains("h5", "Type").should("exist").click()
       cy.get(authoring.common.popover).should("not.exist")
       cy.contains("h5", "Destination").should("exist").click()
       cy.get(authoring.common.popover).should("not.exist")
       cy.get('i[title="Delete CTA"]').should("not.exist")     

  })

  it("Settings View Only Permissions", () => {
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
       cy.get('div[class*="Table__table-container"]').should("exist")
       cy.contains('div', "Elq Capture Form").should("exist").click()
       cy.contains("h5", "Webhook Name").should("exist").click()
       cy.get('input[id="name"]').should("not.exist")
       authoring.common.togglemethod('div[data-qa-hook="enabled"]')
       cy.contains("h5", "Webhook URL").should("exist").click()
       cy.get('input[id="url"]').should("not.exist")
       cy.contains("h5", "Response Content Type").should("exist").click()
       cy.get('div[class="Select-value"]').should("not.exist")
       cy.contains("h5", "Event Type").should("exist").click()
       cy.get('div[data-qa-hook="checkbox"]').should("not.exist")
       cy.contains("h5", "Event Fields").should("exist").click()
       cy.contains('button', "Close").should("exist").click()
       cy.contains("h5", "Custom Fields").should("exist").click()
       cy.contains('button', "Close").should("exist").click()
       cy.contains("h5", "Fire for Known Visitors only").should("exist")
       cy.contains("h5", "Fire for Invalid Email Domains").should("exist")
       cy.contains("h5", "Custom Delimiter for Multiple Value Fields").should("exist").click()
       cy.get('input[id="listFieldDelimiter"]').should("not.exist")
       cy.contains("div", "View Logs").should("exist")
       cy.get('i[title="Delete CTA"]').should("not.exist")
  
       cy.get("#configurations").should("exist").click()
       cy.contains("a", "Visitors Activities").should("exist").click()
       cy.contains("button", "Add Activity").should("not.exist")
       cy.get('div[class*="Table__table-container"]').should("exist")
       cy.contains('div', "Engagement Score").should("exist").click()
       cy.contains("h5", "Activity Name").should("exist")
       cy.contains("h5", "Status").should("exist")
       cy.contains("h5", "Published At").should("exist")
       cy.contains("h5", "Activity").should("exist")
       cy.contains("button", "Archive").should("not.exist")
    
  })

  it("Settings View Only Permissions", () => {
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
       cy.get("#configurations").should("exist").click()
       cy.contains("a", "Segments").should("exist").click()
       cy.contains("button", "Create Segment").should("not.exist")
       cy.contains('div', "Expand All Segments Filters").should("exist")
       cy.get('i[title="Edit Segment"]').should("not.exist") 
       cy.get('i[title="Clone Segment"]').should("not.exist") 
       cy.get('i[title="Delete Segment"]').should("not.exist") 
       cy.get(authoring.common.orgSearch).should("exist")

       cy.get("#configurations").should("exist").click()
       cy.contains("a", "Routes").should("exist").click()
       cy.contains("button", "Create Route").should("not.exist")
       cy.get('i[title="Route Analytics"]').should("not.exist")
       cy.get('i[title="Edit Route"]').should("not.exist")
       cy.get('i[title="Delete Route"]').should("not.exist")
       cy.get('i[title="Copy to Clipboard"]').should("exist")
       cy.contains("div", "Fallback Destination:").next().click()
       cy.get('i[title="Edit Mapping"]').should("not.exist")
       cy.contains("button", "Add Mapping").should("not.exist")
       cy.get(authoring.common.orgSearch).should("exist")
       //cy.get('div[draggable="true"]').should("not.exist")

  })

  it("Settings View Only Permissions", () => {
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
       cy.get('i[title="edit"]').should("not.exist")
       cy.get('i[title="delete"]').should("not.exist")
      
  })
       
  it("Settings View Only Permissions", () => {
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
       cy.get('div[class*="Table__table-container"]').should("exist")
       cy.contains("span", "DoNotDelete").should("exist").click()
       cy.contains("h5", "Widget Name").should("exist").click()
       cy.get('input[name="name"]').should("not.exist")
       cy.get('i[title="Delete Widget"]').should("not.exist")

  })
       

})