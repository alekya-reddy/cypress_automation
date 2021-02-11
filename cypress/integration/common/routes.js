import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org

const target = {
    name: "Target Shared Resource",
    slug: "target-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Shared Resource"]
}

const recommend = {
    name: "Recommend Shared Resource",
    slug: "recommend-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Shared Resource"]
}

const segment = {
    name: "Segment Shared Resource",
    rules: [
        {
            property: "Country",
            operator: "equals",
            value: "Canada"
        }
    ]
}

const route = {
    name: "Route Shared Resource",
    slug: "route-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/r/${this.slug}`
    },
    fallbackType: "Target",
    fallbackDestination: target.name,
    segments: [
        {
            name: segment.name,
            destination: recommend.name
        }
    ],
}

const pathfactoryIP = "?lbhqip=76.9.217.70"

describe("Routes", () => {
    it("Should pass along the vid cookie when redirecting urls", () => {
        // Route should redirect, and in the response, it should send the vid cookie to the new url
        // There was bug where route was not sending the cookie, and so new cookie being created upon reaching the new url
        // This created 2 vid cookies for the same click of the route url link, causing bad visitor data
        // See https://lookbookhq.atlassian.net/browse/DEV-12490 to get better understanding of what I'm testing for
        cy.request({url: route.url + pathfactoryIP, followRedirect: false}).then((response)=>{
            expect(response.status).to.eq(302)
            expect(response.redirectedToUrl).to.include(recommend.url)
            expect(response.requestHeaders).to.have.property("cookie")
            expect(response.requestHeaders.cookie).to.match(/vid=.+/) // The request going to the new url should contain the vid cookie
        })
    })

    // When refactoring Capybara routes test files, spec/authoring/routes/six_sense.rb can go in here in separate it function
})