import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const target = {
  name: "reverseProxy",
  slug: "reverseproxy",
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/reverseproxy/what-buying-a-new-ca",
}

const newEvent = {
  name: 'reverse proxy',
  newEventName: 'Reverse Proxy',
  slug: 'reverse-proxy',
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/reverse-proxy",
}

const newSession = {
  name: "Reverse Proxy Session",
  newName: "New Reverse Proxy Session",
  slug: "reverse-proxy",
  visibility: 'Public',
  description: 'New description',
  type: 'Live',
  video: 'Vimeo - Used in Cypress automation for VEX testing',
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/reverse-proxy/reverse-proxy",
}

const landingPage = {
  name: 'reverse proxy',
  newEventName: 'Reverse Proxy',
  slug: 'reverse-proxy-landingpage',
  get url(){
    return `${vex.url}/${this.slug}`
},
  pageTitle: "Reverse Proxy",
    pageDescription: "This is pageDescription",
    visibility: 'Public',
    setHome: true,
    url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/reverse-proxy/reverse-proxy"
}

const contents = [
  'PDF - Used by Cypress automation for VEX testing',
  'Website - Used by Cypress automation for VEX testing',
  'Image - Used by Cypress automation for VEX testing'
]


const originalSession = {
  name: "Reverse Proxy Session",
  slug: "reverse-proxy",
  visibility: 'Public',
  description: 'Session description',
  type: 'On Demand',
  video: 'Youtube - Used in Cypress automation for VEX testing',
  thumbnail: {
      category: 'Stock Images',
      url: '/stock/sm/animal-dog-pet-cute.jpg'
  }
}

const recommend = {
  name: "reverse proxy recommend",
  slug: "reverseproxyrecommend",
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/reverseproxyrecommend/dovobet-oint-pm-3-01",
}

const explore = {
  name: "reverse proxy explore recommend",
  slug: "reverse-proxy-explor",
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/l/reverse-proxy-explor"
}

const microsites = {
  name: "Test reverse proxy",
  slug: "test",
  url: "https://reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring/test"
}

const robotText = {
  automation:"Automation@#$ 123// test",
  consumption:"Consumption@#$ 123// test"
}

const user = {
  role: 'qa-multiuser',
  userName: constants.orgs[authoring.common.org].multiUser,
  password: constants.orgs[authoring.common.org].multiUserPassword
}

const automationUrl= "https://automation."+ authoring.common.env.TEST_ENV +"-pathfactory.com/robots.txt"
const consumptionUrl= "https://consumption."+ authoring.common.env.TEST_ENV +"-pathfactory.com/robots.txt"

describe("Reverse Proxy For Campaign Tools", function () {
  it("Configure Reverse-Proxy in Authoring", () => {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
    cy.get(1000)
    cy.get(authoring.common.clientHq).should("exist").click()
    cy.get(authoring.common.orgSearch).click().type("Authoring" + "\n")
    cy.get(authoring.common.orgSelect).contains("Authoring").should("exist").click()
    cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
    cy.get(authoring.common.orgModal).should("exist")
    cy.get(authoring.common.orgButton).click()
    cy.get(authoring.common.imperzonation).contains("You are impersonated into the Authoring instance").should("exist")
    cy.get(authoring.common.nameSetting).click()
    cy.get(authoring.common.orgDropdown).click()
    cy.get(authoring.common.orgValue).type("reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring" + "\n")
    cy.wait(1000)
    cy.get(authoring.common.orgSave).click()
    cy.wait(500)
    cy.contains("span", "The record was saved successfully.").should('be.visible')
    cy.wait(2000)

    authoring.target.visit()
    authoring.target.goToTrack(target.name)
    cy.wait(1000)
    cy.contains('div', "What Buying a New Car Can Teach B2B Marketers about the Buyer’s Journey").click()
    cy.wait(500)
    cy.get(authoring.target.previewLink).contains(target.url).should("exist")

    authoring.recommend.visit()
    authoring.recommend.goToTrack(recommend.name)
    cy.get(authoring.recommend.recommendCell).contains("Reverse Proxy Pdf").click({ force: true })
    cy.wait(500)
    cy.get(authoring.recommend.previewLink).contains(recommend.url).should("exist")

    authoring.microsites.visit()
    authoring.microsites.goToMicrositeConfig(microsites.name)
    cy.get(authoring.microsites.micrositeLink).contains(microsites.url).should("exist")

  })

  it("Reverse Proxy For Campaign Tools", function () {
    cy.visit(target.url)
    cy.url().should('contain', target.url)
    cy.wait(1000)
    cy.get(consumption.target.contentFrame).should("exist")

    cy.visit(recommend.url)
    cy.url().should('contain', recommend.url)
    cy.get(consumption.recommend.contentTitle).contains("PRODUCT MONOGRAPH").should("exist")

    cy.visit(explore.url)
    cy.url().should('contain', explore.url)
    cy.wait(1000)
    cy.get(consumption.explore.exploreTitle).should("exist")

    cy.visit(microsites.url)
    cy.url().should('contain', microsites.url)
  })

  it("Set Custom Org Back", function () {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
    cy.get(1000)
    cy.get(authoring.common.clientHq).should("exist").click()
    cy.get(authoring.common.orgSearch).click().type("Authoring" + "\n")
    cy.get(authoring.common.orgSelect).contains("Authoring").should("exist").click()
    cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
    cy.get(authoring.common.orgModal).should("exist")
    cy.get(authoring.common.orgButton).click()
    cy.get(authoring.common.imperzonation).contains("You are impersonated into the Authoring instance").should("exist")
    cy.get(authoring.common.nameSetting).click()
    cy.get(authoring.common.orgDropdown).click()
    cy.get(authoring.common.orgValue).type("custom.pathfactory-" + authoring.common.env.TEST_ENV + "-test.com" + "\n")
    cy.wait(1000)
    cy.get(authoring.common.orgSave).click()
    cy.contains("span", "The record was saved successfully.").should('be.visible')

  })

  it("Verify that robot file can be edited", function () {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
    cy.wait(200)
    cy.contains('span', "Organization Settings").click()
    cy.wait(200)
    cy.get(authoring.common.robotInput).clear({force: true}).type(robotText.automation,{force: true})
    cy.contains('button', "Save").click()

    cy.visit(automationUrl)
    cy.wait(1000)
    cy.get("body").should("contain", robotText.automation, { timeout: 3000 })

  })

  it("Verify that robot file can be edited for consumption org", function () {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
    cy.get(1000)
    cy.get(authoring.common.clientHq).should("exist").click()
    cy.get(authoring.common.orgSearch).click().type("Automation Consumption" + "\n")
    cy.get(authoring.common.orgSelect).contains("Automation Consumption").should("exist").click()
    cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
    cy.get(authoring.common.orgModal).should("exist")
    cy.get(authoring.common.orgButton).click()
    cy.get(authoring.common.imperzonation).contains("You are impersonated into the Automation Consumption instance.").should("exist")
    cy.get(authoring.common.nameSetting).click()
    cy.wait(200)
    cy.contains('span', "Organization Settings").click()
    cy.wait(200)
    cy.get(authoring.common.robotInput).clear({force: true}).type(robotText.consumption,{force: true})
    cy.contains('button', "Save").click()

    cy.visit(consumptionUrl)
    cy.wait(1000)
    cy.get("body").should("contain", robotText.consumption, { timeout: 3000 })
  })

  it("Verify that robot file can be edited for custom role", function () {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()
       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Custom"+ "\n")
       cy.contains('button', "Save").click()
       
      authoring.common.logout()
      authoring.common.login(user.userName, user.password)
      cy.get(authoring.common.robotInput).clear({force: true}).type(robotText.automation,{force: true})
      cy.contains('button', "Save").click()
    
     cy.visit(automationUrl)
     cy.wait(1000)
     cy.get("body").should("contain", robotText.automation, { timeout: 3000 })

  })

  it("Configure Reverse-Proxy For VEX Landinng Page", function  () {
    authoring.common.login()
    cy.get(authoring.common.nameSetting).click()
    cy.get(10000)
    cy.get(authoring.common.clientHq).should("exist").click()
    cy.get(authoring.common.orgSearch).click().type("Authoring" + "\n")
    cy.get(authoring.common.orgSelect).contains("Authoring").should("exist").click()
    cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
    cy.get(authoring.common.orgModal).should("exist")
    cy.get(authoring.common.orgButton).click()
    cy.get(authoring.common.imperzonation).contains("You are impersonated into the Authoring instance").should("exist")
    cy.get(authoring.common.nameSetting).click()
    cy.get(authoring.common.orgDropdown).click()
    cy.get(authoring.common.orgValue).type("reverseproxy.pathfactory-" + authoring.common.env.TEST_ENV + "-wp.com/test-authoring" + "\n")
    cy.wait(1000)
    cy.get(authoring.common.orgSave).click()
    cy.wait(500)
    cy.contains("span", "The record was saved successfully.").should('be.visible')
    cy.wait(2000)
    authoring.vex.deleteVirtualEvent(newEvent.name)
    authoring.vex.addVirtualEvent(newEvent)
    cy.wait(1000)
    authoring.vex.configureEvent(newEvent)
    authoring.vex.addSession(newSession.name)
    authoring.vex.configureSession(originalSession)

    //Add supplemental contents of all valid media types (pdf, image, website) and verify it has been saved 
    authoring.vex.addSupplementalContent(contents);
    contents.forEach((content)=>{
      cy.containsExact(authoring.vex.supplementalContentCardTitle, content).should('exist');
  })
    authoring.vex.backToEvent(newEvent.name) 
    //Add edit and Configure Landingpage
    authoring.vex.addLandingPages([landingPage.name])
    authoring.vex.editLandingPage(landingPage)
  })

  it("Reversr Proxy For Event and Session", function  () {
    cy.window().then(win => win.location.href = newEvent.url);
    cy.url().should('contain', newEvent.url)
    cy.window().then(win => win.location.href = newSession.url);
    cy.url().should('contain', newSession.url)
    cy.get(consumption.vex.emailInput).type("test@gmail.com")
    cy.contains("Submit").click()
    cy.wait(2000)

    cy.contains(contents[0]).click()
    cy.window().then(win => win.location.href = landingPage.url);
    cy.url().should('contain', landingPage.url)
  })

})