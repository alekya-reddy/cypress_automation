How to setup cypress on your computer
--------------------------------------
Refer to https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements

Cypress has excellent documentation for how to setup, cypress api's, and general principles for testing with cypress. 

This readme is just a running log of useful tidbits of information to help you get started. 



How to run tests on cypress
----------------------------

To open test-runner, navigate to the Cypress folder (or just open termina in Visual Code), then type into command line: 

npx cypress open 

or

node_modules/.bin/cypress open

Then, from the window that opens, click the file you want to run

To set the server you are running on (QA, Staging, Prod), set the TEST_ENV variable in cypress.json (for example, TEST_ENV=pathfactory-staging)

Using the UI, you can run all spec files (they MUST be inside the integration folder).
You can also run just 1 specific file by clicking on it. 

You can also run files from the command line: 

npx cypress run --env TEST_ENV=pathfactory-qa --browser chrome --spec cypress/integration/new_website_test.js

Note: you do not need to include the --env parameter if you already have it in the cypress.json file. Values passed through the command line will override
values you set in cypress.json

If you want to run a selection of files, one method is to copy the files you want to run into a separate folder (I have set up the runSelectFiles folder for this).
Then, in commpand line, specify that folder: 

npx cypress run --browser chrome --spec cypress/integration/runSelectFiles/*  

Alternatively, type out the command you want, including all the spec files you want to run, into a text document and then copy+paste onto the terminal. 
I have created the file runSelectFiles.txt for this purpose. It's much easier to edit the specs in this .txt document than to do it on the command line. 

If you want to run files in a specific order, one way is to number the files (Cypress sorts them alphanumerically).
Alternatively, use the runSelectFile.txt. Type out the 'npx cypress run' command for each spec file in the order that you want in the .txt file,
making sure the format comforms the bash syntax. Then, in the terminal, type the command -sh <path to your .txt file>
Eg) sh runSelectFiles.txt 
Note that doing it this way has drawbacks. You will not get a summary of passed/failed tests files, so you need to readh them individually in the terminal. 
More importantly, each test file needs to open and close the cypress app, which takes extra time. If you have many specs, this will add significantly to run time. 

There is NOT a built-in way to run spec files in a specific order without using these workarounds. 


When running on command line, --env allows you To declare whatever env variables you want (env variables must be separated by a comma). 
This is equivalent to declaring env variables in cypress.json, and the way you call it in the test file is the same, eg Cypress.env('TEST_ENV')
Declaring env variables in the command line will overrite whatever is in cypress.json, so you don't have to worry about deleting it from cypress.json when using command line 
You can set whatever browser you want using --browser
You can run whichever file you want using --spec 

To turn off video recording, you can pass in argument --config video=false 
You can also set this in cypress.json (which I have already)

eg) npx cypress run --env TEST_ENV=pathfactory-qa --config video=false  --browser chrome --spec cypress/integration/visit_other_domain_test.js

Note: You cannot set --browser in the cypress.json file. You have to do it in the command line. 


How to run cypress on CircleCI
------------------------------
To do this, the cypress repo needs a config.yml file, which I have already added 

This file is the 'orb' that circleci needs to be able to run the tests on circleci

The 'orb' is basically just a configuration file telling circleci what to do 

Refer to these links for how to construction the 'orb':

https://github.com/cypress-io/cypress-realworld-app/blob/develop/.circleci/config.yml
https://github.com/cypress-io/cypress-docker-images/tree/master/browsers#cypressbrowsers
https://circleci.com/orbs/registry/orb/cypress-io/cypress

You can sign up for a personal circleci account. Create a clone of the cypress repo in your own github, and connect it to circleci 

With every commit to this repo, circleci will automatically detect that and re-run the entire test suite 


How the cypress repo is organized
---------------------------------

Classes represent the different sections of our app (A 'section' is defined as any page or group of pages that is accessible via the same url path):
-These classes will contain the links to various parts of the app (content library, settings, target etc)
-These classes will contain the locators to various elements in the app
-These classes will contain any text that we need to check against (like the page titles)
-These classes will contain helper functions

In essence, a class will contain locators, text, links and helper functions all in one file. 

To use these classes in a test file, build a new page object instance using these classes at beginning of each test file. You can leave blank parameters 
if going with default values for username, login and org, or specific which org, username, password 

import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

The common class contains locators, links and helper functions that are accessible or present in all parts of the application. 
The common class also includes login functions
For example, the navigation links, the top menu to access org settings, common generic elements such as toggles and checkboxes - these would be part of the common class
The common class has children classes representing each section of the app. Example, target, recommend, website tools, web ex, org settings, clienthq etc

Children classes inherit all properties from the parent common class, so all children classes will have access to the same locators as the common class, just like in the actual application
Any part of the app that is accessible only from a particular url path should be considered part of the same class.
For example, anything only accessible from https://newqa.pathfactory-qa.com/authoring/content-library/content is considered as part of the content-library class.
There are cases where the same div[data-qa-hook='whatever'] can be found across multiple parts of the app. It could be that they are simply re-used generic components. 
A good example of this would the the modal, which is ubiquitous throughout our app. 
In this case, it would make sense to put into the locators for these ubiquitous componenents into the common class. 
However, it could also be that the same data-qa-hook or id for an element is just a coincidence and they are not intended to represent the same thing. For example,
id='name' for an input element, and id=name for a div element that contains something's name. In this case, put the element into the child class. 
In general, it is better to err on the side of putting the locator into the child class rather than the common class. If it becomes apparent later on that this element 
is reused throughout the app, then it is easy to copy the locator and paste into the common class. Since common class is the parent, all child classes still have access to it. 
Use your judgement. 

Avoid throwing every locator and helper function into the common class - I know this will be a temptation, but for the sake of keeping our 
code organized, readable, and maintainable, do not do this!

The commands.js file in support folder contains custom cypress functions. To keep things organized, only include functions here if they are useful functions for 
cypress testing in general. For example, a function that checks if an element with specific text exists, and if yes, invoke a callback. Any function which requires
app-spefific urls or locators should not go into the commands.js file - these should go into one of the classes. 

Use these rules of thumb to decide where a locator or function should go, or create a new class when the need arises 

On consumption side, these classes can follow the same organization principle 

The constants.js file contains all the details for each org and their users, and any other global variables.

The pageObject.js file contains the functions that build the authoring and consumption page objects using the classes.  


Automation Testing Using Multiple Orgs
---------------------------------------
Now that we are switching over to Cypress, this is the perfect opportunity to change the way we do automation testing. We will no longer do automation testing only 
one 1 organzation. This creates many problems where previous test files contaiminate the environment, causing test failues for subsequent tests. By splitting our 
tests up into different orgs, we reduce the chances of this happening. Furthermore, by having different orgs, this eliminates the need to go into client hq to toggle
features on and off. For new features such as website tools or vex, this will save a lot of time and reduce test flakiness - simply by having fewer steps. 

Another benefit of separating out testing into different orgs is that it avoids multiple people running automation tests on the same organization. If you are testing 
vex, and I am testing target, we will be running automation tests on 2 different orgs. This will avoid much of the flakiness that we see with our old Capybara repo. 

Each of our products should have its own organization. For example, 1 org for VEX, 1 for target, 1 for recommend etc.  

To build the page_object for different orgs, you need to specificy only the organization's subdomain, and the tld that you want to use. 

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const authoring2 = createAuthoringInstance({org: 'automation', tld: 'pathfactory'})

The page_object builders will automatically construct the correct baseUrl based on these inputs and the TEST_ENV 
Assuming you have set up the org in the constants.js file, the page_object builder will automatically know which user to use for your automation testing 

You can also specify the baseUrl directly, as well as the user info 

const authoring3 = createAuthoringInstance({ customBaseUrl: "default.pathfactory-staging.com", username: 'billybob', password: "billy123" })


Cypress Limitations
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

Cypress doesn't have built-in functions to handle iframes. I have workarounds for that in the commands.js file - basically, go into the javascript directly. 

Since Cypress runs tests inside an iframe, it has to modify iframe-busting code to make it work. The only case where this will fail is if a script is coming from
a different domain than the current page. In this case, whatever UI elements the script is supposed to drop onto the webpage will get blocked by the iframe busting
code. FOR THIS REASON:

1) WHEN TESTING ON CONSUMPTION, YOU MUST ALWAYS VISIT on HTTPS PROTOCOL AND YOU MUST ALWAYS VISIT ON LOOKBOOKHQ DOMAIN. 

2) WE CANNOT TEST OLD WEBSITE CAMPAIGN PROMOTERS AND WEBSITE TOOLS ON CONSUMPTION BECAUSE THE WEBPAGE WILL BE A DIFFERENT DOMAIN FROM THE LOOKBOOKHQ SCRIPT

The only solution to the above is if we get the developers to change

if(window.self===window.top||"overlay"===e||"preview"===e) to if(window.Cypress||window.self===window.top||"overlay"===e||"preview"===e) 

This should apply to the following scripts: 
https://app.cdn.lookbookhq.com/staging2/jukebox/current/tracks.js?x=2
https://app.cdn.lookbookhq.com/qa/jukebox/current/tracks.js?x=2
https://app.cdn.lookbookhq.com/production/jukebox/current/tracks.js?x=2



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


You can't use promises in Cypress, or async await to get around its asynchronous nature. Even if you find a workaround,
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



Annoying Cypress Bugs
-----------------------
Any click event in the after block fails if one of the tests in an it block fails.


