describe('VEX - Consumption', function(){
    /*it('Testing wikipedia iframed in glitch', function(){
            cy.visit('https://pathfactory-new-website.glitch.me/has-title-and-thumbnail')
            cy.getIframeBody("#frame-id").contains('h1', 'Chestnuts Long Barrow').should('exist')
            cy.getIframeBody("#frame-id").contains('a', 'About Wikipedia').click()
            cy.wait(3000)
            cy.getIframeBody("#frame-id").contains('h1', 'Wikipedia:About').should('exist')
    })*/

    it("Test VEX that has youtube in iframe", function(){
        cy.visit('https://automation.staging2.lookbookhq.com/vexconsumption-js/youtube')
        cy.waitForIframeToLoad("#widget2", "#player", 30000)
        cy.getIframeBody("#widget2").within(()=>{
            cy.get('#player').should('exist') //.contains('a', 'Falcon Heavy & Starman', {timeout: 5000}).should('exist')
        }) 
        
        //cy.shouldExistInIframe("#widget2", "#player").within(()=>{ cy.get('[class="html5-video-container"]').should('exist') }) 
    })
})