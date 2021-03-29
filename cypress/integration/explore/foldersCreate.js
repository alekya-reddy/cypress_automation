import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const target = {
    name: 'sharedTarget'
};

const explorePage = {
    name: 'foldersCreate.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'folderscreate-js',
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

    // it("Delete explore page if already exists", ()=>{
    //     cy.request({url: explorePage.url, failOnStatusCode: false}).then((response)=>{
    //         if(response.status == 404){ 
    //             authoring.common.login()
    //             authoring.explore.visit()
    //             authoring.explore.deleteExplore(explorePage.name)
    //         }
    //     })
    // })

    it("Create, Edit and Delete Folders", () => {
        authoring.common.login()
        authoring.explore.visit()
        // Remove tracks from folders and delete folders if already exists
        authoring.common.removeAllTracksFromFolder(['Test dfh'])

   
    })
})
