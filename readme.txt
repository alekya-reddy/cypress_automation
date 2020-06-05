How to setup cypress on your computer
--------------------------------------
Refer to https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements

Cypress has excellent documentation for how to setup, cypress api's, and general principles for testing with cypress. 

This readme is just a running log of useful tidbits of information to help you get started. 



How to run tests on cypress
----------------------------

To open debugger while you are writing/editing test files, navigate to the Cypress folder (or just open termina in Visual Code), then type into command line: 

npx cypress open 

or

node_modules/.bin/cypress open

Then, from the window that opens, double click the file you want to run
If using debugger, you can set your env variables in cypress.json (for example, TEST_ENV=pathfactory-staging)

If you are done editing, and just want to run one specific file, you can type into terminal: 

npx cypress run --env TEST_ENV=pathfactory-qa --browser chrome --spec cypress/integration/new_website_test.js

From above, you can infer that --env allows you To declare whatever env variables you want (env variables must be separated by a comma). 
This is equivalent to declaring env variables in cypress.json, and the way you call it in the test file is the same, eg Cypress.env('TEST_ENV')
Declaring env variables in the command line will overrite whatever is in cypress.json, so you don't have to worry about deleting it from cypress.json when using command line 
You can set whatever browser you want using --browser
You can run whichever file you want using --spec 

To turn off video recording, you can pass in argument --config video=false

eg) npx cypress run --env TEST_ENV=pathfactory-qa --config video=false  --browser chrome --spec cypress/integration/visit_other_domain_test.js




How the cypress repo is organized
---------------------------------

Use classes to represent the organization of our app:
-These classes will contain the links to various parts of the app (content library, settings, target etc)
-These classes will contain the locators to various elements in the app
-These classes will contain any text that we need to check against (like the page titles)
-These classes will contain helper functions

In essence, a class will contain locators, text, links and helper functions all in one file. 

To use these classes in a test file, build a new page object instance using these classes at beginning of each test file. You can leave blank parameters 
if going with default values for username, login and org, or specific which org, username, password 

There will be a common class to represent locators, links and helper functions that are accessible or present in all parts of the application. 
The common class also includes login functions even though these are not common elements to entire app - don't really want to create a seperate class for login 
For example, the navigation links, the top menu to access org settings, common generic elements such as toggles and checkboxes - these would be part of the common class
The common class will have children classes representing each webpage of the app. Example, target, recommend, website tools, web ex, org settings, clienthq etc

Children classes will inherit all properties from the parent common class, so all children classes will have access to the same locators as the common class, just like in the actual application
Any part of the app that is accessible only from a specific url should be considered part of the same class.
For example, anything only accessible from https://newqa.pathfactory-qa.com/authoring/content-library/content is considered as part of the content-library class.
There are cases where the same div[data-qa-hook='whatever'] can be found across multiple parts of the app. It could be that they are simply re-used generic components. 
A good example of this would the the modal, which is ubiquitous throughout our app. 
In this case, it would make sense to put into the locators for these ubiquitous componenents into the common class. 
However, it could also be that the same data-qa-hook or id for an element is just a coincidence and the developers could easily change it to something else later on. 
In this case, it is better to err on the side of putting the locator for this element into the child class (not the common class). 
Use your judgement. 

Avoid throwing every locator and helper function into the common class - I know this will be a temptation, but for the sake of keeping our 
code organized, readable, and maintainable, do not do this!

The commands.js file in support folder contains custom cypress functions. To keep things organized, only include functions here if they are useful functions for 
cypress testing in general. For example, a function that checks if an element with specific text exists, and if yes, invoke a callback. Any function which requires
app-spefific urls or locators should not go into the commands.js file - these should go into one of the classes. 

Use these rules of thumb to decide where a locator or function should go, or create a new class when the need arises 

On consumption side, these classes can follow the same organization principle 


Cypress quirks
--------------

Cypress documents all their limitations here:
https://docs.cypress.io/guides/references/trade-offs.html#Permanent-trade-offs-1

You cannot hover using cypress. You must use a workaround. If an element is only visible by hovering over another element, then use force click.
If you need to see the hover state of an element, use jquery to force it into hover state, as long as this is how the hover state is triggered. 
Cypress has documentation on this. 
 
You cannot open multiple tabs - they will never support this (according to their doc). 

You cannot visit 2 urls with different domains in the same it block. You can visit 2 urls with different domains on a separate it block each. 
However, if you use a beforeEach hook, and you visit a url in the beforeEach, then all it blocks can visit only that same url. 
You can get around this by using an it block as a before hook, and for beforeEach, you'll just have to copy and paste the beforeEach code to each it block. 

Cypress runs each cy.get command asynchronously. That means you can't save the returned element into a variable to be used later.
You have to work within the callback function. 
You can do a synchronous version of get by using Cypress.$('selector')

VERY IMPORTANT TO UNDERSTAND THE FOLLOWING: 
----------------------------------------------------------------------------------------------------------------------------------------------------------------
Cypress reads your test file, places each cy command it comes across into a queue, then when the end of your code is reached, all the 
queued up cy commands will run in the order in which they were generated by your code. 

A useful strategy to take advantage of this is to use cy.get('body'). As long as you are on an html page, this will always immediately return the body 
without taking any time. You can then chain a 'then' off this cy.get('body') and do anything you want inside the 'then', and be
guaranteed that it will all execute before the next cy command. 
----------------------------------------------------------------------------------------------------------------------------------------------------------------

Cypress will fail your test if it detects an uncaught exception error in the browser console. To turn this off, insert

beforeEach(() => {
    cy.log("Before every test in every spec file, prevent Cypress from failing our tests due to uncaught:exception error, which happens a lot in our application.")
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
})

into the index.js file. (I have already done this for our repo)

Cypress modifies app code to turn off what it thinks are useless pieces of code that interfere with Cypress. If this is interfering with your test,
you can turn it off by adding

 "modifyObstructiveCode": false

 to the cypress.json file. (I have already done this for our repo) 


You can't use promises in Cypress, or async await to get around its annoying asynchronous nature. Even if you find a workaround,
which I did, if you use any promise whatsoever, it'll completely screw up the order in which cy commands are run... a complete mess 
Here's an example of me trying to force a promise into cypress (leading to massive failure):

hasText(locator, matchText, waitTime){
        cy.log('checking if element has text')
        const executor = (resolve, reject) => {
            let textFound = false;
            let time = 0; 

            const checkText = () => {
                let elemText = Cypress.$(locator).text(); 
                textFound = elemText.includes(matchText); 
                time += 500;
                if (textFound == true){
                    clearInterval();
                    resolve("Text found");
                } else if (time > waitTime) {
                    clearInterval();
                    reject("Text not found");
                }
            }

            setInterval(checkText, 500);
        }

        return new Promise(executor);
   
    }

Cypress doesn't tell you which line failed, making it much harder to debug. Sure, it shows you snapshots of the webpage at each step, but I don't find that useful honestly...
I prefer to know exactly what line a test fails so that I can pause at that line and inspect the dom manually.



 Cypress useful tips
 -------------------

 See their documentation. Outside of that, here's a list of some useful tips

 -You can set wait times
 eg) cy.get('.my-slow-selector', {timeout: 10000})

 -Cypress wraps its elements in jquery, so you can use jquery to get and manipulate element properties 
 eg. Let's say you have element 'element' 
	element.css(“background-color”)  // This will return value of background-color 
	//.css() is a jquery function 

-You can also use vanilla javascript, but this is a pain as it requires you to get the document first, then work within that document 
eg) cy.document().then((doc)=>{  //write vanilla javascript here to manipulate dom elements   }) 


Conditional Testing Using Element Computed Styles (as in not declared in-line)
To do conditional checking by checking for element properties like background-color, you can get the background-color's value like this: 

cy.get('[data-qa-hook="enableWebsiteJourney"]').then((toggle)=>{
		let color = toggle.css("background-color") 
		if (color == 'rgb(221, 221, 221)'){
		toggle.click()
	}
})


Conditional Testing Using Element Attributes 
If the style, or other attribute is declared in-line like <div style='blah' class='blah' data-qa-hook='blah'>, then you can get the value of that attribute like so: 

cy.get('[data-qa-hook="enableWebsiteJourney"]').invoke('attr', 'data-qa-hook').then((attr)=>{
	cy.log(attr) // This will log the data-qa-hook 
})



Conditional Testing Using Element Text
If you want to get the Element's text for conditional testing, you can do it like this:

cy.get('[data-qa-hook="enableWebsiteJourney"]').invoke('text').then((text)=>{
	cy.log(text) // This will log the text on that element, which is ONOFF
})


Conditional Testing Using Absence/Presence of Element
If you want to something different depending on whether or not an element is present, you can do it like this:

cy.get('button').click()  //This will trigger some change which could do either A or B
cy.get('body').then(($body) => { 
	// synchronously query from body 
	// to find which element was created 
	if ($body.find('input').length) { 
		// if nothing found, length would be zero/undefined, and this is a falsy in javascript 
		return 'input' 
	} 
	// else assume it was textarea 
	return 'textarea' 
}).then((selector) => { 
	// selector is the string that was returned in previous function 
	cy.get(selector).type(`found the element by selector ${selector}`)
})



Using Vanilla Javascript to Manipulate the DOM
If you want to do this, you can try: 

cy.document().then((doc) => {
	//querySelector is vanilla javascript function to find elements 
	let elem = doc.querySelector('[data-qa-hook="enableWebsiteJourney"]')
	
	// getComputedStyle is vanilla js function to get non-in-line styles
	let style = getComputedStyle(elem)
	
	cy.log(style['background-color']) // Will log background color, style is css object 
	if(style['background-color'] == 'rgb(221, 221, 221)'){
		// Do something 
	}
})



When using cy.contains, always specific the element type if want to locate by element text
eg) cy.contains('button', 'button label')
If only do cy.contains('button label'), cypress might locate the lowest ordered element that contains the text, which could end up being a non-clickable span 
<button><span>button label</span></button>



-when using waits inside chained gets or contains, there is potential to fail. I suspect the reason is Cypress will immediately get the 
first set of elements matching the first 'get' before expected change happens, then in the chained contains, 
it will wait on that change from among the found elements. Since elements were pulled from an earlier state, Cypress will not find 
what you're expecting. 
-So if using wait times, make sure to do it all in a single command, not in a chained command 
eg) cy.get('elem').contains('text', {timeout: 10000}) --> potential to fail do this instead:
cy.contains('elem', 'text', {timeout: 10000})



to wait, use cy.wait(timeInMilliseconds)

to pause for debugging, use cy.pause()


POTENTIAL CATASTROPHIC SHOW-STOPPING PITFALLS!!!!!
---------------------------------------------------
 "modifyObstructiveCode": false 

 If you add the above to cypress.json, it will prevent Cypress from automatically turning off code that blocks cypress. 
 Apparently this is code that Cypress deems is unnecessary and obsolete and so would have zero impact on the app by turning it off...
 Still, kinda alarming that Cypress potentially needs to modify the website in order for it to work. That just doesn't seem like smart design to me, given they cannot
 possibly anticipate why a website would have these pieces of code in it. 

For some reason, when visiting consumption pages on our app, the pathfactory-staging domain will cause either promoters to not show up, or cause VEX to become a 
blank screen. Changing to the lookbookhq domain will solve the issue. If you have Cypress open, once you visit a pathfactory-staging domain, even if you change 
domain back to lookbookhq in the test code and then re-run, this will not solve issue. You must CLOSE the cypress browser, then re-run for it to work. 

Cypress apparently runs its test inside an iframe. Websites that block iframes obviously are a problem. Well, it's a good thing Cypress automatically removes 
xframe options so that this is not a problem... Except when the website loads in other sites, perhaps in a frame, that have the same xframe option set to same 
origin. Then Cypress will crap out. Also, if you set chromeWebSecurity to false in cypress.json, this will prevent Cypress from automatically removing these 
xframe options. But why would you set chromeWebSecurity to false in the first place, you ask? Because you need to do that in order to implement the workaround
to interact with elements inside an iframe!!!!!!!      

Cypress - stupidly designed, in my opinion. 