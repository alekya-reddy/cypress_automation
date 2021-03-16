import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'vexLanguage.js',
    slug: 'vexlanguage-js',
    trackProtection: "vexTrackProtection2",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const lang1 = {name: "vexLanguage1", title: "vexLanguage1", helper: "vexLanguage1"}
const lang2 = {name: "vexLanguage2", title: "vexLanguage2", helper: "vexLanguage2"}

describe("VEX - Language Settings", ()=>{
    it("Should set language", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)

        // Set the first language 
        authoring.vex.setLanguage(lang1.name) 
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.reload()
        cy.get(`span[title='${lang1.name}']`).should('exist')

        // Go to consumption side and verify the language on the track protection message 
        cy.visit(event.url)
        cy.contains("h5", lang1.title).should('exist')
        cy.contains(lang1.helper).should('exist')

        // Set the second language to verify can change the language once it is set 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.setLanguage(lang2.name)
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')

        // Go to consumption and verify second language 
        cy.visit(event.url)
        cy.contains("h5", lang2.title).should('exist')
        cy.contains(lang2.helper).should('exist')
    })
})