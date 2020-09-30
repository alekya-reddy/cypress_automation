import { createAuthoringInstance, createConsumptionInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({baseUrl: "default.pathfactory-staging.com", username: "liming", password: "Password1234"});
const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

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

    /*it("test", ()=>{
        //cy.visit("https://automation-vex.lookbookhq.com/vexwebhooks-js/?foo=bar&utm_source=source")
        cy.visit("https://content-upload-test2-.glitch.me/")
        cy.waitFor({element: "#test", to: "exist", wait: 10000})
        cy.log("now wait for it to not exist")
        cy.waitFor({element: "#test", to: "not.exist", wait: 10000})
    })*/

})