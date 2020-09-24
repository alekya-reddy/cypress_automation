import { createAuthoringInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({baseUrl: "default.pathfactory-staging.com", username: "liming", password: "Password1234"});
const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{

    /*it("drag and drop", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig("Krishna Test Delete Later")
        //authoring.vex.goToSessionConfig("krishna live")
        //cy.containsExact("span", "Website - Used by Cypress automation for VEX testing", {timeout: 20000}).siblings(".anticon-menu").then((elem)=>{
        //    cy.get(elem).drag({to: `li[class="ant-list-item"]:contains('PDF - Used by Cypress automation for VEX testing')`, place: 'below'})
        //})
        cy.contains("a", "Navigation").click()
        cy.containsExact("span", "test c").parents('.rst__row').children(".rst__moveHandle").trigger("dragstart")
        cy.get("div[class='rst__row']:contains('test d')").trigger("drop").trigger("dragend")
        
    })*/

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