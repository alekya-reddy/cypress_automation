import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-vex", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' })

const event = {
    name: 'dynamicFieldMerge.js',
    slug: 'dynamicfieldMergeVex',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const event2 = {
    name: 'dynamicFieldMergeStatus.js',
    slug: 'dynamicfieldMergeVexStatus',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const testCustomFormValue = `{{virtual_event_session.status}}

<script src="//app-sj01.marketo.com/js/forms2/js/forms2.min.js"></script>
<form id="mktoForm_1591">
    <input type="hidden" id="status" name="status" value={{virtual_event_session.status}}>
</form>
<script>MktoForms2.loadForm("//app-sj01.marketo.com", "044-UAP-113", 1591, function(form) {
	form.onSuccess(function(){
  	var vals = form.vals();
  	
  	window.parent.postMessage({
    	conversionUrl: document.location.href,
    	referrer: document.referrer,
    	email: vals.Email,
    	lookbookExternalForm: true,
    	status: vals.status,
  	}, "*");
  	return true;
	});
  });
</script>`

const testExternalUrlValue = "https://trupanion.qualtrics.com/jfe/form/SV_06a50MYFxV3CbNb?status={{virtual_event_session.status}}"

const appearance = {
    appearance: "Default",
    headerTitle: "Header Title - {{company.name | default: default text}} {{visitor.email}}",
    headerSubtitle: "Header SubTitle - {{company.name | default: default text}}",
    contentTitle: "VEX Content Title - {{company.name | default: default text}}",
    contentDescription: "VEX Content Description - {{company.name | default: default text}}",
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url() {
        return `${vex.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>{{company.name | default: default text}}</h1><h2>{{visitor.email}}</h2>`,
            className: "landingpageblock",
        }
    ]
}

const landingPage2 = {
    name: "landingPageDynamicFieldMerge",
    slug: "landingPageDynamicFieldMerge",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions"
        }
    ]
}

const company = {
    ip: "76.9.217.70",
    name: "Bolt Logistics",
    country: "Canada",
    city: "Toronto"
}

const nonCompany = {
    ip: "171.117.159.107",
}

const customFormsessions = [
    {
        name: "Live pending",
        slug: "pending",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        form: "TestCustomForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "pre_event"
    },
    {
        name: "Live current",
        slug: "current",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        form: "TestCustomForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "live",
        expectedStatus: "Live"
    },
    {
        name: "Live ended with on-demand",
        slug: "ended-fallback",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        form: "TestCustomForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "on_demand",
        expectedStatus: "Finished"
    },
    {
        name: "Live ended without on-demand",
        slug: "ended",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        form: "TestCustomForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "post_event",
        expectedStatus: "Finished"
    },
    {
        name: "On-demand",
        slug: "on-demand",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        form: "TestCustomForm.js",
        mergeFieldStatus: "on_demand",
        expectedStatus: "On Demand"
    }

]

const externalFormsessions = [
    {
        name: "Live pending",
        slug: "pending",
        get url() {
            return `${event.url}/${this.slug}`
        },
        form: "TestExternalForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "pre_event"
    },
    {
        name: "Live current",
        slug: "current",
        get url() {
            return `${event.url}/${this.slug}`
        },
        form: "TestExternalForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "live",
        expectedStatus: "Live"
    },
    {
        name: "Live ended with on-demand",
        slug: "ended-fallback",
        get url() {
            return `${event.url}/${this.slug}`
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        form: "TestExternalForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "on_demand",
        expectedStatus: "Finished"
    },
    {
        name: "Live ended without on-demand",
        slug: "ended",
        get url() {
            return `${event.url}/${this.slug}`
        },
        form: "TestExternalForm.js",
        formVisibility: "Always",
        mergeFieldStatus: "post_event",
        expectedStatus: "Finished"
    },
    {
        name: "On-demand",
        slug: "on-demand",
        form: "TestExternalForm.js",
        mergeFieldStatus: "on_demand",
        expectedStatus: "On Demand"
    }

]

const visitor = "test@gmail.com"


describe("VEX - Dynamic Field Merge", () => {
    it("Set up if not already done", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                cy.viewport(1500, 1000)
                authoring.common.login()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.configureAppearance(appearance)
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("Verify that dynamic field merge works", () => {
        // Note: A field merge is a variable in the VEX (inside an html block). It could be any one of 6sense's datapoints 
        // about a visitor, such as company name, country etc. Depending on the data returned by 6sense, you will see the value 
        // of that variable displayed inside the html block. 
        cy.viewport(1500, 1000)
        authoring.common.login()
        // set landing page as Home page in authoring.
        // This is already done in set up however this is to make sure 'setHome' is always set to true as we change the value later  
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureLandingPage({
            name: landingPage.name,
            setHome: true,
        })

        // value in the field merge when visiting with spoofed pathfactory IP address
        cy.visit(event.url + `?lbhqip=${company.ip}&lb_email=${visitor}`)
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", company.name).should("exist")
            cy.contains("h2", visitor).should("exist")
        })

        // Verify that dynamic field merges are their default values when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(event.url + "?lbhqip=" + nonCompany.ip)
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", "default text").should("exist")
        })

        // Verify that if there is no known visitor, the email field would be blank
        cy.clearCookies()
        cy.visit(event.url)
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.get("h1").should("exist")
            cy.contains("h2", visitor).should("not.exist")
        })

        // Veify the merge fields in Vex Event appearance setting text fields
        // Unset landing page in authoring to see event appearance headers 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureLandingPage({
            name: landingPage.name,
            unsetHome: true,
        })
        // value in the field merge when visiting with spoofed pathfactory IP address
        cy.visit(event.url + `?lbhqip=${company.ip}&lb_email=${visitor}`)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - Bolt Logistics test@gmail.com", { timeout: 20000 }).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, "Header SubTitle - Bolt Logistics").should('exist')
        cy.contains(consumption.vex.eventContentTitle, "VEX Content Title - Bolt Logistics").should('exist')
        cy.contains(consumption.vex.eventContentDescription, "VEX Content Description - Bolt Logistics").should('exist')

        // Verify that dynamic field merges are their default values when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(event.url + "?lbhqip=" + nonCompany.ip)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - default text test@gmail.com", { timeout: 20000 }).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, "Header SubTitle - default text").should('exist')
        cy.contains(consumption.vex.eventContentTitle, "VEX Content Title - default text").should('exist')
        cy.contains(consumption.vex.eventContentDescription, "VEX Content Description - default text").should('exist')

        // Verify that if there is no known visitor, the email field would be blank
        cy.clearCookies()
        cy.visit(event.url)
        cy.wait(5000)
        cy.contains(consumption.vex.eventHeroTitle, "Header Title - Tech Mahindra", { timeout: 20000 }).should('exist')
    })

    it("Verify session status showing in dynamic field merge", () => {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2)
        authoring.vex.configureEvent(event2)
        customFormsessions.forEach((session) => {
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event2.name)
        })

        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.editLandingPage(landingPage2)
        authoring.vex.goToPageEditor(landingPage2.name)
        authoring.vex.addAdvancedBlock(landingPage2.blocks[0])
        cy.get(authoring.vex.saveButton).click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event2.url)

        //Validation of session status of each session on consumption page when custom form applied
        customFormsessions.forEach((session) => {
            cy.contains('div', session.name).should('be.visible', { timeout: 10000 }).click()
            if (!session.name.includes("Live pending")) {
                cy.contains('div', session.expectedStatus).should('be.visible', { timeout: 10000 })
            }
            cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
            cy.getIframeBody(consumption.common.customFormIframe).within(() => {
                cy.get("#status").should("have.attr", "value", session.mergeFieldStatus)
                cy.contains(session.mergeFieldStatus).should('be.visible')
                cy.go('back')
            })
        })

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        externalFormsessions.forEach((session) => {
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event2.name)
        })

        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.editLandingPage(landingPage2)
        authoring.vex.goToPageEditor(landingPage2.name)
        authoring.vex.addAdvancedBlock(landingPage2.blocks[0])
        cy.get(authoring.vex.saveButton).click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event2.url)

        //Validation of session status of each session on consumption page when external form applied
        externalFormsessions.forEach((session) => {
            cy.contains('div', session.name).should('be.visible', { timeout: 10000 }).click()
            if (!session.name.includes("Live pending")) {
                cy.contains('div', session.expectedStatus).should('be.visible', { timeout: 10000 })
            }
            cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
            cy.get(consumption.common.customFormIframe).invoke('attr', 'src').then(value => {
                expect(value).to.contains(session.mergeFieldStatus)
            })
            cy.go('back')
        })
    })
})