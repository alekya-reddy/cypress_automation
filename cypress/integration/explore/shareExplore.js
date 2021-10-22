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
    name: 'shareExplore.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'shareexplore-js',
    heroTitle: 'Hero Title',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    },
    pageTitle: 'It is Title',
    pageDescription: 'It is Description',
};

describe("Explore - Share Explore Page", () => {

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

    it("Validate differents ways of sharing Explore Page", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        // check #1: share explore starts on selected track
        let link = null
        cy.get(authoring.explore.shareExplore).click()
        cy.get(authoring.explore.modal).within(()=>{
            cy.get(authoring.explore.dropdown.box).eq(0).click()
            cy.get(authoring.explore.dropdown.input).eq(0).type(webContent.title + "\n", {force: true})
            cy.get('a').invoke('attr', 'href').then((href) => {
                link = href
                cy.log(link)
            })
        })
        cy.do(()=>{
            cy.get(authoring.explore.modal).within(()=>{
                cy.contains('span', link).should('exist')
            })
            cy.visit(link)
        })
        // redirected to the track
        cy.contains('span', webContent.title, {wait: 1000}).should('exist')
        // click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // explore page is shown
        cy.contains(consumption.explore.hero.heroTitle, explore.heroTitle)
        // check that tracks are there
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should('exist')
        })

        // check #2: embed in an email
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        cy.get(authoring.explore.emailExplore).click()
        cy.contains(authoring.explore.modal, 'Embed in an Email')
        cy.get(authoring.explore.closeModal).click()

        // check #3: preview 
        cy.get(authoring.explore.previewExplore).should('exist')
        cy.visit(explore.url)
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content, {wait: 500}).should('exist')
        })
        
        //verify SEO attributes
        cy.wait(2000)
        cy.get('meta[property="og:description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg"); 
        cy.get('meta[name="twitter:description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[property="og:title"]').should("have.attr", "content", explore.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", explore.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", explore.pageTitle);
        
    })
})


