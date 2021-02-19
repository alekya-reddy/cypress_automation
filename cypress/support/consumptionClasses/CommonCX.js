
export class CommonCX {
    constructor(env, org, tld, baseUrl){
        this.org = org;
        this.tld = tld;
        this.env = env;
        this.baseUrl = baseUrl; 
        this.jukeBoxApp = "#jukebox-app";
        this.trackProtectionEmailInput = "#email";
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
            ok: "#qa-cookie-consent-ok-button" // If cookie message toggled on instead of cookie consent, will get the "ok" button instead of "accept" or "decline"
        };
        this.header = {
            locator: "#qa-header",
            cookieSettings: "#pf-event-cookie-consent-button",
            facebookIcon: "#facebook-link"
        };
        this.cookieSettings = {
            modal: "div[id='qa-modal']:visible",
            closeModal: "#qa-modal-close",
            toggle: "#optIn"
        };
        this.ctaButton = "#qa-cta-button";
        this.overlay = {
            modal: "#lookbook-overlay-mask",
            close: "#lookbook-overlay-close",
            iframe: ".lookbook-overlay-content",
        };
        this.backToHomePageButton = 'i[title="See All"]';
    }

    checkSessionCookie(wait){
        // need to wait a few seconds for the cookie to be set properly, otherwise you'll get an expiry that's set 20 years in future 
        for(let i = 0 ; i <= wait ; i += 500){
            cy.getCookies({log: false}).then((cookies)=>{
                let vid = cookies.find(cookie => cookie.name == 'vid') 
                if(vid.expiry){
                    cy.wait(500, {log: false})
                }
            })
        }

        cy.getCookies().then((cookies)=>{
            let vid = cookies.find(cookie => cookie.name == 'vid')
            expect(vid.expiry).to.be.undefined
        })

    }

    checkPersistentCookie(wait){
        let expectedExpiry = new Date()
        expectedExpiry.setFullYear(expectedExpiry.getFullYear() + 2)
        expectedExpiry = expectedExpiry.toLocaleDateString()

        // need to wait a few seconds for the cookie to be set properly, otherwise you'll get an expiry that's set 20 years in future 
        for(let i = 0 ; i <= wait ; i += 500){
            cy.getCookies({log: false}).then((cookies)=>{
                let vid = cookies.find(cookie => cookie.name == 'vid') 
                let expiry = new Date(vid.expiry * 1000).toLocaleDateString()
                if(expectedExpiry !== expiry){
                    cy.wait(500, {log: false})
                }
            })
        }

        cy.getCookies().then((cookies)=>{
            let vid = cookies.find(cookie => cookie.name == 'vid')
            let expiry = new Date(vid.expiry * 1000).toLocaleDateString()
            expect(expiry).to.equal(expectedExpiry)
        })

    }

    toggleCookieConsent(_on_off){
        let on_off = _on_off.toUpperCase()
        if(Cypress.$(this.header.cookieSettings).length > 0){
            cy.get(this.header.cookieSettings).click()
        } else {
            // Miscrosites have a different id for the cookie settings button  
            cy.get(this.navigation.cookieSettings).click()
        }
        cy.get(this.cookieSettings.modal).should('exist').within(() => {
            cy.get(this.cookieSettings.toggle).invoke("text").then((current_state)=>{
                if( on_off !== current_state ){
                    cy.get(this.cookieSettings.toggle).click()
                }
            })
            cy.get(this.cookieSettings.toggle).should("contain", on_off)
            cy.get(this.cookieSettings.closeModal).click()
        })
        cy.get(this.cookieSettings.modal).should('not.exist')
    }

    fillStandardForm(config){
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

        if(first_name){
            cy.get(this.standardForm.firstNameInput).clear().type(first_name)
        }

        if(last_name){
            cy.get(this.standardForm.lastNameInput).clear().type(last_name)
        }

        if(email){
            cy.get(this.standardForm.emailInput).clear().type(email) 
        }

        if(company){
            cy.get(this.standardForm.company).clear().type(company)
        }

        if(job_title){
            cy.get(this.standardForm.title).clear().type(job_title)
        }

        if(phone){
            cy.get(this.standardForm.phone).clear().type(phone)
        }

        if(employee_count){
            cy.get(this.standardForm.employeeCount).clear().type(employee_count)
        }

        if(country){
            cy.get(this.standardForm.country).clear().type(country)
        }

        if(state){
            cy.get(this.standardForm.state).clear().type(state)
        }

        if(zipcode){
            cy.get(this.standardForm.zipcode).clear().type(zipcode)
        }

        if(checkbox){
            cy.get(this.standardForm.checkbox).click()
        }
        
        if(opt_in == 'true'){
            cy.get(this.standardForm.optIn).click()
        } else if (opt_in == 'false'){
            cy.get(this.standardForm.optOut).click()
        }

        if(consent){
            cy.get(this.standardForm.cookieConsentCheckbox).click()
        }

        cy.contains("button", "Submit").click() 

        if(checkSuccess){
            cy.waitFor({element: "form:visible", to: "not.exist", wait: 20000})
            cy.expectNotVisible({locator: "form"})
        }
    }
}