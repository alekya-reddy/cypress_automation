import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'vexLanguage.js',
    slug: 'vexlanguage-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const lang1 = "vexLanguage1"
const lang2 = "vexLanguage2"

describe("VEX - Language Settings", ()=>{
    it("Should set language", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.setLanguage(lang2)
        authoring.vex.setLanguage(lang1) 
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.reload()
        cy.get(`span[title='${lang1}']`).should('exist')

        // At the moment, setting the language does nothing
    })
})