import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' });
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' });

const originalEvent = {
    name: 'videocaptions.js',
    slug: 'videocaptions-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const originalEventVimeo = {
    name: 'vimeocaptions.js',
    slug: 'vimeocaptions-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const originalSession = [
    {
        name: "ondemand session",
        slug: "ondemandession",
        visibility: 'Public',
        description: 'Session description',
        type: 'On Demand',
        video: 'Oracle Cloud captions',
        captions: 'on',
        captionsLanguage: "French",
    },
    {
        name: 'live session',
        slug: 'livesession',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Oracle Cloud captions',
            liveVideoCaptions: 'on',
            captionsLanguage: "French",
        },
        captionsLanguage: "French"
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
            type: 'Content Library',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            liveVideoCaptions: 'on',
            captionsLanguage: "French",
        },
        video: 'Oracle Cloud captions',
        captions: 'on',
        captionsLanguage: "French"
    },
    {
        name: "ondemand session with captions off",
        slug: "ondemandsessionwithcaptionsoff",
        visibility: 'Public',
        description: 'Session description',
        type: 'On Demand',
        video: 'Oracle Cloud captions',
        captions: 'off'
    },
    {
        name: "Session with suppliment content",
        slug: "sessionsupplimentcontent",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Oracle Cloud captions',
        contents: [
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing',
            'Image - Used by Cypress automation for VEX testing'
        ],
        captions: 'on',
        captionsLanguage: "French",
    },
    {
        name: 'live session with captions off',
        slug: 'livesessionwithcaptionsoff',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Oracle Cloud captions',
            liveVideoCaptions: 'off'
        }
    }
]

const vimeoSessions = [
    {
        name: "ondemand session",
        slug: "ondemandession",
        visibility: 'Public',
        description: 'Session description',
        type: 'On Demand',
        video: 'The New Vimeo Player - used in cypress-2',
        captions: 'on',
        captionsLanguage: "English",
    },
    {
        name: 'live session',
        slug: 'livesession',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'The New Vimeo Player - used in cypress',
            liveVideoCaptions: 'on',
            captionsLanguage: "English",
        },
        captionsLanguage: "English"
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
            type: 'Content Library',
            video: 'The New Vimeo Player - used in cypress',
            liveVideoCaptions: 'on',
            captionsLanguage: "English",
        },
        video: 'The New Vimeo Player - used in cypress-2',
        captions: 'on',
        captionsLanguage: "English"
    },
    {
        name: "ondemand session with captions off",
        slug: "ondemandsessionwithcaptionsoff",
        visibility: 'Public',
        description: 'Session description',
        type: 'On Demand',
        video: 'The New Vimeo Player - used in cypress-2',
        captions: 'off'
    },
    {
        name: "Session with suppliment content",
        slug: "sessionsupplimentcontent",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'The New Vimeo Player - used in cypress-2',
        contents: [
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing',
            'Image - Used by Cypress automation for VEX testing'
        ],
        captions: 'on',
        captionsLanguage: "English",
    },
    {
        name: 'live session with captions off',
        slug: 'livesessionwithcaptionsoff',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'The New Vimeo Player - used in cypress',
            liveVideoCaptions: 'off'
        }
    }
]

const landingPage = {
    name: "Landing-Page",
    slug: "landing-page",
    get url() {
        return `${originalEvent.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
            verify: false
        },
    ]
}

const landingPage2 = {
    name: "Landing-Page",
    slug: "landing-page",
    get url() {
        return `${originalEventVimeo.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
            verify: false
        },
    ]
}


describe('VEX - Virtual Event', function () {
    it('Visit the event which has subtitle enabled and disabled for youtube videos', function () {
        // Login, clean up 
        authoring.common.login();
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(originalEvent.name)

        // Set up an event 
        authoring.vex.addVirtualEvent(originalEvent)
        authoring.vex.configureEvent(originalEvent)

        // Now add a session and set it up 
        originalSession.forEach(session => {
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            cy.go('back')
        })

        // Verify captions enabled and disabled from sessions and verify in consumption
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.configureLandingPage(landingPage)
        authoring.vex.goToPageEditor(landingPage.name)

        let i = 0;
        cy.visit(originalEvent.url)
        originalSession.forEach(session => {

            cy.contains(consumption.vex.sessionCardTitle, session.name, { timeout: 10000 }).click()
            if (session.type === 'Live' && i == 0) {
                cy.get(consumption.vex.emailInput).type("test@gmail.com",{force:true})
                cy.get(consumption.vex.submitButton).click()
                i++;
            }
            cy.waitForIframeToLoad(consumption.vex.youtube.iframe, consumption.vex.youtube.videoPlayer, 20000)
            cy.getIframeBody(consumption.vex.youtube.iframe).within(() => {
                cy.get("div.ytp-chrome-bottom").then(() => {
                    cy.get(consumption.vex.youtube.videoPlayer).should('exist').trigger('mouseover')
                    cy.get(consumption.vex.youtube.settings).should('be.visible', { timeout: 10000 }).click({ force: true })
                    if (session.name === 'ondemand session with captions off' || session.name === 'live session with captions off') {
                        cy.wait(1000)
                        cy.contains("div.ytp-menuitem-label", "Subtitles/CC").parents("div.ytp-menuitem").find(consumption.vex.youtube.menuContent).invoke('text').then(text => {
                            if (text.includes("Off")) {
                                cy.contains(consumption.vex.youtube.menuContent, "Off").should('be.visible', { timeout: 10000 })
                            }
                            else {
                                cy.contains(consumption.vex.youtube.menuContent, "English").should('be.visible', { timeout: 10000 })
                            }
                        })
                        cy.go('back')
                    }
                    else {
                        cy.contains(consumption.vex.youtube.menuContent, session.captionsLanguage, { timeout: 10000 }).should('be.visible')
                        cy.contains(consumption.vex.youtube.menuContent, session.captionsLanguage, { timeout: 10000 }).should('be.visible').click()
                        cy.contains("Hindi").click()
                        cy.contains(consumption.vex.youtube.menuContent, "Hindi").should('be.visible', { timeout: 10000 })
                        cy.go('back')
                    }
                })
            })
        })
    })

    it('Visit the event which has subtitle enabled and disabled for vimeo videos', function () {
        // Login, clean up 
        authoring.common.login();
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(originalEventVimeo.name)

        // Set up an event 
        authoring.vex.addVirtualEvent(originalEventVimeo)
        authoring.vex.configureEvent(originalEventVimeo)

        // Now add a session and set it up 
        vimeoSessions.forEach(session => {
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            cy.go('back')
        })

        // Verify captions enabled and disabled from sessions and verify in consumption
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.configureLandingPage(landingPage2)
        authoring.vex.goToPageEditor(landingPage2.name)

        let i = 0;
        cy.visit(originalEventVimeo.url)
        vimeoSessions.forEach(session => {

            cy.contains(consumption.vex.sessionCardTitle, session.name, { timeout: 10000 }).click()
            if (session.type === 'Live' && i == 0) {
                cy.get(consumption.vex.emailInput).type("test@gmail.com",{force:true})
                cy.get(consumption.vex.submitButton).click()
                i++;
            }
            cy.waitForIframeToLoad(consumption.vex.vimeo.iframe, consumption.vex.vimeo.videoPlayer, 20000)
            cy.getIframeBody(consumption.vex.vimeo.iframe).within(() => {
                cy.get(consumption.vex.vimeo.videoPlayer).should('exist').trigger('mouseover', { force: true })
                cy.get(consumption.vex.vimeo.captions).should('be.visible', { timeout: 10000 }).click()
                if (session.name === 'ondemand session with captions off' || session.name === 'live session with captions off') {
                    cy.wait(1000)
                    cy.contains("div.vp-menu-option-label", "None").parents("li[role='menuitemradio'][aria-checked='true']").should('exist')
                    cy.go('back')
                }
                else {
                    cy.contains("div.vp-menu-option-label", session.captionsLanguage, { timeout: 10000 }).parents("li[role='menuitemradio'][aria-checked='true']").should('exist')
                    cy.contains("Français").click()
                    cy.contains("div.vp-menu-option-label", "Français", { timeout: 10000 }).parents("li[role='menuitemradio'][aria-checked='true']").should('exist')
                    cy.go('back')
                }
            })
        })
    })

})