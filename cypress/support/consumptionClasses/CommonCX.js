
export class CommonCX {
    constructor(env, org, customBaseUrl){
        this.org = org;
        this.env = env;
        this.customBaseUrl = customBaseUrl;
        this.baseUrl = customBaseUrl ? customBaseUrl : `https://${org}.${env}.com`;
        this.trackProtectionEmailInput = "#visitor_email";
        this.standardForm = {
            firstNameInput: "#firstName",
            lastNameInput: "#lastName",
            emailInput: "#email",
            cookieConsentCheckbox: 'input[name="visitorCookieAccepted"]',
        },
        this.cookieConsent = {
            messageBox: "#qa-cookie-consent",
            accept: "#qa-gdpr-cookie-consent-accept-button",
            decline: "#qa-gdpr-cookie-consent-decline-button"
        },
        this.header = {
            cookieSettings: "#pf-event-cookie-consent-button"
        },
        this.cookieSettings = {
            modal: "#qa-modal",
            closeModal: "#qa-modal-close",
            toggle: "#optIn"
        }
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
        cy.get(this.header.cookieSettings).click()
        cy.get(this.cookieSettings.modal).should('exist')
        cy.get(this.cookieSettings.toggle).invoke("text").then((current_state)=>{
            if( on_off !== current_state ){
                cy.get(this.cookieSettings.toggle).click()
            }
        })

        cy.get(this.cookieSettings.toggle).should("contain", on_off)
        cy.get(this.cookieSettings.closeModal).click()
        cy.get(this.cookieSettings.modal).should('not.exist')
    }

}