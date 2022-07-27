import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-explore", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-explore', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'sharedTarget',
    contents: [webContent.title, youtubeContent.title]
};

const recommend = {
    name: 'sharedRecommend',
    contents: ["Do-Not-Edit Cisco Systems - Shared Resource", "Do-Not-Edit Capybara - Shared Resource"]
};

const targetExplore = {
    name: 'editExplore.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'editexplore-js',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const recommendExplore = {
    name: 'editExplore.js',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'editexplore-js',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Edit explore page", () => {

    it("Set up if not already done", () => {
        cy.request({ url: targetExplore.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(targetExplore)
                authoring.explore.configureExplore(targetExplore)
            }
        })
    })

    it("Verify that by clicking on Edit we can modify track associated with the Explore page", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(targetExplore.name)
        authoring.explore.editExplore(recommendExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Recommend Track: ${recommend.name}`)

        // Verify consumption
        cy.visit(targetExplore.url)
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent).should("not.exist")
        })
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("exist")
        })

        authoring.explore.visit()
        authoring.explore.goToExplorePage(recommendExplore.name)
        authoring.explore.editExplore(targetExplore)
        cy.contains(authoring.explore.pageSidebar.container, `Target Track: ${target.name}`)

        // Verify consumption
        cy.visit(targetExplore.url)
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent, { timeout: 10000 }).should("exist")
        })
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent).should("not.exist")
        })

    })

    it("Verify the Explore page is opening in OverLay for both Recommend and Target Tracks", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(recommendExplore.name)
        authoring.explore.editExplore(targetExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Target Track: ${target.name}`)
        authoring.explore.setOpenContentTrack("Overlay on the same window")

        //Verify in consumption that target asset should be visible with overlay and recommend asset should not be present
        cy.visit(targetExplore.url)
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, targetContent, { timeout: 10000 }).click()
            cy.get(consumption.explore.overlay.iframe).should("exist")
            cy.contains('span', '×').click({ force: true })
        })
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("not.exist")
        })

        authoring.explore.visit()
        authoring.explore.goToExplorePage(targetExplore.name)
        authoring.explore.editExplore(recommendExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Recommend Track: ${recommend.name}`)
        authoring.explore.setOpenContentTrack("Overlay on the same window")

        //Verify in consumption that recommend asset should be visible with overlay and target asset should not be present
        cy.visit(recommendExplore.url)
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, recommendContent, { timeout: 10000 }).click()
            cy.get(consumption.explore.overlay.modal).should("exist")
            cy.contains('span', '×').click({ force: true })
        })
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent).should("not.exist")
        })

    })

    it("Verify the Explore page to Redirect in the same window for both Target and Recommend", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(recommendExplore.name)
        authoring.explore.editExplore(targetExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Target Track: ${target.name}`)
        authoring.explore.setOpenContentTrack("Redirect in the same window")

        //Verify in consumption that target asset should be visible with open in same window and recommend asset should not be present
        cy.visit(targetExplore.url)
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, targetContent, { timeout: 10000 }).click()
            cy.url("contains", "sharedresource?x=wNmH_P&lx=Wg5PmI", { timrout: 10000 }).should("exist")
            cy.go("back")
            cy.visit(targetExplore.url)
            target.contents.forEach(targetContent => {
                cy.contains(consumption.explore.body.card, targetContent).should("exist")
            })

        })
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("not.exist")
        })

        authoring.explore.visit()
        authoring.explore.goToExplorePage(targetExplore.name)
        authoring.explore.editExplore(recommendExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Recommend Track: ${recommend.name}`)
        authoring.explore.setOpenContentTrack("Redirect in the same window")

        //Verify in consumption that recommend asset should be visible with open in same window and target asset should not be present
        cy.visit(recommendExplore.url)
        recommend.contents.forEach(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, recommendContent, { timeout: 10000 }).click()
            cy.url("contains", "commonresource?x=oSOpYa&lx=Wg5PmI", { timrout: 10000 }).should("exist")
            cy.go("back")
            cy.visit(recommendExplore.url)
            recommend.contents.forEach(recommendContent => {
                cy.contains(consumption.explore.body.card, recommendContent).should("exist")

            })
            target.contents.forEach(targetContent => {
                cy.contains(consumption.explore.body.card, targetContent).should("not.exist")
            })
        })

    })

    it("Verify the Explore page to Open in new tab", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(recommendExplore.name)
        authoring.explore.editExplore(targetExplore)

        cy.contains(authoring.explore.pageSidebar.container, `Target Track: ${target.name}`)
        authoring.explore.setOpenContentTrack("Open in a new tab")

        //Verify in consumption that target asset should be visible with open in new tab and recommend asset should not be present
        cy.visit(targetExplore.url)
        target.contents.forEach(targetContent => {
            cy.contains(consumption.explore.body.card, targetContent).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, targetContent, { timeout: 10000 }).click()
            cy.get('#qa-explore-topic-list-grid-0-0').prev('a').invoke('attr', 'href').then(url => {
                cy.log(url)
                cy.visit(url)
                cy.url("contains", "commonresource?x=oSOpYa&lx=Wg5PmI", { timeout: 10000 }).should("exist")
            })
            cy.go("back")
            cy.visit(targetExplore.url)
            target.contents.forEach(targetContent => {
                cy.contains(consumption.explore.body.card, targetContent).should("exist")
            })
            recommend.contents.forEach(recommendContent => {
                cy.contains(consumption.explore.body.card, recommendContent, { timeout: 20000 }).should("not.exist")
            })
        })

        authoring.explore.visit()
        authoring.explore.goToExplorePage(targetExplore.name)
        authoring.explore.editExplore(recommendExplore)
        cy.contains(authoring.explore.pageSidebar.container, `Recommend Track: ${recommend.name}`)
        authoring.explore.setOpenContentTrack("Open in a new tab")

        //Verify in consumption that recommend asset should be visible with open in new tab and target asset should not be present
        cy.visit(recommendExplore.url)
        recommend.contents(recommendContent => {
            cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("exist")
            cy.contains(consumption.explore.hero.assetTitle, recommendContent, { timeout: 10000 }).click()
            cy.get('#qa-explore-topic-list-grid-0-0').prev('a').invoke('attr', 'href').then(url => {
                cy.log(url)
                cy.visit(url)
                cy.url("contains", "commonresource?x=oSOpYa&lx=Wg5PmI", { timrout: 10000 }).should("exist")
            })
            cy.go("back")
            cy.visit(recommendExplore.url)
            recommend.contents.forEach(recommendContent => {
                cy.wait(5000)
                cy.contains(consumption.explore.body.card, recommendContent, { timeout: 10000 }).should("exist")
            })
            target.contents.forEach(targetContent => {
                cy.contains(consumption.explore.body.card, targetContent).should("not.exist")
            })
        })
    })

})
