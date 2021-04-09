const links = [
    "http://pathfactory-test.com/blog/abm-buyer-relationships/",
    "http://pathfactory-test.com/blog/abm-success-stories/",
    "http://pathfactory-test.com/blog/5-lessons-learned-rolling-abm-program/",
    "http://pathfactory-test.com/blog/4-must-haves-for-abm-success-making-the-transition-to-account-based-marketing/",
    "http://pathfactory-test.com/blog/making-account-based-marketing-work-at-scale/",
    "http://pathfactory-test.com/blog/it-takes-a-village-account-based-marketing-tech-companies-form-the-abm-leadership-alliance-to-share-expertise/",
    "http://pathfactory-test.com/blog/sales-and-marketing-challenges/",
    "http://pathfactory-test.com/blog/how-b2b-marketers-can-use-linkedin-for-abm/",
    "http://pathfactory-test.com/account-based-marketing",
    "http://pathfactory-test.com/blog/employee-email-signature-sigstr",
    "http://pathfactory-test.com/blog/path-analytics-pathfactory-test-for-sales",
    "http://pathfactory-test.com/how-it-works/for-sales",
    "http://pathfactory-test.com/how-it-works/abm"
]

describe("Generate Data for Tatras team", ()=>{
    it("Go through each link and spend there at least 2 minutes", ()=>{
        // 2 mins = 120000 ms
        cy.viewport(1450, 1024)
        links.forEach(link => {
            cy.visit(link)
            cy.scrollTo(0, 1000)
            cy.wait(30000)
            cy.scrollTo(0, 2000)
            cy.wait(30000)
            cy.scrollTo(0, 3000)
            cy.wait(30000)
            cy.scrollTo('bottom')
            cy.wait(35000)
        })
    })
})