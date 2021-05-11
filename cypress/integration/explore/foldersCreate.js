import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const target = {
    name: 'sharedTarget'
};

const existingExplorePage = {
    name: 'foldersCreate.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'folderscreate-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const explorePage = {
    name: 'Create New Folder js',
    experienceType: 'Target',
    trackName: target.name,
    parentFolder: 'AutomationFolderOne',
    slug: 'create-new-folder-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const parentFolderName = ['AutomationFolderOne','AutomationFolderTwo']
const childFolderName = ['AutomationFolderChild']

// #################################################
// # This test is to Add, edit and delete Folders
// # 1. Add New folder in explore
// # 2. Add New explore and verify explore page is added to folder
// # 3. Add existing page to the same folder and verify filtering
// # 4. Create a child folder and add a page and verfify filtering
// # 5. Edit the folder name of the existing page and verify filtering
// # 6. Delete the folder added [ Folder can be deleted only if its empty]
// # 7. Delete the explore page and folders added
// #################################################

describe("Explore - Create, Edit and Delete Folders", () => {

    it("Delete explore page if already exists", ()=>{
        cy.request({url: explorePage.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 200){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.deleteExplore(explorePage.name)
            }
        })
    })

    it("Create, Edit and Delete Folders", () => {
        authoring.common.login()
        authoring.explore.visit()
        // remove tracks from folders and delete folders if already exists
        authoring.common.removeAllTracksFromFolder(childFolderName)
        authoring.common.deleteFolder(childFolderName)
        authoring.common.removeAllTracksFromFolder(parentFolderName)
        authoring.common.deleteFolder(parentFolderName)

        // create new folder
        cy.get(authoring.common.folder.addFolderButton).click()
        cy.get(authoring.common.modal).within(() => {
            cy.contains("button", "Create Folder").click()
            cy.contains("can't be blank")
            cy.get(authoring.common.folder.folderNameInput).type(parentFolderName[0])
            cy.contains("button", "Create Folder").click()
        })
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '0')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.contains("No items found.")

        authoring.explore.addExplore(explorePage)
        authoring.explore.configureExplore(explorePage)
        // verify folder name(link) inside track details
        cy.get(authoring.explore.pageSidebar.container).within(() => {
            cy.contains("Folder: AutomationFolderOne").should("exist")
            cy.contains("a", "AutomationFolderOne").click()
        })
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '1')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.contains(authoring.common.table.experienceCellName, explorePage.name, {timeout: 20000}).should('exist')
        cy.contains(authoring.common.table.folderCell, parentFolderName[0]).should('exist')

        // add existing explore page to the same folder and verify filtering
        cy.get(authoring.common.folder.folderSelector('Root')).click()
        authoring.explore.goToExplorePage(existingExplorePage.name)
        authoring.explore.editExplore({name: existingExplorePage.name, parentFolder: parentFolderName[0]})
        cy.get(authoring.explore.pageSidebar.container).within(() => {
            cy.contains("Folder: AutomationFolderOne").should("exist")
            cy.contains("a", "AutomationFolderOne").click()
        })
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '2')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.containsExact(authoring.common.table.experienceCellName, explorePage.name).should('exist')
        cy.containsExact(authoring.common.table.experienceCellName, existingExplorePage.name).should('exist')
        cy.contains(authoring.common.table.folderCell, parentFolderName[0]).should('exist')
        
        // search explore page in root folder, click on folder name and make sure it goes to right folder
        cy.get(authoring.common.folder.folderSelector('Root')).click()
        cy.get(authoring.explore.pageSearch).clear().type(existingExplorePage.name)
        cy.contains(authoring.common.table.folderCell, parentFolderName[0], {timeout: 1000}).should('exist')
        cy.contains(`${authoring.common.table.folderCell} > a`, parentFolderName[0]).click({force:true})
        cy.containsExact(authoring.common.table.experienceCellName, explorePage.name).should('exist')
        cy.containsExact(authoring.common.table.experienceCellName, existingExplorePage.name).should('exist')

        // create a child folder, add a page and verify filtering
        cy.get(authoring.common.folder.addFolderButton).click()
        cy.get(authoring.common.modal).within(() => {
            cy.get(authoring.explore.folder.folderNameInput).type(childFolderName[0])
            cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type(parentFolderName[0] + "\n")
            cy.contains("button", "Create Folder").click()
        })
        cy.get(authoring.common.folder.expandAllIcon).click({force:true})
        cy.get(authoring.common.folder.folderCount(childFolderName[0])).should('have.text', '0')
        cy.get(authoring.common.folder.folderSelector(childFolderName[0])).click()
        cy.contains("No items found.")

        // edit the folder name of the above existing page and verify filtering
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        authoring.explore.goToExplorePage(explorePage.name)
        authoring.explore.editExplore({name: explorePage.name, parentFolder: childFolderName[0]})
        cy.get(authoring.explore.pageSidebar.container).within(() => {
            cy.contains("Folder: AutomationFolderChild").should("exist")
            cy.contains("a", "AutomationFolderChild").click()
        })

        // verify folder counts
        cy.get(authoring.common.folder.folderToggle(parentFolderName[0])).click() // by clicking on parent folder it collapses child folder
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '2')
        cy.get(authoring.common.folder.folderToggle(parentFolderName[0])).click() // by clicking on parent folder again it expands child folder
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '1')
        cy.get(authoring.common.folder.folderCount(childFolderName[0])).should('have.text', '1')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.containsExact(authoring.common.table.experienceCellName, explorePage.name).should('not.exist')
        cy.containsExact(authoring.common.table.experienceCellName, existingExplorePage.name).should('exist')
        cy.get(authoring.common.folder.folderSelector(childFolderName[0])).click()
        cy.containsExact(authoring.common.table.experienceCellName, explorePage.name).should('exist')
        cy.containsExact(authoring.common.table.experienceCellName, existingExplorePage.name).should('not.exist')

        // search page in root folder and click on folder name in list view and make sure it goes to right folder
        cy.get(authoring.common.folder.folderSelector('Root')).click()
        cy.get(authoring.common.pageSearch).clear().type(explorePage.name)
        cy.contains(authoring.common.table.folderCell, childFolderName[0]).should('exist')
        cy.contains(`${authoring.common.table.folderCell} > a`, childFolderName[0]).click({force:true})
        cy.containsExact(authoring.common.table.experienceCellName, explorePage.name, {timeout: 1000}).should('exist')
        cy.containsExact(authoring.common.table.experienceCellName, existingExplorePage.name).should('not.exist')

        // create a duplicate folder on the same level
        cy.get(authoring.common.folder.folderSelector('Root')).click()
        cy.get(authoring.common.folder.addFolderButton).click()
        cy.get(authoring.common.modal).within(() => {
            cy.get(authoring.explore.folder.folderNameInput).type(parentFolderName[0])
            cy.contains("button", "Create Folder").click()
            cy.contains("has already been taken")
            cy.get(authoring.explore.folder.folderNameInput).type(parentFolderName[1])
            cy.contains("button", "Create Folder").click()
        })
        cy.get(authoring.common.folder.folderCount(parentFolderName[1])).should('have.text', '0')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[1])).click()
        cy.contains("No items found.")

        // delete the second folder [empty]
        authoring.common.deleteFolder([parentFolderName[1]])

        // delete first parent folder added [ Folder can be deleted only if its empty]
        cy.get(authoring.common.folder.expandAllIcon).click({force:true})
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click().within(() => {
            authoring.common.clickIcon('Delete Folder')
        })
        cy.get(authoring.common.modal).within(() => {
            cy.contains("button", "Yes").click()
            cy.contains("Please remove all explore pages and folders to proceed with the deletion.")
            cy.contains("button", "Cancel").click()
        })

        // edit and remove folder name for an existing explore page
        authoring.explore.goToExplorePage(existingExplorePage.name)
        cy.get(authoring.explore.editExplorePageIcon).click()
        cy.contains(authoring.explore.modal, "Edit Explore Page").within(()=>{
            cy.get(authoring.common.dropdown.clearValue).eq(1).click()
            cy.contains("button", "Save Explore Page").click()
        })
        cy.get(authoring.explore.pageSidebar.container).within(() => {
            cy.contains("Folder: Root").should("exist")
            cy.contains("a", "Root").click()

        })

        // delete the newly added page
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.contains("No items found.")
        cy.get(authoring.common.folder.folderSelector(childFolderName[0])).click()
        authoring.explore.deleteExplore(explorePage.name)

        // delete folders
        authoring.common.deleteFolder(childFolderName)
        authoring.common.deleteFolder(parentFolderName)
   
    })
})
 