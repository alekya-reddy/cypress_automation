import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'Target deletePrevention.js',
    contents: [webContent.title]
};

const recommend = {
    name: 'Recommend deletePrevention.js',
    contents: [youtubeContent.title]
};

const exploreTarget = {
    name: 'exTarget deletePrevention.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'tdeleteprevention-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreRecommend = {
    name: 'exRecommend deletePrevention.js',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'rdeleteprevention-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - Verify delete prevention", () => {

    it("Delete Tracks and Explore Pages if exist", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTarget.name)
        authoring.explore.deleteExplore(exploreRecommend.name)
        authoring.target.deleteTrack(target.name)
        authoring.recommend.deleteTrack(recommend.name)
    })

    it("Check that Target track cannot be deleted if it's being used in Explore and can be if it's not", () => {
        authoring.common.login()
        authoring.target.addTrack(target)
        authoring.target.configure(target)
        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)
        authoring.target.deleteTrack(target.name, false)
        cy.contains(authoring.target.modal, 'Track cannot be deleted').should('exist')
        cy.contains(authoring.target.modal, 'Before you delete this Track, you need to remove it from the following Explore page(s):').should('exist')
        cy.contains(authoring.target.modal, exploreTarget.name).should('exist')
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTarget.name)
        authoring.target.deleteTrack(target.name) // includes verify
    })

    it("Check that Recommend track cannot be deleted if it's being used in Explore and can be if it's not", () => {
        authoring.common.login()
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)
        authoring.recommend.deleteTrack(recommend.name, false)
        cy.contains(authoring.recommend.modal, 'Track cannot be deleted').should('exist')
        cy.contains(authoring.recommend.modal, 'Before you delete this Track, you need to remove it from the following Explore page(s):').should('exist')
        cy.contains(authoring.recommend.modal, exploreRecommend.name).should('exist')
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommend.name)
        authoring.recommend.deleteTrack(recommend.name) // includes verify
    })
})


