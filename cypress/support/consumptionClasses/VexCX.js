import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.eventHeroTitle = "div[class^='pf-event-hero-title']";
        this.eventHeroSubtitle = "div[class^='pf-event-hero-subtitle']";
        this.eventContentTitle = ".pf-event-main-title";
        this.eventContentDescription = ".pf-event-main-description";
        this.zoomRootDiv = '#zmmtg-root';
        this.zoomIframe = "iframe[src^='/api/virtual_event_sessions']";
        this.sessionPageTitle = "div[class^='pf-event-session-title']";
        this.sessionCardTitle = "div[class^='pf-event-session-card-title']";
        this.firstNameInput = "#firstName"; // Should remove in future as this is now in CommonCX.js 
        this.lastNameInput = "#lastName";  // Should remove in future as this is now in CommonCX.js 
        this.emailInput = "#email";  // Should remove in future as this is now in CommonCX.js 
        this.meetingPWInput = "#meetingPassword";
        this.closeContentButton = "button[title='Close']";
        this.sessionGroup = ".pf-event-sessions";
        this.sessionListItem = ".pf-event-session-list-item";
        this.sessionSidebar = ".pf-event-session-sidebar";
        this.vexHeader = ".pf-event-header";
        this.vexHeaderPopupMenu = ".rc-menu-submenu-title";
        this.vexHeroContainer = ".pf-event-hero-container";
        this.vexEventContainer = ".pf-event-container";
        this.vexHeaderMenuNoPopup = ".rc-menu-submenu";
        this.vexHeaderMenuItem = ".pf-menu-item";
        this.supplementalContent = ".pf-event-session-supplemental-content-list";
        this.vexFormTitle = ".pf-event-hero-form-title";
        this.vexFormDescription = ".pf-event-hero-form-description";
        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[title="YouTube video player"]',
            videoPlayer: 'video',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'getCurrentTime()', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) }
        };
        this.vimeo = {
            // Playing around on the dev console on regular browser, I'm blocked from accessing iframe due to cross-frame issue. I'm amazed I can bypass that through Cypess
            iframe: 'iframe[src*="vimeo"]',
            videoPlayer: 'video',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) }
        };
        this.vidyard = {
            iframe: 'iframe[class*="vidyard-iframe"]',
            videoPlayer: 'video',
            splashScreen: '[class^="splash-screen-thumbnail"]',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            clickSplashScreen: function(){ cy.invokeWithinFrame(this.iframe, this.splashScreen, 'click()') }
        };
        this.wistia = {
            // Wistia doesn't need an iframe, which is nice...
            videoPlayer: 'video',
            play: function(){ cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function(state){ cy.invokeJS(this.videoPlayer, 'paused', state) }
        };
        this.brightcove = {
            videoPlayer: 'video',
            play: function(){ cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function(state){ cy.invokeJS(this.videoPlayer, 'paused', state) }
        };
        this.zoom = {
            iframe: "iframe",
            container: '#zmmtg-root'
        };
        this.webex = {
            iframe: "iframe[src^='/api/virtual_event_sessions/']",
            video: "video",
            meetingControls: ".meeting-controls",
            meetingInfo: ".meeting-info"
        }
        this.rocketChat = {
            iframe: "iframe[src*='rocket.pathfactory']",
            container: "#rocket-chat",
            messageInput: "textarea[name='msg']",
            moderatorViewButton: "button:contains('Open Moderator View')"
        };
        this.landingPage = {
            block: ".pf-html-block"
        };
        this.messages = {
            maxAttendeesReached: "Unfortunately you are unable to join this session as the maximum number of attendees has been reached.",
            blacklisted: "You are no longer eligible to access this event. Please contact your event administrator for more information"
        };
    }

    expectZoom(){
        cy.waitForIframeToLoad(this.zoom.iframe, this.zoom.container, 20000)
        cy.getIframeBody(this.zoom.iframe).within(()=>{
            cy.get(this.zoom.container).should('exist')
        })
    }

    expectYoutube(){
        cy.waitForIframeToLoad(this.youtube.iframe, this.youtube.videoPlayer, 20000)
        cy.getIframeBody(this.youtube.iframe).within(()=>{
            cy.get(this.youtube.videoPlayer).should('exist')
        })
    }

    expectVimeo(){
        cy.waitForIframeToLoad(this.vimeo.iframe, this.vimeo.videoPlayer, 20000)
        cy.getIframeBody(this.vimeo.iframe).within(()=>{
            cy.get(this.vimeo.videoPlayer).should('exist')
        })
    }

    expectVidyard(){
        cy.waitForIframeToLoad(this.vidyard.iframe, this.vidyard.videoPlayer, 20000)
        cy.getIframeBody(this.vidyard.iframe).within(()=>{
            cy.get(this.vidyard.videoPlayer).should('exist')
        })
    }

    expectRocketChat(){
        cy.waitForIframeToLoad(this.rocketChat.iframe, this.rocketChat.container, 20000)
        cy.getIframeBody(this.rocketChat.iframe).within(()=>{
            cy.get(this.rocketChat.container).should('exist')
        })
    }

    expectWebex(link){
        cy.waitForIframeToLoad(this.webex.iframe, this.webex.meetingControls, 20000)
        cy.getIframeBody(this.webex.iframe).within(()=>{
            cy.get(this.webex.video, {timeout: 10000}).should('exist')
            cy.get(this.webex.meetingControls, {timeout: 10000}).should('exist')
            link ? cy.contains(this.webex.meetingInfo, link, {timeout: 10000}).should('exist') : null
        })
    }

    chat(config){
        const message = config.message
        const user = config.user 

        cy.getIframeBody(this.rocketChat.iframe).within(()=>{
            cy.get(this.rocketChat.container).should('exist')
            cy.get(this.rocketChat.messageInput).type(`${message}\n`)
            cy.contains(message).should('exist')
            cy.contains(user).should("exist")
        })
    }

    verifyLandingPageBlock(config){
        // This should be the same config object as the one passed into authoring method 'addAdvancedBlock'
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options color, textAlign // color: {r, g, b} is the only format that will be checked - hex not checked 
        const className = config.className // Required to locate html block
        const sessionGroup = config.sessionGroup
        const expectSessions = config.expectSessions
        const expectNoSessions = config.expectNoSessions
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units, recommend using only pixels 

        if(className && !sessionGroup){
            let locator = `.${className}`
            cy.get(locator).invoke("attr", "style").then((style)=>{
                if(typography && typography.textAlign){
                    expect(style).to.include(`text-align: ${typography.textAlign}`)
                }
                if(typography && typography.color && !typography.color.hex){
                    expect(style).to.include(`color: rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
                }
                if(background && background.color && !background.color.hex){
                    expect(style).to.include(`background-color: rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
                }
                if(background && background.image.url){
                    expect(style).to.include(background.image.url)
                }
                if(background && background.position){
                    expect(style).to.include(`background-position: center ${background.position}`)
                }
                if(background && background.size){
                    expect(style).to.include(`background-size: ${background.size}`)
                }
                if(spacing){
                    expect(style).to.include(`padding: ${spacing}`)
                }
            })
            if(checkContent && checkContent.text){
                checkContent.text.forEach((text)=>{
                    cy.contains(locator, text).should("exist")
                })
            }
            if(checkContent && checkContent.locators){
                checkContent.locators.forEach((checkLocator)=>{
                    cy.get(locator).within(()=>{
                        cy.get(checkLocator).should("exist")
                    })
                })
            }
        }
        
        if(sessionGroup){ // session group blocks have to be checked entirely different way
            let blockLocator = this.sessionGroup
            cy.contains(blockLocator, sessionGroup).should("exist")
            if(heading){
                cy.contains(blockLocator, sessionGroup).within(()=>{
                    if(heading.color && !heading.color.hex){
                        cy.get("h4").should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                    }
                    if(heading.textAlign){
                        cy.get("h4").should("have.css", 'text-align', heading.textAlign)
                    }
                })
            }
            if(expectSessions){
                expectSessions.forEach((session)=>{
                    cy.contains(this.sessionCardTitle, session).should('exist')
                })
            }
            if(expectNoSessions){
                expectNoSessions.forEach((session)=>{
                    cy.contains(this.sessionCardTitle, session).should("not.exist")
                })
            }
            if(background && background.color && !background.color.hex){
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.contains(blockLocator, sessionGroup).invoke("css", "background-image").should("have.contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.contains(blockLocator, sessionGroup).should("have.css", "padding", spacing)
            }
        }
    }
}