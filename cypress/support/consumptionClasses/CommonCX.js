
export class CommonCX {
    constructor(env, org, tld, baseUrl) {
        this.org = org;
        this.tld = tld;
        this.env = env;
        this.baseUrl = baseUrl;
        this.jukeBoxApp = "#jukebox-app";
        this.trackProtectionEmailInput = "#email";
        this.ciscoEmailInput = "#userInput";
        this.ciscoPasswordInput = "input[type='password']";
        this.ciscoNextButton = "#login-button";
        this.ciscoLogIn = "input[type='submit']";
        this.accessProtectionLogo = "div[class='background-image']";
        this.accessProtectionLogoUrl = "div[class='logo-container']>img";
        this.accessProtectionHeaderText = "[class*='title-container']";
        this.accessProtectionBodyText = ".body-text-data";
        this.accessProtectionSubmitButton = "input[type='submit']";
        this.modal = "#qa-modal";
        this.closeModalButton = "#qa-modal-close";
        this.customFormIframe = "#qa-custom-form";
        this.standardForm = {
            locator: "form[id='qa-standard-form']",
            firstNameInput: "input[id^='firstName']",
            lastNameInput: "input[id^='lastName']",
            emailInput: "input[id^='email']",
            company: "input[id^='company']",
            title: "input[id^='title']",
            phone: "input[id^='phone']",
            employeeCount: "input[id^='employeeCount']",
            country: "input[id^='country']",
            state: "input[id^='state']",
            zipcode: "input[id^='zipcode']",
            checkbox: "input[name='checkbox']",
            optIn: "input[name='optIn'][value='true']",
            optOut: "input[name='optIn'][value='false']",
            cookieConsentCheckbox: 'input[name="visitorCookieAccepted"]'
        };
        this.cookieConsent = {
            messageBox: "#qa-cookie-consent",
            accept: "#qa-gdpr-cookie-consent-accept-button",
            decline: "#qa-gdpr-cookie-consent-decline-button",
            cookieConsentButton: "#qa-flow-footer-cookie-consent-button",
            ok: "#qa-cookie-consent-ok-button" // If cookie message toggled on instead of cookie consent, will get the "ok" button instead of "accept" or "decline" 
        };
        this.header = {
            locator: "#qa-header",
            cookieSettings: "[title='Cookie Settings']",
            facebookIcon: "#facebook-link",
            settingButton: "#pf-event-cookie-consent-button",
            headerLogoVisible: "#qa-header-logo",
            headerTitle: "#qa-header-title",
            headerCookieConsentButton: "#qa-header-cookie-consent-button",
        };
        this.cookieSettings = {
            modal: "div[id='qa-modal']:visible",
            closeModal: "#qa-modal-close",
            toggle: "#optIn"
        };
        this.ctaButton = "a[id*='qa-cta-button']";
        this.overlay = {
            modal: "#lookbook-overlay-mask",
            close: "#lookbook-overlay-close span",
            iframe: ".lookbook-overlay-content",
        };
        this.backToHomePageButton = 'i[title="See All"]';
        this.flowHeader = '#qa-header-common'
        this.flowHeader = '#qa-header-common';
        this.flowLogo = "#qa-logo-common";
        this.flowCookieConsentButton = "#qa-flow-sidebar-cookie-consent-button"
    }

    check30MinCookie(wait) {
        // need to wait a few seconds for the cookie to be set properly, otherwise you'll get an expiry that's set 20 years in future 
        for (let i = 0; i <= wait; i += 500) {
            cy.getCookies({ log: false }).then((cookies) => {
                let vid = cookies.find(cookie => cookie.name == 'vid')
                if (vid.expiry) {
                    cy.wait(500, { log: false })
                }
            })
        }
        let expectedExpiryTimeinSecs = (Math.floor(Date.now() / 1000) + 1800).toString().substring(0, 6)
        return cy.getCookies().then((cookies) => {
            let vid = cookies.find(cookie => cookie.name == 'vid')
            let vidValue = (vid.value).toString()
            expect((vid.expiry).toString()).to.contains(expectedExpiryTimeinSecs)
            return vidValue;
        })
    }

    checkSessionCookie(wait) {
        // need to wait a few seconds for the cookie to be set properly, otherwise you'll get an expiry that's set 20 years in future 
        for (let i = 0; i <= wait; i += 500) {
            cy.getCookies({ log: false }).then((cookies) => {
                let vid = cookies.find(cookie => cookie.name == 'vid')
                if (vid.expiry) {
                    cy.wait(500, { log: false })
                }
            })
        }

        cy.getCookies().then((cookies) => {
            let vid = cookies.find(cookie => cookie.name == 'vid')
            expect(vid.expiry).to.be.undefined
        })

    }

    checkPersistentCookie(wait) {
        let expectedExpiry = new Date()
        let date = new Date()
        expectedExpiry.setFullYear(expectedExpiry.getFullYear() + 2)
        expectedExpiry = expectedExpiry.toLocaleDateString()
        const year = expectedExpiry.split('/')[2]
        //To check leap year then subtract one day
        const leap = new Date(year, 1, 29).getDate() === 29;
        if (leap) {
            date.setFullYear(date.getFullYear() + 2)
            date.setDate(date.getDate() - 1)
            expectedExpiry = date.toLocaleDateString()
        }

        // need to wait a few seconds for the cookie to be set properly, otherwise you'll get an expiry that's set 20 years in future 
        for (let i = 0; i <= wait; i += 500) {
            cy.getCookies({ log: false }).then((cookies) => {
                let vid = cookies.find(cookie => cookie.name == 'vid')
                let expiry = new Date(vid.expiry * 1000).toLocaleDateString()
                if (expectedExpiry !== expiry) {
                    cy.wait(500, { log: false })
                }
            })
        }

        cy.getCookies().then((cookies) => {
            let vid = cookies.find(cookie => cookie.name == 'vid')
            let expiry = new Date(vid.expiry * 1000).toLocaleDateString()
            expect(expiry).to.equal(expectedExpiry)
        })

    }

    toggleCookieConsent(_on_off) {
        let on_off = _on_off.toUpperCase()
        if (Cypress.$(this.header.cookieSettings).length > 0) {
            cy.get(this.header.settingButton).click()
        } else {
            // Miscrosites have a different id for the cookie settings button  
            cy.get(this.header.cookieSettings).eq(0).click()
        }
        cy.get(this.cookieSettings.modal).should('exist').within(() => {
            cy.get(this.cookieSettings.toggle).invoke("text").then((current_state) => {
                if (on_off !== current_state) {
                    cy.get(this.cookieSettings.toggle).click()
                }
            })
            cy.get(this.cookieSettings.toggle).should("contain", on_off)
            cy.get(this.cookieSettings.closeModal).click()
        })
        cy.get(this.cookieSettings.modal).should('not.exist')
    }

    fillStandardForm(config) {
        const first_name = config.first_name
        const last_name = config.last_name
        const email = config.email
        const company = config.company
        const job_title = config.job_title
        const phone = config.phone
        const employee_count = config.employee_count
        const country = config.country
        const state = config.state
        const zipcode = config.zipcode
        const checkbox = config.checkbox
        const opt_in = config.opt_in
        const consent = config.consent
        const checkSuccess = config.checkSuccess == false ? false : true

        if (first_name) {
            cy.get(this.standardForm.firstNameInput).clear().type(first_name)
        }

        if (last_name) {
            cy.get(this.standardForm.lastNameInput).clear().type(last_name)
        }

        if (email) {
            cy.get(this.standardForm.emailInput).clear().type(email)
        }

        if (company) {
            cy.get(this.standardForm.company).clear().type(company)
        }

        if (job_title) {
            cy.get(this.standardForm.title).clear().type(job_title)
        }

        if (phone) {
            cy.get(this.standardForm.phone).clear().type(phone)
        }

        if (employee_count) {
            cy.get(this.standardForm.employeeCount).clear().type(employee_count)
        }

        if (country) {
            cy.get(this.standardForm.country).clear().type(`${country}\n`)
        }

        if (state) {
            cy.get(this.standardForm.state).clear().type(`${state}\n`)
        }

        if (zipcode) {
            cy.get(this.standardForm.zipcode).clear().type(zipcode)
        }

        if (checkbox) {
            cy.get(this.standardForm.checkbox).click()
        }

        if (opt_in == 'true') {
            cy.get(this.standardForm.optIn).click()
        } else if (opt_in == 'false') {
            cy.get(this.standardForm.optOut).click()
        }

        if (consent) {
            cy.get(this.standardForm.cookieConsentCheckbox).click()
        }

        cy.contains("button", "Submit").click()

        if (checkSuccess) {
            cy.waitFor({ element: "form:visible", to: "not.exist", wait: 20000 })
            cy.expectNotVisible({ locator: "form" })
        }
    }

    checkPf_consentCookie(wait, value) {
        cy.wait(4000)
        if (value) {
            for (let i = 0; i <= wait; i += 500) {
                cy.getCookies({ log: false }).then((cookies) => {
                    let pf_consent = cookies.find(cookie => cookie.name == '_pf_consent')
                    if (pf_consent.value) {
                        cy.wait(500, { log: false })
                    }
                })
            }

            cy.getCookies().then((cookies) => {
                let pf_consent = cookies.find(cookie => cookie.name == '_pf_consent')
                expect(pf_consent.value).to.contains(value)
            })
        }

        else {
            cy.getCookies().then((cookies) => {
                let pf_consent = cookies.find(cookie => cookie.name == '_pf_consent')
                expect(pf_consent).to.be.undefined
            })
        }
    }

    checkVidValueAndExpiry(wait, noOfDays) {
        if (noOfDays) {
            for (let i = 0; i <= wait; i += 500) {
                cy.getCookies({ log: false }).then((cookies) => {
                    let vid = cookies.find(cookie => cookie.name == 'vid')
                    if (vid.value) {
                        cy.wait(500, { log: false })
                    }
                })
            }

            return cy.getCookies().then((cookies) => {
                let vid = cookies.find(cookie => cookie.name == 'vid')
                let expectedExpiryTimeinSecs = (Math.floor(Date.now() / 1000) + (86400 * noOfDays)).toString().substring(0, 6)
                let actualExpiryTimeinSecs = vid.expiry.toString()
                let vidValue = vid.value.toString()
                expect(actualExpiryTimeinSecs).to.contains(expectedExpiryTimeinSecs)
                return vidValue;
            })
        }

        else {
            cy.wait(3000)
            cy.getCookies().then((cookies) => {
                let vid = cookies.find(cookie => cookie.name == 'vid')
                expect(vid).to.be.undefined
            })
        }
    }

    cookieConsentToggle(on_off) {
        cy.get(this.header.cookieSettings, { timeout: 20000 }).click({ force: true })
        cy.get(this.cookieSettings.toggle).invoke('css', 'background-color').then(colour => {
            if (colour === "rgb(0, 169, 203)" && on_off === "off" || colour === "rgb(0, 169, 203)" && on_off === "OFF") {
                cy.get(this.cookieSettings.toggle).click()
            }
            if (colour === "rgb(221, 221, 221)" && on_off === "on" || colour === "rgb(221, 221, 221)" && on_off === "ON") {
                cy.get(this.cookieSettings.toggle).click()
            }
        })
        cy.get(this.closeModalButton).click()
    }
}