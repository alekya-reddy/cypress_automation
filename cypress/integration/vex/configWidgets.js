import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const widget = {
    name: "I am a widget",
    code: `<h1>Hello world`, // typing <h1> will automatically add </h1>
    newName: "New Name",
    newCode: `<h1>Bye world`,
    live: true,
    onDemand: true
}

const scriptWidget = {
    name: "configWidgets1.js",
    publicName: "Public Name",
    code: `
    <div id="test">Hello</div>
    <button onclick="addText()">Add Text Div</button>
    <script>
        function addText() {
            var node = document.createElement("H1");
            var textnode = document.createTextNode("Text");     
            node.appendChild(textnode);                           
            document.getElementById("test").appendChild(node);
        }
    </script>
    `,
    live: true,
    onDemand: true
}

const widget2 = {
    name: "widget2",
    code: "nada",
    live: false,
    onDemand: false
}

const event = {
    name: 'configWidgets.js',
    slug: 'configwidgets-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "configWidgets",
    slug: "configwidgets",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

describe("Widget Configuration", ()=>{
    it("Test widget CRUD operations - Create, update, destroy - in the widget configurations", ()=>{
        authoring.common.login()
        authoring.configurations.visit.widgets()
        cy.contains(authoring.configurations.pageTitleLocator, authoring.configurations.pageTitles.widgets).should('exist')
        authoring.configurations.deleteWidgets([widget.name, widget.newName, widget2.name])
        authoring.configurations.addWidget(widget)
        authoring.configurations.addWidget(widget2)
        authoring.configurations.editWidget(widget)

        // Do some widget name input error validation in the add widget modal, and test cancel button for add widget modal 
        authoring.configurations.addWidget({name: widget.newName, checkSuccess: false})
        cy.contains("has already been taken").should('exist')
        cy.contains("button", "Cancel").click()
        cy.contains(authoring.configurations.modal, "Add Widget").should("not.exist")
        authoring.configurations.addWidget({name: " ", checkSuccess: false})
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()

        // Do some widget name input error validation in the sidebar
        authoring.configurations.addWidget(widget)
        cy.containsExact(authoring.configurations.table.cellName, widget.name).click()
        cy.get(authoring.configurations.widgets.previewName).click()
        cy.get(authoring.configurations.widgets.nameInput).clear().type(widget.newName)
        cy.contains("button", "Save").click()
        cy.contains("has already been taken").should('exist')
        cy.get(authoring.configurations.widgets.nameInput).clear() 
        cy.contains("button", "Save").click()
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()
        cy.get(authoring.configurations.widgets.nameInput).should('not.exist')
    })

    it("Add, remove widgets to a session and verify on consumption", () => {
        // Set up
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)
        authoring.vex.addSession(session.name)
        authoring.vex.configureSession(session)

        // Add/remove widgets, then configure them
        authoring.vex.addWidget(scriptWidget.name)
        authoring.vex.addWidget(widget.name)
        authoring.vex.addWidget(widget.newName)
        authoring.vex.addWidget(widget2.name)
        authoring.vex.configureWidget(scriptWidget)
        authoring.vex.configureWidget(widget)
        authoring.vex.configureWidget({name: widget.newName, live: true, onDemand: true})
        authoring.vex.configureWidget(widget2)
        authoring.vex.removeWidget(widget.newName)

        // Visit session and verify the expected widgets 
        cy.visit(session.url)

        // Expect scriptWidget
        cy.contains("span", scriptWidget.publicName, {timeout: 20000}).should("exist").click()
        cy.waitForIframeToLoad(consumption.vex.widget.iframe, "#test", 10000)
        cy.getIframeBody(consumption.vex.widget.iframe).within(() => {
            cy.contains("button", "Add Text Div").click()
        })
        cy.getIframeBody(consumption.vex.widget.iframe).within(() => {
            cy.containsExact("h1", "Text").should("exist")
        })

        // Expect widget
        cy.contains("span", widget.name, {timeout: 20000}).should("exist").click()
        cy.waitForIframeToLoad(consumption.vex.widget.iframe, "h1", 10000)
        cy.getIframeBody(consumption.vex.widget.iframe).within(() => {
            cy.contains("h1", "Hello world").should("exist")
        })
        //DEV-14464:'[VEX] Improve widget tabs display'
        //Validate that the widget tabs distribute evenly to widget if more than one widget tabs enabled.
         cy.get(consumption.vex.widget.widgetContainer).invoke('css','width').then(tabWidth=>{
            let index = tabWidth.indexOf("px");
            let TotalWidgetTabWidth = tabWidth.substr(0, index)
             cy.get('li').then(count=>{
                const widgetCount = (Cypress.$(count).length)-1;
                cy.get('li').each((count) => {
                    if (count === widgetCount+1){
                        return;
                    };
                    cy.get(count).invoke('css','width').then(actualWidth => {
                        let parts = actualWidth.split("px");
                        let actualWidgettabWidth = parts[0];
                        expect(actualWidgettabWidth).to.eq((TotalWidgetTabWidth/widgetCount).toString());
                    })
                  })
                })
            })
        // Widgets that should not be present
        cy.contains("span", widget2.name).should("not.exist") // This is turned off for both demand and live, so should not exist
        cy.contains("span", widget.newName).should("not.exist") // This was deleted so should not exist 

        // Delete a widget from the configuration settings and verify it is removed from both the session on authoring side and on consumption side
        // This test will fail due to app bug
        authoring.configurations.visit.widgets()
        authoring.configurations.deleteWidgets(widget.name)
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(session.name)
        authoring.vex.goToWidget()
        cy.contains(authoring.vex.widgets.listItem, widget.name).should("not.exist")
        cy.get(".ant-list-item-action").should("have.length", 2) // Only 2 widgets should remain listed of the 4 that were added
        cy.visit(session.url)
        consumption.vex.expectYoutube() // Needed only to wait for page to load before checking widget doesn't exist
        cy.containsExact("span", widget.name).should("not.exist")

        //DEV-14464:'[VEX] Improve widget tabs display'
        //Validate that the widget tab is equal to the container width when only one widget is present in widget container
        cy.get(consumption.vex.widget.widgetContainer).invoke('css','width').then(tabWidth=>{
            let index = tabWidth.indexOf("px");
            let TotalWidgetTabWidth = tabWidth.substr(0, index);
             cy.get('li').then(count=>{
                const widgetCount = (Cypress.$(count).length)-1;
                expect(widgetCount).to.equal(1);
                cy.get('li').invoke('css','width').then(actualWidth => {
                    let parts = actualWidth.split("px");
                    let actualWidgettabWidth = parts[0];
                    expect(actualWidgettabWidth).to.eq((TotalWidgetTabWidth/widgetCount).toString());
                })
            })
        })
    })
})