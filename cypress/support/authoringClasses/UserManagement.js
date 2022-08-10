import { Common } from "./Common";

export class UserManagement extends Common {
    constructor(env, org, tld, userName, password, baseUrl) {
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
        this.userRolePreview = 'div[data-qa-hook="preview-section-user-role"]'
        this.pageTitle = "User Management"
        this.userExperienceSettingsCreateEditView = "#user_experience_settings-create-edit-delete",
            this.userExperienceSettingsCreateEditViewPermission = "#user_experience_settings-view",
            this.campaignTools = {
                campaignToolsModuleCRUD: "#campaign_tools_module_access-create-edit-delete",
                campaignToolsSettingsCRUD: "#campaign_tools_settings-create-edit-delete",
                campaignToolsSettingsView: "#campaign_tools_settings-view",
                trackLabelsCRUD: "#campaign_tools_track_labels-create-edit-delete",
                trackLabelsView: "#campaign_tools_track_labels-view",
                campaignsToolsView: "#campaign_tools_module_access-view"
            }
        this.vex = {
            vexSettingsCRUD: "#virtual_event_settings-create-edit-delete",
            vexSettingsView: "#virtual_event_settings-view",
            vexModuleCRUD: "#virtual_events_module_access-create-edit-delete",
            vexAnalysticsView: "#path_analytics_virtual_events-view",
            vexView: "#virtual_events_module_access-view"

        }
        this.websiteTools = {
            websiteToolsModuleCRUD: "#website_tools_module_access-create-edit-delete",
            websiteToolsView: "#website_tools_module_access-view",
            WebsiteToolsAnalysticsView: "#path_analytics_website_tools-view"

        }
        this.contentIntelligence = {
            contentconfigurationsCRUD: "#content_intelligence_content_configurations-create-edit-delete",
            contentstrategyCRUD: "#content_intelligence_content_strategy-create-edit-delete",
            contentConfigurationView: "#content_intelligence_content_configurations-view",
            contentStratergyView: "#content_intelligence_content_strategy-view"
        }
        this.contentLibrary = {
            contentLibraryInsightsView: "#content_library_insights-view",
            contentLibraryFeatureAccessCRUD: "#content_library_feature_access-create-edit-delete",
            contentLibraryView: "#content_library_feature_access-view"
        }
        this.administrativeControls = {
            organizationSettingsCRUD: "#org_settings-create-edit-delete",
            userManagementCRUD: "#user_management-create-edit-delete",
            redirectRulesCRUD: "#redirect_rules-create-edit-delete"
        }

    }

    visitUserListPage() {
        cy.visit(this.userList.pageURL);
    }
    visitUserRolesPage() {
        cy.visit(this.userRoles.pageURL);
    }

    clickUserRole(userRole) {
        cy.get(this.pageSidebar).within(() => {
            cy.containsExact("div", userRole, { timeout: 10000 }).should("exist").click()
        })
    }

    clickAddUserRole() {
        cy.get(this.pageSidebar).within(() => {
            cy.containsExact("div", "+ Add User Role", { timeout: 10000 }).click()
        })
    }

    addNewUserRole(userRole, verify) {
        cy.visit(this.userRoles.pageURL)
        cy.wait(2000)
        cy.waitFor({ element: this.pageSidebar, to: "exist", wait: 10000 })
        cy.ifNoElementWithExactTextExists("div", userRole, 10000, () => {
            this.clickAddUserRole()
            cy.contains(this.modal, "Add User Role").within(() => {
                cy.get(this.userRoles.roleName).clear().type(userRole)
                cy.contains("button", "Add User Role").click()
            })
            if (verify !== false) {
                cy.waitFor({ element: this.modal, to: "not.exist" })
                cy.get(this.pageSidebar).within(() => {
                    cy.containsExact("div", userRole, { timeout: 5000 }).should("exist")
                })
            }
        })
    }

    configureUserRole(options) {
        const {
            roleName,
            imageLibraryCRUD,
            imageLibraryView,
            accessProtectionCRUD,
            accessProtectionView,
            externalCodeCRUD,
            externalCodeView,
            contentTagsCreateEditView,
            contentTagsView,
            personalizationCreateEditView,
            personalizationView,
            linksshareView,
            linksshareCreateEditView,
            formsView,
            formsCRUD,
            cTASView,
            cTASCRUD,
            themesView,
            themesCRUD,
            appearanceCRUD,
            appearanceView,
            languagesView,
            languagesCRUD,
            vexWidgetsView,
            vexWidgetsCRUD,
            webhooksView,
            webhooksCRUD,
            visitorActivityView,
            visitorActivityCRUD,
            userExperienceSettingsCreateEditViewPermission,
            trackLabelsView,
            trackLabelsCRUD,
            campaignToolsSettingsCRUD,
            campaignToolsSettingsView,
            campaignsToolsView,
            vexView,
            vexSettingsCRUD,
            vexSettingsView,
            vexModuleCRUD,
            websiteToolsModuleCRUD,
            websiteToolsView,
            campaignToolsModuleCRUD,
            contentLibraryInsightsView,
            contentLibraryFeatureAccessCRUD,
            contentLibraryView,
            templetedExperiencecCRUD,
            templetedExperiencecView,
            goalsView,
            goalsCRUD,
            revenueIntelligenceView,
            userManagementCRUD,
            userManagementView,
            organizationSettingsCRUD,
            organizationSettingsView,
            redirectRulesCRUD,
            campaignToolsAnalyticsOverviewView,
            campaignToolsAnalyticsAccountView,
            campaignToolsAnalyticsVisitorView,
            campaignToolsAnalyticsContentView,
            campaignToolsAnalyticsReportView,
            campaignToolsAnalyticsLegacyView,
            vexAnalysticsView,
            scheduleReportsView,
            WebsiteToolsAnalysticsOverviewView,
            WebsiteToolsAnalysticsVisitorView,
            WebsiteToolsAnalysticsAccountView,
            WebsiteToolsAnalysticsContentView,
            contentconfigurationsCRUD,
            contentStratergyView,
            contentStratergyCRUD,
            websiteContentLibraryCRUD,
            websiteContentLibraryView,
            contentConfigurationView,
            webhooksVisitorActivityView,

        } = options

        this.clickUserRole(roleName)
        if (imageLibraryCRUD == true || imageLibraryCRUD == false) {
            cy.contains('a', "Platform Settings").click()
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
            cy.get('#image_library-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((imageLibraryCRUD == false && attr.includes("ant-checkbox-checked")) || (imageLibraryCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#image_library-create-edit-delete').click()
                }

            })
        }

        if (imageLibraryView == true || imageLibraryView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#image_library-view').parent().invoke("attr", "class").then((attr) => {
                if ((imageLibraryView == false && attr.includes("ant-checkbox-checked")) || (imageLibraryView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#image_library-view').click()
                }

            })
        }

        if (accessProtectionCRUD == true || accessProtectionCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#access_protection-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((accessProtectionCRUD == false && attr.includes("ant-checkbox-checked")) || (accessProtectionCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#access_protection-create-edit-delete').click()
                }

            })

        }

        if (accessProtectionView == true || accessProtectionView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#access_protection-view').parent().invoke("attr", "class").then((attr) => {
                if ((accessProtectionView == false && attr.includes("ant-checkbox-checked")) || (accessProtectionView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#access_protection-view').click()
                }

            })

        }

        if (externalCodeCRUD == true || externalCodeCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#external_codes-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((externalCodeCRUD == false && attr.includes("ant-checkbox-checked")) || (externalCodeCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#external_codes-create-edit-delete').click()
                }

            })

        }

        if (externalCodeView == true || externalCodeView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#external_codes-view').parent().invoke("attr", "class").then((attr) => {
                if ((externalCodeView == false && attr.includes("ant-checkbox-checked")) || (externalCodeView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#external_codes-view').click()
                }

            })

        }


        if (contentTagsCreateEditView == true || contentTagsCreateEditView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#Content Tags-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((contentTagsCreateEditView == false && attr.includes("ant-checkbox-checked")) || (contentTagsCreateEditView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Content Tags-create-edit-delete').click()
                }

            })

        }

        if (contentTagsView == true || contentTagsView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#Content Tags-view').parent().invoke("attr", "class").then((attr) => {
                if ((contentTagsView == false && attr.includes("ant-checkbox-checked")) || (contentTagsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Content Tags-view').click()
                }

            })

        }

        if (personalizationCreateEditView == true || personalizationCreateEditView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                cy.log(attr + "innn")
                cy.pause()
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#personalization-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((personalizationCreateEditView == false && attr.includes("ant-checkbox-checked")) || (personalizationCreateEditView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#personalization-create-edit-delete').click()
                }
            })
        }

        if (personalizationView == true || personalizationView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "General Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "General Settings").click()
                }
            })
            cy.get('#personalization-view').parent().invoke("attr", "class").then((attr) => {
                if ((personalizationView == false && attr.includes("ant-checkbox-checked")) || (personalizationView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#personalization-view').click()
                }

            })
        }

        if (linksshareView == true || linksshareView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.get('div[class="ant-collapse-header"]').eq(1).click()
            cy.get('#links_and_sharing-view').parent().invoke("attr", "class").then((attr) => {
                if ((linksshareView == false && attr.includes("ant-checkbox-checked")) || (linksshareView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#links_and_sharing-view').click()
                }
            })
        }


        if (linksshareCreateEditView == true || linksshareCreateEditView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#links_and_sharing-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((linksshareCreateEditView == false && attr.includes("ant-checkbox-checked")) || (linksshareCreateEditView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#links_and_sharing-create-edit-delete').click()
                }
            })
        }


        if (formsView == true || formsView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#forms-view').parent().invoke("attr", "class").then((attr) => {
                if ((formsView == false && attr.includes("ant-checkbox-checked")) || (formsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#forms-view').click()
                }
            })
        }

        if (formsCRUD == true || formsCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#forms-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((formsCRUD == false && attr.includes("ant-checkbox-checked")) || (formsCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#forms-create-edit-delete').click()
                }
            })
        }

        if (cTASView == true || cTASView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#ctas-view').parent().invoke("attr", "class").then((attr) => {
                if ((cTASView == false && attr.includes("ant-checkbox-checked")) || (cTASView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#ctas-view').click()
                }
            })
        }

        if (cTASCRUD == true || cTASCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#ctas-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((cTASCRUD == false && attr.includes("ant-checkbox-checked")) || (cTASCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#ctas-create-edit-delete').click()
                }
            })
        }

        if (themesView == true || themesView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#themes-view').parent().invoke("attr", "class").then((attr) => {
                if ((themesView == false && attr.includes("ant-checkbox-checked")) || (themesView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#themes-view').click()
                }
            })
        }


        if (themesCRUD == true || themesCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#themes-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((themesCRUD == false && attr.includes("ant-checkbox-checked")) || (themesCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#themes-create-edit-delete').click()
                }
            })
        }

        if (appearanceView == true || appearanceView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#Appearances-view').parent().invoke("attr", "class").then((attr) => {
                if ((appearanceView == false && attr.includes("ant-checkbox-checked")) || (appearanceView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Appearances-view').click()
                }
            })
        }

        if (appearanceCRUD == true || appearanceCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#Appearances-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((appearanceCRUD == false && attr.includes("ant-checkbox-checked")) || (appearanceCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Appearances-create-edit-delete').click()
                }
            })
        }

        if (languagesCRUD == true || languagesCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#Languages-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((languagesCRUD == false && attr.includes("ant-checkbox-checked")) || (languagesCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Languages-create-edit-delete').click()
                }
            })
        }

        if (languagesView == true || languagesView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "User Experience Settings").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.contains('div', "User Experience Settings").click()
                }
            })
            cy.get('#Languages-view').parent().invoke("attr", "class").then((attr) => {
                if ((languagesView == false && attr.includes("ant-checkbox-checked")) || (languagesView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Languages-view').click()
                }
            })
        }

        if (webhooksView == true || webhooksView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Data Configuration").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(2).click()
                }
            })
            cy.get('#webhooks-view').parent().invoke("attr", "class").then((attr) => {
                if ((webhooksView == false && attr.includes("ant-checkbox-checked")) || (webhooksView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#webhooks-view').click()
                }
            })
        }

        if (webhooksCRUD == true || webhooksCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Data Configuration").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                cy.log("in" + attr)
                cy.pause()
                if (attr == false) {
                    //cy.get('div[class="ant-collapse-item"]').eq(0).click()
                    cy.containsExact('div', "Data Configuration").click()
                }
            })
            cy.pause()
            cy.get('#webhooks-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((webhooksCRUD == false && attr.includes("ant-checkbox-checked")) || (webhooksCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#webhooks-create-edit-delete').click()
                }
            })
        }


        if (visitorActivityView == true || visitorActivityView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Data Configuration").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(2).click()
                }
            })
            cy.get('#visitor_activities-view').parent().invoke("attr", "class").then((attr) => {
                if ((visitorActivityView == false && attr.includes("ant-checkbox-checked")) || (visitorActivityView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#visitor_activities-view').click()
                }
            })
        }


        if (visitorActivityCRUD == true || visitorActivityCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Data Configuration").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(2).click()
                }
            })
            cy.get('#visitor_activities-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((visitorActivityCRUD == false && attr.includes("ant-checkbox-checked")) || (visitorActivityCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#visitor_activities-create-edit-delete').click()
                }
            })
        }

        if (trackLabelsView == true || trackLabelsView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(3).click()
                }
            })

            cy.get('#campaign_tools_track_labels-view').parent().invoke("attr", "class").then((attr) => {
                if ((trackLabelsView == false && attr.includes("ant-checkbox-checked")) || (trackLabelsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#campaign_tools_track_labels-view').click()
                }
            })
        }

        if (trackLabelsCRUD == true || trackLabelsCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(3).click()
                }
            })
            cy.get('#campaign_tools_track_labels-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((trackLabelsCRUD == false && attr.includes("ant-checkbox-checked")) || (trackLabelsCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#campaign_tools_track_labels-create-edit-delete').click()
                }
            })
        }

        if (vexWidgetsCRUD == true || vexWidgetsCRUD == false) {
            cy.contains('a', "Platform Settings").click()
            cy.get('div[class="ant-collapse-header"]').eq(4).click()
            cy.get('#virtual_event_settings-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((vexWidgetsCRUD == false && attr.includes("ant-checkbox-checked")) || (vexWidgetsCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#virtual_event_settings-create-edit-delete').click()
                }
            })
        }

        if (vexWidgetsView == true || vexWidgetsView == false) {
            cy.contains('a', "Platform Settings").click()
            cy.get('div[class="ant-collapse-header"]').eq(4).click()
            cy.get('#virtual_event_settings-view').parent().invoke("attr", "class").then((attr) => {
                if ((vexWidgetsView == false && attr.includes("ant-checkbox-checked")) || (vexWidgetsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#virtual_event_settings-view').click()
                }
            })
        }

        if (campaignsToolsView == true || campaignsToolsView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.contains('div', "Campaign Tools").click()
            cy.containsExact('div', 'Module Access').parent('div').within(() => {
                cy.get('#Module Access-view').parent().invoke("attr", "class").then((attr) => {
                    if ((campaignsToolsView == false && attr.includes("ant-checkbox-checked")) || (campaignsToolsView == true && !attr.includes("ant-checkbox-checked"))) {
                        cy.get('#Module Access-view').click()
                    }
                })
            })
        }


        if (vexModuleCRUD == true || vexModuleCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(3).click()
            cy.get('#virtual_events_module_access-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((vexModuleCRUD == false && attr.includes("ant-checkbox-checked")) || (vexModuleCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#virtual_events_module_access-create-edit-delete').click()
                }
            })
        }

        if (vexView == true || vexView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(3).click()
            cy.get('#virtual_events_module_access-view').parent().invoke("attr", "class").then((attr) => {
                if ((vexView == false && attr.includes("ant-checkbox-checked")) || (vexView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#virtual_events_module_access-view').click()
                }
            })
        }

        if (websiteToolsModuleCRUD == true || websiteToolsModuleCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(4).click()
            cy.get('#website_tools_module_access-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((websiteToolsModuleCRUD == false && attr.includes("ant-checkbox-checked")) || (websiteToolsModuleCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#website_tools_module_access-create-edit-delete').click()
                }
            })
        }
        if (websiteToolsView == true || websiteToolsView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(4).click()
            cy.get('#website_tools_module_access-view').parent().invoke("attr", "class").then((attr) => {
                if ((websiteToolsView == false && attr.includes("ant-checkbox-checked")) || (websiteToolsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#website_tools_module_access-view').click()
                }
            })
        }

        // if (contentconfigurationsCRUD == true || contentconfigurationsCRUD == false) {
        //     cy.get(this.contentIntelligence.contentconfigurationsCRUD).invoke("attr", "class").then(checkboxClass => {
        //         if (contentconfigurationsCRUD && checkboxClass.includes("checkbox-container--unchecked") || !contentconfigurationsCRUD && checkboxClass.includes("checkbox-container--checked")) {
        //             cy.get(this.contentIntelligence.contentconfigurationsCRUD).click()
        //         }
        //     })
        // }

        if (campaignToolsModuleCRUD == true || campaignToolsModuleCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(1).click()
                cy.get('input[id*="Access-create-edit-delete"]').parent().invoke("attr", "class").then((attr) => {
                    if ((campaignToolsModuleCRUD == false && attr.includes("ant-checkbox-checked")) || (campaignToolsModuleCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                        cy.get('input[id*="Access-create-edit-delete"]').click()
                    }
            })
        }

        if (contentLibraryView == true || contentLibraryView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(0).click()
                cy.get('#content_library_feature_access-view').parent().invoke("attr", "class").then((attr) => {
                    if ((contentLibraryView == false && attr.includes("ant-checkbox-checked")) || (contentLibraryView == true && !attr.includes("ant-checkbox-checked"))) {
                        cy.get('#content_library_feature_access-view').click()
                    }
                })
        }

        if (contentLibraryFeatureAccessCRUD == true || contentLibraryFeatureAccessCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(0).click()
                cy.get('#content_library_feature_access-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                    if ((contentLibraryFeatureAccessCRUD == false && attr.includes("ant-checkbox-checked")) || (contentLibraryFeatureAccessCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                        cy.get('#content_library_feature_access-create-edit-delete').click()
                    }
            })
        }

        if (contentLibraryInsightsView == true || contentLibraryInsightsView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Content Library").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.wait(500)
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })
            cy.get('#content_library_insights-view').parent().invoke("attr", "class").then((attr) => {
                        if ((contentLibraryInsightsView == false && attr.includes("ant-checkbox-checked")) || (contentLibraryInsightsView == true && !attr.includes("ant-checkbox-checked"))) {
                            cy.get('#content_library_insights-view').click()
                        }
                    })
        }

        if (templetedExperiencecView == true || templetedExperiencecView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(2).click()
            cy.get('#templated_experiences_feature_access-view').parent().invoke("attr", "class").then((attr) => {
                if ((templetedExperiencecView == false && attr.includes("ant-checkbox-checked")) || (templetedExperiencecView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#templated_experiences_feature_access-view').click()
                }
            })
        }

        if (templetedExperiencecCRUD == true || templetedExperiencecCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(2).click()
            cy.get('#templated_experiences_feature_access-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((templetedExperiencecCRUD == false && attr.includes("ant-checkbox-checked")) || (templetedExperiencecCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#templated_experiences_feature_access-create-edit-delete').click()
                }
            })
        }

        if (goalsCRUD == true || goalsCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(6).click()
            cy.get('#goals_module_access-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((goalsCRUD == false && attr.includes("ant-checkbox-checked")) || (goalsCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#goals_module_access-create-edit-delete').click()
                }
            })
        }

        if (goalsView == true || goalsView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(6).click()
            cy.get('#goals_module_access-view').parent().invoke("attr", "class").then((attr) => {
                if ((goalsView == false && attr.includes("ant-checkbox-checked")) || (goalsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#goals_module_access-view').click()
                }
            })
        }

        if (revenueIntelligenceView == true || revenueIntelligenceView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(7).click()
            cy.get('#revenue_enablement_accounts-view').parent().invoke("attr", "class").then((attr) => {
                if ((revenueIntelligenceView == false && attr.includes("ant-checkbox-checked")) || (revenueIntelligenceView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#revenue_enablement_accounts-view').click()
                }
            })
        }

        if (websiteContentLibraryCRUD == true || websiteContentLibraryCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(5).click()
            cy.get('#content_intelligence_content_configurations-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((websiteContentLibraryCRUD == false && attr.includes("ant-checkbox-checked")) || (websiteContentLibraryCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#content_intelligence_content_configurations-create-edit-delete').click()
                }
            })
        }

        if (websiteContentLibraryView == true || websiteContentLibraryView == false) {
            cy.contains('a', "Product Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(5).click()
            cy.get('#content_intelligence_content_configurations-view').parent().invoke("attr", "class").then((attr) => {
                if ((websiteContentLibraryView == false && attr.includes("ant-checkbox-checked")) || (websiteContentLibraryView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#content_intelligence_content_configurations-view').click()
                }
            })
        }


        if (contentStratergyCRUD == true || contentStratergyCRUD == false) {
            cy.contains('a', "Product Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Content Intelligence").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(5).click()
                }
            })

            cy.get('#content_intelligence_content_strategy-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((contentStratergyCRUD == false && attr.includes("ant-checkbox-checked")) || (contentStratergyCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#content_intelligence_content_strategy-create-edit-delete').click()
                }
            })
        }

        if (contentStratergyView == true || contentStratergyView == false) {
            cy.contains('a', "Product Permissions").click()

            cy.contains('div[class*="ant-collapse-item"] div', "Content Intelligence").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(5).click()
                }
            })

            cy.get('#content_intelligence_content_strategy-view').parent().invoke("attr", "class").then((attr) => {
                if ((contentStratergyView == false && attr.includes("ant-checkbox-checked")) || (contentStratergyView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#content_intelligence_content_strategy-view').click()
                }
            })
        }

        if (userManagementCRUD == true || userManagementCRUD == false) {
            cy.contains('a', "Administrative Controls").click()
            cy.get('div[class="ant-collapse-header"]').eq(1).click()
            cy.get('#user_management-create-edit-delete').parent().invoke("attr", "class").then((attr) => {
                if ((userManagementCRUD == false && attr.includes("ant-checkbox-checked")) || (userManagementCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#user_management-create-edit-delete').click()
                }
            })
        }

        if (userManagementView == true || userManagementView == false) {
            cy.contains('a', "Administrative Controls").click()
            cy.get('div[class="ant-collapse-header"]').eq(1).click()
            cy.get('#user_management-view').parent().invoke("attr", "class").then((attr) => {
                if ((userManagementView == false && attr.includes("ant-checkbox-checked")) || (userManagementView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#user_management-view').click()
                }
            })
        }

        if (organizationSettingsCRUD == true || organizationSettingsCRUD == false) {
            cy.contains('a', "Administrative Controls").click()
            cy.get('div[class="ant-collapse-header"]').eq(0).click()
            cy.get('input[id*=Settings-create-edit-delete]').parent().invoke("attr", "class").then((attr) => {
                if ((organizationSettingsCRUD == false && attr.includes("ant-checkbox-checked")) || (organizationSettingsCRUD == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('input[id*=Settings-create-edit-delete]').click()
                }
            })
        }

        if (organizationSettingsView == true || organizationSettingsView == false) {
            cy.contains('a', "Administrative Controls").click()
            cy.get('div[class="ant-collapse-header"]').eq(0).click()
            cy.get('#Organization Settings-view').parent().invoke("attr", "class").then((attr) => {
                if ((organizationSettingsView == false && attr.includes("ant-checkbox-checked")) || (organizationSettingsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Organization Settings-view').click()
                }
            })
        }

        // if (redirectRulesCRUD == true || redirectRulesCRUD == false) {
        //     cy.contains('a', "Administrative Controls").click()
        //     cy.get(this.administrativeControls.redirectRulesCRUD).invoke("attr", "class").then(checkboxClass => {
        //         if (redirectRulesCRUD && checkboxClass.includes("checkbox-container--unchecked") || !redirectRulesCRUD && checkboxClass.includes("checkbox-container--checked")) {
        //             cy.get(this.administrativeControls.redirectRulesCRUD).click()
        //         }
        //     })
        // }


        
        if (campaignToolsAnalyticsOverviewView == true || campaignToolsAnalyticsOverviewView == false) {
            cy.contains('a', "Analytics Permissions").click()
            // cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
            //     if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
            //     }
            // })

            cy.get('#pa_ct_overview-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsOverviewView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsOverviewView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_ct_overview-view').click()
                }
            })
            
        }

        if (campaignToolsAnalyticsAccountView == true || campaignToolsAnalyticsAccountView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })

            cy.get('#pa_ct_accounts-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsAccountView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsAccountView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_ct_accounts-view').click()
                }
            })
            
        }

        if (campaignToolsAnalyticsVisitorView == true || campaignToolsAnalyticsVisitorView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })

            cy.get('#pa_ct_visitors-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsVisitorView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsVisitorView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_ct_visitors-view').click()
                }
            })
            
        }

        if (campaignToolsAnalyticsContentView == true || campaignToolsAnalyticsContentView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })

            cy.get('#pa_ct_content-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsContentView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsContentView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_ct_content-view').click()
                }
            })
            
        }

        if (campaignToolsAnalyticsReportView == true || campaignToolsAnalyticsReportView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })

            cy.get('#Reports-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsReportView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsReportView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Reports-view').click()
                }
            })
            
        }

        if (campaignToolsAnalyticsLegacyView == true || campaignToolsAnalyticsLegacyView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(0).click()
                }
            })

            cy.get('#Legacy Analytics-view').parent().invoke("attr", "class").then((attr) => {
                if ((campaignToolsAnalyticsLegacyView == false && attr.includes("ant-checkbox-checked")) || (campaignToolsAnalyticsLegacyView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Legacy Analytics-view').click()
                }
            })
            
        }

        if (scheduleReportsView == true || scheduleReportsView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.get('div[class="ant-collapse-header"]').eq(3).click()
            cy.get('#path_analytics_schedule_reports-view').parent().invoke("attr", "class").then((attr) => {
                if ((scheduleReportsView == false && attr.includes("ant-checkbox-checked")) || (scheduleReportsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#path_analytics_schedule_reports-view').click()
                }
            })
        }

        if (WebsiteToolsAnalysticsOverviewView == true || WebsiteToolsAnalysticsOverviewView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(1).click()
                }
            })

            cy.get('#pa_wt_overview-view').parent().invoke("attr", "class").then((attr) => {
                if ((WebsiteToolsAnalysticsOverviewView == false && attr.includes("ant-checkbox-checked")) || (WebsiteToolsAnalysticsOverviewView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_wt_overview-view').click()
                }
            })
            
        }

        if (WebsiteToolsAnalysticsAccountView == true || WebsiteToolsAnalysticsAccountView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(1).click()
                }
            })

            cy.get('#pa_wt_account-view').parent().invoke("attr", "class").then((attr) => {
                if ((WebsiteToolsAnalysticsAccountView == false && attr.includes("ant-checkbox-checked")) || (WebsiteToolsAnalysticsAccountView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_wt_account-view').click()
                }
            })
            
        }

        if (WebsiteToolsAnalysticsVisitorView == true || WebsiteToolsAnalysticsVisitorView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(1).click()
                }
            })

            cy.get('#pa_wt_visitor-view').parent().invoke("attr", "class").then((attr) => {
                if ((WebsiteToolsAnalysticsVisitorView == false && attr.includes("ant-checkbox-checked")) || (WebsiteToolsAnalysticsVisitorView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#pa_wt_visitor-view').click()
                }
            })
            
        }

        if (WebsiteToolsAnalysticsContentView == true || WebsiteToolsAnalysticsContentView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div[class*="ant-collapse-item"] div', "Campaign Tools").parent('div').invoke('attr', 'aria-expanded').then((attr) => {
                if (attr == false) {
                    cy.get('div[class="ant-collapse-header"]').eq(1).click()
                }
            })

            cy.get('#Content-view').parent().invoke("attr", "class").then((attr) => {
                if ((WebsiteToolsAnalysticsContentView == false && attr.includes("ant-checkbox-checked")) || (WebsiteToolsAnalysticsContentView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#Content-view').click()
                }
            })
            
        }

        if (vexAnalysticsView == true || vexAnalysticsView == false) {
            cy.contains('a', "Analytics Permissions").click()
            cy.contains('div', "Virtual Events").siblings('span').click()
            cy.get('#path_analytics_virtual_events-view').parent().invoke("attr", "class").then((attr) => {
                if ((vexAnalysticsView == false && attr.includes("ant-checkbox-checked")) || (vexAnalysticsView == true && !attr.includes("ant-checkbox-checked"))) {
                    cy.get('#path_analytics_virtual_events-view').click()
                }
            })
        } 

        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", { timeout: 3000 })
    }


    deleteUserRole(userRole, verify) {
        cy.visit(this.userRoles.pageURL)
        cy.waitFor({ element: this.pageSidebar, to: "exist", wait: 10000 })
        cy.get(this.pageSidebar).within(sidebar => {
            if (sidebar.find(`div:contains("${userRole}")`).length > 0, { timeout: 5000 }) {
                cy.containsExact("div", userRole).siblings("div").within(() => {
                    cy.get(this.userRoles.deleteRoleIcon).click({ force: true })
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
            cy.wait(2000)
            cy.contains("span", userName, { timeout: 5000 }).click()
        })
        // remove all existing roles
        cy.get(this.userRolePreview).within(() => {
            cy.contains("h5", "User Role").click()
            cy.get(this.dropdown.box).within(box => {
                for (let i = 0; i < box.find(this.dropdown.selectedValue).length; i++) {
                    cy.get("span[class='Select-value-icon']").first().click()
                }

                //assign new roles
                roles.forEach(role => {
                    cy.get(this.dropdown.input).type(role + "\n", { force: true })
                })
            })
            cy.contains("button", "Save").click()
        })

    }

}

