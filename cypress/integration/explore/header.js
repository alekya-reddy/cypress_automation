import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'sharedTarget',
    contents: [webContent.title, youtubeContent.title]
};

const explore = {
    name: 'header.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'header-js',
    appearance: 'heroImages.js',
    pageTitle: 'It is Title',
    pageDescription: 'It is Description',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreWithThumbnail = {
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg"
    }
}
 const exploreWithDescription255 = {
    pageDescription: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
 }
describe("Explore - Header feature", () => {

    it("Set up if not already done", ()=>{
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Add, override and remove Header", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        //verify helper text
        cy.get(authoring.explore.pageSidebar.pageTitleLabel).trigger('mouseover')
        cy.contains("This title will show in the browser tab, social sharing, title tag, and meta title").should("exist")
        cy.get(authoring.explore.pageSidebar.pageDescriptionLabel).trigger('mouseover')
        cy.contains("This description will show in the social sharing, meta description, and og description").should("exist")
        cy.get(authoring.explore.pageSidebar.thumbnail).trigger('mouseover')
        cy.contains("This thumbnail will show in the social sharing and og image").should("exist")

        //verify that description can't be more than 255 characters
        cy.get(authoring.explore.pageSidebar.pageDescriptionLabel).siblings("span").click()
        cy.get(authoring.common.popover).get(authoring.explore.popoverElements.pageDescriptionInput).clear().type(exploreWithDescription255.pageDescription + "\n")
        cy.contains("button", "Update").click()
        cy.contains('div', "Description must be fewer than 255 characters.").should("exist")
        cy.contains("button", "Cancel").click()
        authoring.explore.configureExplore(explore)

        // turn header toggle on and override headet title
        authoring.common.toggle(authoring.explore.pageSidebar.headerToggle, 'ON')
        authoring.explore.setHeaderOverrides('Automation Headline')
        
        // verify on consumption header title changed
        cy.visit(explore.url)
        cy.contains(consumption.explore.headerTitle, 'Automation Headline')

        // go back to authoring and remove override title
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        cy.get(authoring.explore.header.headerOverrides).click()
        cy.get(authoring.explore.modal).within(() => {
            cy.get(authoring.explore.header.headerTitle).clear()
            cy.contains('button', 'Save Header Overrides').click()
        })

        cy.get('#explore-seo-thumbnail').click()
        authoring.common.pickThumbnail(exploreWithThumbnail.thumbnail)

        // verify on consumption that header title fallback to default value, which is 'Recommended Content' 
        cy.visit(explore.url)
        cy.contains(consumption.explore.headerTitle, 'Recommended Content')   

        // verify header doesn't exist when toggle is off
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        authoring.common.toggle(authoring.explore.pageSidebar.headerToggle, 'OFF')

        cy.visit(explore.url)
        cy.get(consumption.explore.headerTitle).should('not.exist')
        
        cy.wait(2000)
        cy.get('meta[property="og:description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[property="og:title"]').should("have.attr", "content", explore.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", explore.pageTitle);

    })
})


