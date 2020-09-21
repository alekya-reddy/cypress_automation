import { createAuthoringInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({org: 'default', tld: "pathfactory", username: "liming", password: "Password123"});
const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

//const https = require("https")
/*const options = {
    hostname: "api.pipedream.com",
    port: 443,
    path: "/v1/sources/dc_lVu6y2/event_summaries?expand=event",
    headers: {
      "Authorization": "Bearer 391dbfbac8627689b173cabc4506b667",
    },
}*/

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{
   
    /*it("content library", ()=>{
        authoring.common.login()
        authoring.contentLibrary.deleteContentByUrl({urls: "https://en.wikipedia.org/wiki/Second-rate"})
        authoring.contentLibrary.addContentByUrl({internalTitle: "Test", url: "https://en.wikipedia.org/wiki/Second-rate"})
        cy.reload()
        authoring.contentLibrary.sideBarEdit({
            search: "Test",
            publicTitle: "Different public title",
            internalTitle: "Different internal title", 
            description: "Different description",
            slug: "tester",
            thumbnail: {
                category: "Stock Images",
                url: "https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg"
            } 
        })
    })*/

    /*it("content library 2", ()=>{
        authoring.common.login()
        authoring.contentLibrary.deleteContent("Test")
        authoring.contentLibrary.deleteContent("Some video")
        authoring.contentLibrary.addContentByUrl({internalTitle: "Test", url: "https://en.wikipedia.org/wiki/Second-rate"})
        authoring.contentLibrary.addContentByUrl({internalTitle: "Some video", url: "https://www.youtube.com/watch?v=QHklmMiPqq8"})
        
    })*/

    /*it("webhook test assertions", ()=>{
        // API cut paste from Pipedream.com
        const https = require("https")

        const options = {
            hostname: "api.pipedream.com",
            port: 443,
            path: "/v1/sources/dc_lVu6y2/event_summaries?expand=event",
            headers: {
                "Authorization": "Bearer 391dbfbac8627689b173cabc4506b667",
            },
        }

        const req = https.request(options, resp => {
            let data = ""
            resp.on("data", chunk => {
                data += chunk
            })
            resp.on("end", () => {
                //cy.log(JSON.parse(data))
                let webhookEvent = JSON.parse(data).data[0].event.body
                cy.log(webhookEvent)
                expect(webhookEvent.first_name).to.equal("yam")         
            })
        }).on("error", err => {
            console.error("[error] " + err.message)
        })
        req.end()

    })*/

    /*it("webhook test delete", ()=>{
        const https = require("https")

        const options = {
        hostname: "api.pipedream.com",
        port: 443,
        path: "/v1/sources/dc_lVu6y2/events",
        method: "DELETE",
        headers: {
            "Authorization": "Bearer 391dbfbac8627689b173cabc4506b667",
        },
        }

        const req = https.request(options, resp => {
        let data = ""
        resp.on("data", chunk => {
            data += chunk
        })
        resp.on("end", () => {
            console.log(JSON.parse(data))
        })
        }).on("error", err => {
        console.error("[error] " + err.message)
        })
        req.end()
    })*/

    /*it("test cypress's request functions for webhooks", ()=>{
        // Instead of using what Pipedream provides, just take its parameters and use tthese in cypress's built-in request 
        // this way can take advanttage of cypress's built-in request testing functions
        const event = {
            company: "",
            content_source_url: "",
            content_title: "",
            email: "yam6@gmail.com",
            event_time: "2020-09-15T13:08:17-04:00",
            experience_external_id: "externalid",
            experience_name: "limingorg event",
            first_name: "yam6",
            form_name: "Standard",
            job_title: "",
            last_name: "yam6",
            phone: ""
        }
        function req(event, retries = 60){
            cy.request({
                url: "https://api.pipedream.com/v1/sources/dc_lVu6y2/events",
                headers: {"Authorization": "Bearer 391dbfbac8627689b173cabc4506b667"}
            }).then((response)=>{
                //cy.log(response)
                //let webhookEvent = response.body.data[0].e.body
                cy.log(`data length: ${response.body.data.length}`)
                let events = response.body.data.map((data)=>{
                    return data.e.body
                })
                let webhookEvent = events.find((data) => {
                    cy.log(data)
                    function checkMatch(){
                        let match = true
                        Object.getOwnPropertyNames(event).forEach((prop)=>{
                            cy.log(`${prop}: ${data[prop]} == ${event[prop]}`)
                            if(data[prop] !== event[prop]){
                                match = false
                            }
                        })
                        cy.log(`Match is: ${match}`)
                        return match;
                    }
                    return checkMatch()
                })
                cy.log(`Webhook Event found: ${webhookEvent}`)
                //if(webhookEvent.first_name !== "yam6" && retries > 0){
                if(!webhookEvent && retries > 0){
                    cy.wait(1000)
                    req(event, retries - 1)
                } else {
                    expect(webhookEvent.first_name).to.equal("yam6") 
                }
            })
        }

        req(event)
    })*/

    /*it("test webhook command function", ()=>{
        const event = {
            company: "",
            content_source_url: "",
            content_title: "",
            email: "testa6@gmail.com",
            experience_external_id: "externalid",
            experience_name: "limingorg event",
            first_name: "testa6",
            form_name: "Standard",
            job_title: "",
            last_name: "testa6",
            phone: ""
        }
        //cy.clearWebhooks()
        cy.assertWebhook({find: event, assert: (matchedEvent)=>{
            expect(matchedEvent.last_name).to.equal("testa6")
            cy.log(matchedEvent.event_time)
        }})
        cy.assertWebhook(event)
    })*/

    /*it("close sessions", ()=>{
        cy.closeSession()
    })*/

    /*it("test adding webhooks", ()=>{
        authoring.common.login()
        authoring.webhooks.visit()
        authoring.webhooks.deleteWebhook("Test")
        authoring.webhooks.addWebhook({
            name: "Test",
            url: "https://www.test.com",
            type: "Visitor Session"
        })
        authoring.webhooks.configureWebhook({
            name: "Test",
            on_off: "on",
            eventFields: {
                Country: "country_time",
                "Event Type": "event_type",
                "Event Time": "event_time",
                "Experience Name": "experience_name",
                "Known Visitor Email": "known visitor email"
            }
        })
    })*/

    /*it("", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig("rocketChat.js")
        authoring.vex.goToSessionConfig("On-demand")
        authoring.vex.goToChat()
        authoring.vex.toggle(authoring.vex.chat.toggle, "oN")
        authoring.vex.addModerators("jo@gmail.com")
        authoring.vex.addModerators(["ja@gmail.com", "ji@gmail.com", "je@gmail.com"])
        authoring.vex.deleteModerators("jo@gmail.com")
        authoring.vex.deleteModerators(["ja@gmail.com", "ji@gmail.com"])
        authoring.vex.editModerator({moderator: "je@gmail.com", newEmail: "wa@gmail.com"})
        authoring.vex.toggle(authoring.vex.chat.toggle, "OfF")
        authoring.vex.configureSession({
            name: "On-demand",
            rocketChat: {on_off: "on", moderators: ["Poop@gmail.com"]}
        })
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