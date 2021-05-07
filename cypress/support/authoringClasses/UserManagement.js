import { Common } from "./Common";

export class UserManagement extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.userList = {
            pageURL: `${this.baseUrl}/authoring/content-library/settings/user-management/user-list`,
            pageTitle: "User Management"
        };
        this.userRoles = {
            pageURL: `${this.baseUrl}/authoring/content-library/settings/user-management/user-roles`,
            roleName: "#roleName",
            deleteRoleIcon: 'i[title="Delete Role"]'
        }
        this.generalSettings = {
            imageLibExtCodeAccProtection: "#img_lib_ext_code_access_proc-create-edit-delete",
            contentTagsCreateEditView: "#content_tags-create-edit-delete",
            contentTagsView: "#content_tags-view"
        }
        this.dataConfigurationSettings = {
            webhooksVisitorActivityCRUD: "#data_configuration_settings-create-edit-delete"
        }
        this.userRolePreview = 'div[data-qa-hook="preview-section-user-role"]'
        this.pageTitle = "User Management"
        this.userExperienceSettingsCreateEditView = "#user_experience_settings-create-edit-delete"
        this.campaignTools = {
            campaignToolsModuleCRUD: "#campaign_tools_module_access-create-edit-delete",
            campaignToolsSettingsCRUD: "#campaign_tools_settings-create-edit-delete",
            trackLabelsCRUD: "#campaign_tools_track_labels-create-edit-delete",
            trackLabelsView: "#campaign_tools_track_labels-view" 
        }
        this.vex = {
            vexSettingsCRUD: "#virtual_event_settings-create-edit-delete",
            vexModuleCRUD: "#virtual_events_module_access-create-edit-delete"
        }
        this.contentLibrary = {
            contentLibraryInsightsView: "#content_library_insights-view",
            contentLibraryFeatureAccessCRUD: "#content_library_feature_access-create-edit-delete"
        }
        this.administrativeControls = {
            organizationSettingsCRUD: "#org_settings-create-edit-delete",
            userManagementCRUD: "#user_management-create-edit-delete"
        }

    }

    visitUserListPage(){
        cy.visit(this.userList.pageURL);
    }
    visitUserRolesPage(){
        cy.visit(this.userRoles.pageURL);
    }

    clickUserRole(userRole){
        cy.get(this.pageSidebar).within(() => {
            cy.containsExact("div", userRole, {timeout: 10000}).should("exist").click()
        })
    }

    clickAddUserRole(){
        cy.get(this.pageSidebar).within(() => {
            cy.containsExact("div", "+ Add User Role", {timeout: 10000}).click()
        })
    }

    addNewUserRole(userRole, verify ){
        cy.visit(this.userRoles.pageURL)
        cy.wait(2000)
        cy.waitFor({element: this.pageSidebar, to: "exist", wait: 10000})
        cy.ifNoElementWithExactTextExists("div", userRole, 10000, ()=>{
            this.clickAddUserRole()
            cy.contains(this.modal, "Add User Role").within(()=>{
                cy.get(this.userRoles.roleName).clear().type(userRole)        
                cy.contains("button", "Add User Role").click()
            })  
            if (verify !== false) {
                cy.waitFor({element: this.modal, to: "not.exist"})
                cy.get(this.pageSidebar).within(() => {
                    cy.containsExact("div", userRole, {timeout: 5000}).should("exist")
                })
            }
        })
    }

    configureUserRole(options) {
        const{
            roleName, 
            imageLibExtCodeAccProtectionAccess, 
            contentTagsCreateEditView, 
            userExperienceSettingsCreateEditView, 
            dataConfigurationSettings,
            trackLabelsView,
            trackLabelsCRUD,
            campaignToolsSettingsCRUD,
            vexSettingsCRUD,
            vexModuleCRUD,
            campaignToolsModuleCRUD,
            contentLibraryInsightsView,
            contentLibraryFeatureAccessCRUD,
            userManagementCRUD,
            organizationSettingsCRUD
        } = options

        this.clickUserRole(roleName)
        
        if(imageLibExtCodeAccProtectionAccess == true || imageLibExtCodeAccProtectionAccess == false){
            cy.get(this.generalSettings.imageLibExtCodeAccProtection).invoke("attr", "class").then(checkboxClass => {
                if(imageLibExtCodeAccProtectionAccess && checkboxClass.includes("checkbox-container--unchecked") || !imageLibExtCodeAccProtectionAccess && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.generalSettings.imageLibExtCodeAccProtection).click()
                }       
            })
        } 
    
        if(contentTagsCreateEditView == true || contentTagsCreateEditView == false){
            cy.get(this.generalSettings.contentTagsCreateEditView).invoke("attr", "class").then(checkboxClass => {
                if(contentTagsCreateEditView && checkboxClass.includes("checkbox-container--unchecked") || !contentTagsCreateEditView && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.generalSettings.contentTagsCreateEditView).click()
                }       
            })
        }
   
        if(userExperienceSettingsCreateEditView == true || userExperienceSettingsCreateEditView == false){
            cy.get(this.userExperienceSettingsCreateEditView).invoke("attr", "class").then(checkboxClass => {
                if(userExperienceSettingsCreateEditView && checkboxClass.includes("checkbox-container--unchecked") || !userExperienceSettingsCreateEditView && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.userExperienceSettingsCreateEditView).click()
                }       
            })
        }

        if(dataConfigurationSettings == true || dataConfigurationSettings == false){
            cy.get(this.dataConfigurationSettings.webhooksVisitorActivityCRUD).invoke("attr", "class").then(checkboxClass => {
                if(dataConfigurationSettings && checkboxClass.includes("checkbox-container--unchecked") || !dataConfigurationSettings && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.dataConfigurationSettings.webhooksVisitorActivityCRUD).click()
                }       
            })
        }

        if(trackLabelsView == true || trackLabelsView == false){
            cy.get(this.campaignTools.trackLabelsView).invoke("attr", "class").then(checkboxClass => {
                if(trackLabelsView && checkboxClass.includes("checkbox-container--unchecked") || !trackLabelsView && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.campaignTools.trackLabelsView).click()
                }       
            })
        }

        if(trackLabelsCRUD == true || trackLabelsCRUD == false){
            cy.get(this.campaignTools.trackLabelsCRUD).invoke("attr", "class").then(checkboxClass => {
                if(trackLabelsCRUD && checkboxClass.includes("checkbox-container--unchecked") || !trackLabelsCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.campaignTools.trackLabelsCRUD).click()
                }       
            })
        }

        if(campaignToolsSettingsCRUD == true || campaignToolsSettingsCRUD == false){
            cy.get(this.campaignTools.campaignToolsSettingsCRUD).invoke("attr", "class").then(checkboxClass => {
                if(campaignToolsSettingsCRUD && checkboxClass.includes("checkbox-container--unchecked") || !campaignToolsSettingsCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.campaignTools.campaignToolsSettingsCRUD).click()
                }       
            })
        }

        if(vexSettingsCRUD == true || vexSettingsCRUD == false){
            cy.get(this.vex.vexSettingsCRUD).invoke("attr", "class").then(checkboxClass => {
                if(vexSettingsCRUD && checkboxClass.includes("checkbox-container--unchecked") || !vexSettingsCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.vex.vexSettingsCRUD).click()
                }       
            })
        }
        if(vexModuleCRUD == true || vexModuleCRUD == false){
            cy.get(this.vex.vexModuleCRUD).invoke("attr", "class").then(checkboxClass => {
                if(vexModuleCRUD && checkboxClass.includes("checkbox-container--unchecked") || !vexModuleCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.vex.vexModuleCRUD).click()
                }       
            })
        }

        if(campaignToolsModuleCRUD == true || campaignToolsModuleCRUD == false){
            cy.get(this.campaignTools.campaignToolsModuleCRUD).invoke("attr", "class").then(checkboxClass => {
                if(campaignToolsModuleCRUD && checkboxClass.includes("checkbox-container--unchecked") || !campaignToolsModuleCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.campaignTools.campaignToolsModuleCRUD).click()
                }       
            })
        }

        if(contentLibraryInsightsView == true || contentLibraryInsightsView == false){
            cy.get(this.contentLibrary.contentLibraryInsightsView).invoke("attr", "class").then(checkboxClass => {
                if(contentLibraryInsightsView && checkboxClass.includes("checkbox-container--unchecked") || !contentLibraryInsightsView && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.contentLibrary.contentLibraryInsightsView).click()
                }       
            })
        }

        if(contentLibraryFeatureAccessCRUD == true || contentLibraryFeatureAccessCRUD == false){
            cy.get(this.contentLibrary.contentLibraryFeatureAccessCRUD).invoke("attr", "class").then(checkboxClass => {
                if(contentLibraryFeatureAccessCRUD && checkboxClass.includes("checkbox-container--unchecked") || !contentLibraryFeatureAccessCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.contentLibrary.contentLibraryFeatureAccessCRUD).click()
                }       
            })
        }

        if(userManagementCRUD == true || userManagementCRUD == false){
            cy.get(this.administrativeControls.userManagementCRUD).invoke("attr", "class").then(checkboxClass => {
                if(userManagementCRUD && checkboxClass.includes("checkbox-container--unchecked") || !userManagementCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.administrativeControls.userManagementCRUD).click()
                }       
            })
        }

        if(organizationSettingsCRUD == true || organizationSettingsCRUD == false){
            cy.get(this.administrativeControls.organizationSettingsCRUD).invoke("attr", "class").then(checkboxClass => {
                if(organizationSettingsCRUD && checkboxClass.includes("checkbox-container--unchecked") || !organizationSettingsCRUD && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.administrativeControls.organizationSettingsCRUD).click()
                }       
            })
        }

        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
    }


    deleteUserRole(userRole, verify){
        cy.visit(this.userRoles.pageURL)
        cy.waitFor({element: this.pageSidebar, to: "exist", wait: 10000})
        cy.get(this.pageSidebar).within(sidebar => {
            if (sidebar.find(`div:contains("${userRole}")`).length > 0, {timeout: 5000}) {
                cy.containsExact("div", userRole).siblings("div").within(() => {
                    cy.get(this.userRoles.deleteRoleIcon).click({force: true})
                })
                cy.do(() => {
                    Cypress.$("button:contains('Delete Role')").click()
                })
            }
            if (verify !== false) {
                cy.containsExact("div", userRole).should("not.exist")
            }
        })
    }

    assignUserRoles(userName, list) {
        const roles = [list].flat()
        // select user
        cy.get(this.pageBody).within(() => {
            cy.contains("span", userName, {timeout: 5000}).click()
        })
        // remove all existing roles
        cy.get(this.userRolePreview).within(()=>{
            cy.contains("h5", "User Role").click()
            cy.get(this.dropdown.box).within( box => {
                for (let i = 0; i < box.find(this.dropdown.selectedValue).length; i++){
                    cy.get("span[class='Select-value-icon']").first().click()
                }

                //assign new roles
                roles.forEach(role => {
                    cy.get(this.dropdown.input).type(role + "\n", {force: true})
                })
            })
            cy.contains("button", "Save").click()
        })  

    }

}

