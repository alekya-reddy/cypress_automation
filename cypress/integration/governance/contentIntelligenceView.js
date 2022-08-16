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
    contentStratergyCRUD: false,
    contentStratergyView: true,
}

describe("View Only Permissions", () => {

    it("Content Stratergy View Only Permissions", () => {
        // Content intelligence & website tools are Enabled: show both Content configurations and Content strategy
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

           // logout 
           authoring.common.logout()
           // login and check permissions
           authoring.common.login(user.userName, user.password)
           authoring.contentIntelligence.visit()
           cy.contains('p', "Use Content Intelligence to understand how your content aligns with your content strategy.").should("exist")
           cy.contains('dd', "Define the important topics that your content should be an authority on. We'll help you research these topics and assess the relevancy of your content to these topics.").should("exist")
           cy.contains('dd', "We'll highlight which of your content assets are the most relevant to an individual content asset or a Key Marketing Topic. These recommendations can be activated on your website with Website Tools.").should("exist")
           cy.contains('span', "Key Marketing Topics").should("exist").click()
           cy.contains("button", "Add Topics").should("not.exist")
           cy.reload()
           cy.contains("option", " Select a category ").should("exist")
           cy.get(authoring.contentIntelligence.pageSearch).should("exist")
           cy.contains("option", " Sort ").should("exist")
           cy.contains("th", "Categories").should("exist")
           cy.contains("th", "Status").should("exist")
           cy.contains("th", "Delete").should("not.exist")
           cy.contains("th", "Name").should("exist")
           cy.contains('a', "Account Based Marketing").should("exist").click({force:true})
           cy.wait(4000)
           cy.contains("h2", "Marketing").should("exist")
           cy.contains("a", "Relevant Content").should("exist")
           cy.contains("th", "Topic Relevancy Score").should("exist")
           cy.contains("th", "Top Keywords").should("exist")
           cy.contains("th", "URL").should("exist")
           cy.contains("th", "Content").should("exist")
           cy.get(authoring.contentIntelligence.topicNameClick).eq(0).click()
           cy.get(authoring.contentIntelligence.modalContainer).should("exist")
           cy.contains("button", "Details").should("exist").click()
           cy.contains("dt", "Title").should("exist")
           cy.contains("th", "URL").should("exist")
           cy.contains("dt", "Language").should("exist")
           cy.contains("dt", "Reading Time").should("exist")
           cy.contains("dt", "Word Count").should("exist")
           cy.contains("dt", "Reading Ease").should("exist")
           cy.contains("dt", "Sentiment").should("exist")
           cy.contains("dt", "Sentence Count").should("exist")

           cy.contains("button", "Page Metadata").should("exist").click()
           cy.contains("h3", "Standard Meta Tags").should("exist")
           cy.contains("h3", "Open Graph Meta Tags").should("exist")

           cy.contains("button", "Related Content").should("exist").click()
           cy.contains("span", "Select Content Pool").should("exist")

           cy.contains("button", "Top Keywords").should("exist")
           cy.get(authoring.contentIntelligence.topKeywordsTab).should("exist")
           cy.reload()
           cy.contains("a", "Google Search Engine Results").should("exist").click()
           cy.contains("a", "People Also Ask").should("exist")
           cy.contains("a", "Top Search Results").should("exist") 

    })
})