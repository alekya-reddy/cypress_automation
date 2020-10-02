import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({baseUrl: "default.pathfactory-staging.com", username: "liming", password: "Password1234"});
const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
//const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{

    it("should always pass", ()=>{
        //cy.visit("https://www.google.com")
        let name = `Rocket-Chat: Configurations, long_(name) with. special! character$ as "this" caused bug & stuff / yeah? 1234 #iamtheone++==*@`

        function escapeNonAlphanumeric(text){
            let charArray = text.split("")
            let escapedCharArray = charArray.map((char)=>{
                if(/[^a-zA-Z0-9\s]/.test(char)){
                    return `\\${char}`
                } else {
                    return char
                }
            })
            let escapedText = ""
            escapedCharArray.forEach((char)=>{
                escapedText = escapedText.concat(char)
            })
            return escapedText
        }

        let escapedName = escapeNonAlphanumeric(name)
        cy.log(escapedName)

        let text_regex = new RegExp(`^${escapedName}$`)
        cy.log(text_regex)
        expect(text_regex.test(name)).to.be.true
    })

})