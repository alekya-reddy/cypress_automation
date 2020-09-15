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
    /*it("Test scrolling within content library", ()=>{
        authoring.common.login()
        cy.scrollIntoViewWithin({
            scroller: 'div[class*="table-body-container"]',
            element: 'div[data-qa-hook="table-cell-internal-title"]',
            text: "Myrbetriq",
            increment: 2
        })
        cy.containsExact('div[data-qa-hook="table-cell-internal-title"]', "Myrbetriq").should('exist')
    })*/

    /*it("Test scrolling within timezone picker in VEX", ()=>{
        let timeZones = [
            '(GMT+13:00) Tokelau Is.',
            '(GMT-05:00) Eastern Time (US & Canada)'
        ]
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig("test lab")
        authoring.vex.goToSessionConfig("test time zone")
        authoring.vex.configureLive({timeZone: timeZones[1]})
    })*/

    /*it("Test xhr request reading", ()=>{
        cy.server()
        //cy.route('POST', 'https://spcollector.pathfactory-development.com/com.snowplowanalytics.snowplow/tp2').as('tp2')
        cy.route("GET", "https://content-upload-test2.glitch.me/dreams").as("dreams")
        cy.visit("https://content-upload-test2.glitch.me/")
        //cy.wait('@tp2')
        cy.wait("@dreams")
        cy.get('@tp2').then((xhr)=>{
            expect(xhr.status).to.eq(200)
            cy.log(xhr.requestBody)
        })
    })*/

    /*it("Webhook API test", ()=>{
        const req = https.request(options, resp => {
            let data = ""
            resp.on("data", chunk => {
              data += chunk
            })
            resp.on("end", () => {
                cy.log(JSON.parse(data))
                cy.log(JSON.parse(data).data[0].event)
                //cy.log(JSON.parse(data).data[1].event)
            })
          }).on("error", err => {
            cy.error("[error] " + err.message)
          })
        req.end()

    })*/

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

    it("test webhook command function", ()=>{
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

        cy.assertWebhook(event)
    })

    /*it("should always pass", ()=>{
        cy.visit("https://www.google.com")
    })*/

})