import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: 'automation-microsites', tld: 'lookbookhq' })
const parentFolderName = ['AutomationFolderOne']
const childFolderName = ['AutomationFolderChild']

const event1 = {
    name: 'virtualEventfoldering.js',
}

const event2 = {
    name: 'parentEvent.js',
    parentFolder: 'AutomationFolderOne',
}

const event3 = {
    name: 'childEvent.js',
    childFolder: 'AutomationFolderChild'
}

describe("VEX - Create, Edit and Delete Folders", () => {
    it("Create,Delete Folders and Events", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrositefromFolder(event3.name)
        authoring.common.deleteFolder(childFolderName)
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        authoring.microsites.removeMicrositefromFolder(event2.name)
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
        cy.contains("No microsites found")
      
        authoring.microsites.addMicrosite(event2)
        
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '1')


        //add child folder

        cy.get(authoring.common.folder.addFolderButton).click()
        cy.get(authoring.common.modal).within(() => {
            cy.get(authoring.microsites.folder.folderNameInput).type(childFolderName[0])
            cy.get(authoring.microsites.createMicrositeModal.dropdownSelect).eq(0).click()
            cy.get(authoring.microsites.createMicrositeModal.dropdownSelectField).eq(0).type(parentFolderName[0] + "\n")
            cy.contains("button", "Create Folder").click()
        })

        // add virtual event into child folder

        cy.get(authoring.common.folder.folderSelector(childFolderName[0])).click()
        authoring.microsites.addMicrosite(event3)

       //verify folder count
        cy.get(authoring.common.folder.folderToggle(parentFolderName[0])).click() // by clicking on parent folder it collapses child folder
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '2')
        cy.get(authoring.common.folder.folderToggle(parentFolderName[0])).click() // by clicking on parent folder again it expands child folder
        cy.get(authoring.common.folder.folderCount(parentFolderName[0])).should('have.text', '1')
        cy.get(authoring.common.folder.folderCount(childFolderName[0])).should('have.text', '1')

       //search for childefolder event in root folder and it should show up in all folders
        cy.get(authoring.common.folder.folderSelector('Root')).click()
        cy.get(authoring.microsites.searchButton).clear().type(event3.name)
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.get(authoring.common.folder.folderSelector(childFolderName[0])).click()
        cy.get(authoring.microsites.eventVerification).should('exist')
        cy.get(authoring.microsites.clearSearch).click()

      //search for any root folder event in child folder and should give message for no events
        cy.get(authoring.microsites.folderbreadcrum).should('exist')
        cy.get(authoring.microsites.searchButton).clear().type(event1.name)
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')

      //search for root folder event into parent folder and it should give message for no event found
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.get(authoring.microsites.searchButton).clear().type(event1.name)
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')

        // search for childfolder event into parent folder and it should exist
        cy.get(authoring.common.folder.folderSelector(parentFolderName[0])).click()
        cy.get(authoring.microsites.searchButton).clear().type(event3.name)
        cy.get(authoring.microsites.eventVerification).should('exist')
        cy.get(authoring.microsites.searchButton).clear()

    })

})