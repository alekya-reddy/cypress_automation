export const login_pathfactory = () => {
    cy.visit('https://automation.pathfactory-staging.com')
    cy.get('[id="login"]').type('qa-automation').should('have.value', 'qa-automation')
    cy.get('[id="password"]').type('Capybara123')
    cy.get('input[value="Log in"]').click()
    cy.url().should('include', '/authoring/content-library')
}

export const client_hq_toggle_on = (toggle_id) => {
    //Toggle on clientHQ 
    cy.get('a[href="/authoring/content-library/settings"]').click()
    cy.contains('a', "Client HQs").click()
    cy.contains('a', /^automation$/).click()
    cy.get(toggle_id).then((toggle)=>{
        let color = toggle.css("background-color") 
        if (color == 'rgb(221, 221, 221)'){
            toggle.click()
        }
    })
}

export const client_hq_toggle_off = (toggle_id) => {
    //Toggle off clientHQ 
    /*cy.get('a[href="/authoring/content-library/settings"]').click() 
    cy.contains('a', "Client HQs").click()*/  //Apparently, this link is covered up by the parent div, but it was fine in the before hook??? 
    cy.visit("https://automation.pathfactory-staging.com/authoring/content-library/settings/organization-management")
    cy.contains('a', /^automation$/).click()
    cy.get(toggle_id).then((toggle)=>{
        let color = toggle.css("background-color") 
        if (color == 'rgb(0, 169, 203)'){
            toggle.click()
        }
    })
}

export const configure_webdomain = (config) => {
    // Required keys in the config object: domain, enableTracking, cookieConsentRequired
    cy.get('[data-qa-hook="title-bar"]').invoke('text').then((text)=>{
        if(text !== 'Website Domains'){
            cy.log("Going to webdomain area")
            cy.visit('https://automation.pathfactory-staging.com/authoring/content-library/settings/organization/website-domains')
        } else {
            cy.log("Already in webdomain area")
        }
    })
    cy.get('[data-qa-hook="website-domain-url"]').contains(config.domain).parent().within((parent)=>{
        // It was extremely annoying figuring out how to click this edit pencil which requires a hover over another element to make it visible
        // Cypress doesn't have a hover function, and force clicking an invisible element is one workaround they offered 
        cy.get('i[title="Edit"]').click({force: true})
    })
    toggle('[data-qa-hook="enabled"]', 'on')
    config.cookieConsentRequired ? toggle('[data-qa-hook="requireCookieConsent"]', 'on') : toggle('[data-qa-hook="requireCookieConsent"]', 'off')
    config.enableTracking == false ? toggle('[data-qa-hook="enabled"]', 'off') : null 
    cy.get('button').contains('Update').then((button)=>{
        let disabled = button.prop('disabled')  //Gotta use jquery for this 
        cy.log(`Disabled variable value: ${disabled}`)
        if (disabled) {
            cy.contains('Cancel').click()
        } else {
            cy.contains('Update').click() 
        }
    })
}

export const toggle = (toggle_id, on_or_off) => {
    cy.get(toggle_id).then((toggle)=>{
        let color = toggle.css("background-color") 
        if (color == 'rgb(0, 169, 203)' && on_or_off == 'off'){
            toggle.click()
        } else if (color == 'rgb(221, 221, 221)' && on_or_off == 'on'){
            toggle.click()
        }
    })
}