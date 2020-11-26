How to setup cypress on your computer
--------------------------------------
Refer to https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements

Then download the repo. There's hardly any setup required. 

Cypress has excellent documentation for how to setup, cypress api's, and general principles for testing with cypress. 

This readme is just a running log of useful tidbits of information to help you get started. 



How to run tests on cypress
----------------------------

To open the test-runner, which is used for debugging, navigate to the Cypress folder (or just open terminal in Visual Code), then type into command line: 

npx cypress open 

or

node_modules/.bin/cypress open

Then, from the window that opens, click the file you want to run.

The TEST_ENV variable in cypress.json controls which test environment you are running on (for example, TEST_ENV=staging). 

Using the UI, you can run all spec files (they MUST be inside the integration folder). You can also run just 1 specific file by clicking on it. 

If you're not debugging and just want to run a file, you can run from the command line: 

npx cypress run --env TEST_ENV=qa --browser chrome --spec cypress/integration/new_website_test.js

Note: you do not need to include the --env parameter if you already have it in the cypress.json file. Include this in the command line only if 
you want to override the values you set in cypress.json

If you want to run a selection of files, specify them in cypress.json. Simply add the the key "testFiles" and value as an array of strings.
Each string is a glob pattern of the files or folder of files you want to run. Note that Cypress matches anything you provide in this array WITHIN 
the cypress/integration folder... so don't include cypress/integration in the glob patterns. To start the runner, type into the command line: 
npx cypress run --browser chrome 

For example,

{
	"testFiles": ["test_lab.js", "vex/configWidgets.js"] 
}

{
	"testFiles": ["vex/*] // This runs all spec files within the vex folder 
}

Alternatively, you can specifiy the specs directly in command line: 

npx cypress run --browser chrome --spec cypress/integration/vex/*  
npx cypress run --browser chrome --spec cypress/integration/test_lab.js,cypress/integration/vex/configWidgets.js // separate each glob pattern by comma, no spaces in the command line 

If you need to run your files in a specific order, one way is to number the files (Cypress sorts them alphanumerically). Other than this, there is no way to force 
Cypress to run them in any particular order. Avoid having to do this in the first place. 


Some notes about the cypress.json configuration file
-----------------------------------------------------
To turn off video recording, you can pass in argument --config video=false 
You can also set this in cypress.json (which I have done already)

eg) npx cypress run --env TEST_ENV=qa --config video=false  --browser chrome --spec cypress/integration/visit_other_domain_test.js

Note: You cannot set --browser in the cypress.json file. You have to do it in the command line. 


How to run cypress on CircleCI
------------------------------
To do this, the cypress repo needs a config.yml file, which I have already added.

This file makes use of Cypress's 'orb' that handles most the configuration that circleci needs to be able to run the tests.

Refer to these links for how to configure the config.yml file (how to change the browser version etc):

https://github.com/cypress-io/cypress-realworld-app/blob/develop/.circleci/config.yml
https://github.com/cypress-io/cypress-docker-images/tree/master/browsers#cypressbrowsers
https://circleci.com/orbs/registry/orb/cypress-io/cypress

You can sign up for a free personal circleci account. Create a clone of the cypress repo in your own github, and connect it to circleci. This is useful to have
if you want to run tests without eating up Pathfactory's circleci credits. Free accounts get 2.5 hours each week (resets at end of Sunday). This might not be 
necessary if Pathfactory has tons of credits that we can't possibly use up... but just in case, set up a free account for yourself.

I have also set up our cypress repo on our Pathfactory's circleci account. Let's only use this for our biweekly regression runs. 

With every commit to this repo, circleci will automatically detect that and re-run the entire test suite. To avoid this, you must manually stop the build.
There is no way to prevent an automatic run with each commit. 
Every minute that is used in a run consumes circleci "credits" - so let's not waste these on builds we don't intend to run. 

We can specify what files to run on circleci either on the cypress.json or on the config.yml. Here's an example of how to specify files to run in the config.yml:

version: 2.1
orbs:
  cypress: cypress-io/cypress@1
executors:
  latest-chrome:
    docker:
      - image: "cypress/browsers:node14.7.0-chrome84"
workflows:
  build:
    jobs:
      - cypress/run:
          executor: latest-chrome
          browser: chrome
          spec: 
            "cypress/integration/test_lab.js,\
            cypress/integration/vex/configWidgets.js"

Note that the spec key contains a string value. Each glob pattern is separated by a comma (no spaces). For readability, I suggest listing out the glob patterns 
like I have done in the example above. The back slash \ simply means the string continues starting with the next line.

However you choose to list the specific files to run on circleci, you would need to push a PR up to the repo. This will trigger a run using your modified config.yml
OR cypress.json file. However, since you don't actually want to merge this PR into the master branch, after you are finished running, simply close the PR. You can keep 
the branch for future runs where you only want to run a select set of files. This is the only way to tell circleci what files to run. There is no way to utilize their
web app to pick and choose which files to run. 

I DID find a potential workaround on the internet about how to run specific files on circleci without having to push a commit. 
See https://discuss.circleci.com/t/efficiently-testing-configuration-file-migrating-to-2-0/11620
But I couldn't get this to work. I'll explain it here regardless....
In summary, the following is typed into the command line, or for convenience, type it into a .txt file and run it as a script in the command line. 

curl --user {circle_ci_api_token}: \
		--request POST \
		--form revision={git_SHA} \
		--form config=@.circleci/config.yml \
		--form notify=false \
		https://circleci.com/api/v1.1/project/github/{github_organization_name}/{repo_name}/tree/{branch_to_run_on}

circle_ci_api_token can be created using the circleci web app. Go to project settings and you should see the option to create api tokens. For type of token, choose 'all'. 
git_SHA is just the SHA # of any commit to the repo - doesn't have to be the latest commit. 

What the above does is it takes the most recent commit on the branch to run on and modifies the config.yml with the new one that you provide in your LOCAL config.yml.
I couldn't get this to work as it was translating my local config.yml incorrectly - it was missing keys, and added curly braces for some reason. 
So for now, just push a PR to the repo with the files you want to run listed in either the config.yml OR the cypress.json file, then close the PR when done. 
It's honestly not that inconvenient, although I wished circleci had some way to control the config.yml directly through their web app.  


How to run modules in parallel on circleci
------------------------------------------
Here's an example config.yml file: 

version: 2.1
orbs:
  cypress: cypress-io/cypress@1
executors:
  latest-chrome:
    docker:
      - image: "cypress/browsers:node14.7.0-chrome84"
workflows:
  build:
    jobs:
      - cypress/run:
          executor: latest-chrome
          browser: chrome
          spec: "cypress/integration/vex/blackList.js"
      - cypress/run:
          executor: latest-chrome
          browser: chrome
          spec: "cypress/integration/test_lab.js"

Each "cypress/run" is run in parallel. Simply specify in "spec" what folders to run for that module 


How the cypress repo is organized
---------------------------------

Classes represent the different sections of our app (A 'section' is defined as any page or group of pages that is accessible via the same url route):
-These classes will contain the links to various parts of the app (content library, settings, target etc)
-These classes will contain the locators to various elements in the app
-These classes will contain any text that we need to check against (like the page titles)
-These classes will contain helper functions

In essence, a class will contain locators, text, links and helper functions all in one file. 

Here is a list of existing and planned authoring classes and the part of the app that they represent (pretty self explanatory):
- Common -> for any common elements/components present in 2 or more areas of our app (USE SPARINGLY - AVOID PUTTING THINGS HERE IF IN DOUBT)
- Settings -> for organization settings (this includes settings, cookie consent, access protection... all of the tabs here)
- ClientHQ -> for client hq 
- UserManagement -> for user management 
- ContentLibrary -> for content library
- Vex -> for VEX
- Target -> for target
- Recommend -> for recommend
- Explore -> for explore 
- Website -> for website campaigns
- WebsiteTools -> for website tools 
- Microsites -> for microsite builder 
- Configurations -> for any part of our app that is accessible via the gear icon (the configuration settings), including webhooks, access protection, image library etc

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


A New Way To Do Automation Testing
---------------------------------------
If/when we switch over to Cypress, this is the perfect opportunity to change the way we do automation testing. I propose that we no longer do automation testing only
within one organization. This creates many problems where previous test files contaminate the environment, causing test failures for subsequent tests. By splitting our
tests into different orgs, we reduce the chances of this happening. Furthermore, by having different orgs, this eliminates the need to go into client hq to toggle
features on and off. For new features such as website tools or vex, this will save a lot of time and reduce test flakiness - simply by having fewer steps.

Another benefit of separating into different orgs is that it avoids multiple people running automation tests on the same organization. This is another source of flakiness.
If you haven't noticed, 2 people making changes to the organization at the same time causes everything to slow down. With the new way, we can run parallel modules (such as target and VEX)
at the same time without having to worry about increased test flakiness.

Each of our products should have its own organization. For example, 1 org for VEX, 1 for target, 1 for recommend etc.
Our repo should follow the same organization, i.e. Recommend has its own folder, VEX has its own folder, website tools has its own folder.
Within, say, the VEX folder, ALL vex-related test files go in here regardless of whether or not these are 'consumption' or 'authoring' tests.
It doesn't make sense to test 'authoring' and 'consumption' in isolation because authoring affects consumption.
Same thing with settings related tests. If a setting affects target, recommend, and vex, then we should write separate tests for this setting in the
target, recommend and vex folders respectively rather than separate out this test file into a 'settings' folder.

With respect to the sharing of resources by multiple test files, this is fine, and could save a lot of set up time, as long as these 
resources are clearly marked as "common resources". Common resources could be a content asset, a content type, a language, an appearance, etc. 
For example, a content asset could have in its description "For general use by any automation tests". A language could be named "For general use". 
A form that could be used across multiple test files could have in its description "For general use by any automation tests". 
To standardize how resources are marked as 'common', let's use the phrases "General use" or "Common resource" in either the name or description.  
Any such resource marked as a "common resource" should NOT be deleted, edited, modified in any way whatsoever. 
If a test file requires a content asset that needs to be modified, then this test file should have its own dedicated content asset for use by this test file only 
- and clearly marked as such by naming the asset after the test file.

Test files should ideally include a setup block at the beginning which checks whether or not setup was already done. 
If not done, then do the set up. If already done, then skip the setup. This will save a ton of time by not having to do the setup with each and every test run. 
Furthermore, it makes it easier to setup on environments that aren't already set up. This avoids you having to manually setup on QA, then staging, then prod each time. 
This might not be possible with every test file, so judgement is required.

How the Page Object Works 
-------------------------
To build the page_object for an organization, you need to specify the organization's subdomain and the tld that you want to use.
Do this at the top of the test file. 

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const authoring2 = createAuthoringInstance({org: 'automation', tld: 'pathfactory'})

"authoring" is now a page object loaded with all the locators and helper functions that you will need. 
see pageObject.js to see how the page object is organized.

The page_object builder will automatically construct the correct baseUrl based on the org, tld and TEST_ENV as long as you have already set up the org 
in the constants.js file. The page_object builder will also automatically know which user to use for your automation testing if you have specified a 
default user in the constants.js file. 

You can also specify the baseUrl directly, as well as the user login credentials:

const authoring3 = createAuthoringInstance({ customBaseUrl: "default.pathfactory-staging.com", username: 'billybob', password: "billy123" })


Cypress Limitations
-------------------

Cypress documents all their limitations here:
https://docs.cypress.io/guides/references/trade-offs.html#Permanent-trade-offs-1

I'll just list the most relevant ones:
 
1) You cannot open multiple tabs - they will never support this (according to their doc). There are workarounds. 

2) You cannot visit 2 urls with different domains in the same it block. You can visit 2 urls with different domains on separate it blocks. 
However, if you use a beforeEach hook, and you visit a url in the beforeEach, then all it blocks can visit only that same url. 
You can get around this by using an it block as a before hook, and for beforeEach, you'll just have to copy and paste the beforeEach code to each it block. 

It is rare that limitations 1) and 2) will actually prevent you from doing the testing that you need. 
So far, I have encountered only 1 situation where I cannot find a workaround. In VEX rocket chat, as a moderator, I can open up rocket chat on a separate tab. 
This can be circumvented simply by visiting the rocket chat url in a separate it block, however, I would lose the visitor id cookie, preventing me from 
remaining logged into rocket chat. However, rocket chat is a 3rd party application, and there is no point testing a 3rd party app - they should be testing their 
own apps. 

Another situation where limitations 1) and 2) might be a problem are clicking links that open a new tab to a different domain. In this case, simply check for 
the href value in the anchor tag. It is unnecessary to test that clicking such a link does what it's supposed to because you'd be testing whether or not 
html itself is bugged. If so, then it's not just our app that has problems, but the entire internet. 

3) Since Cypress runs tests inside an iframe, it has to modify iframe-busting code to make it work. The only case where this will fail is if a script is coming from
a different domain than the current page. In this case, whatever UI elements the script is supposed to drop onto the webpage will get blocked by the iframe busting
code. FOR THIS REASON:

i. WHEN TESTING ON CONSUMPTION, YOU MUST ALWAYS VISIT on HTTPS PROTOCOL AND YOU MUST ALWAYS VISIT ON LOOKBOOKHQ DOMAIN. 

ii. WE CANNOT TEST OLD WEBSITE CAMPAIGN PROMOTERS AND WEBSITE TOOLS ON CONSUMPTION BECAUSE THE WEBPAGE WILL BE A DIFFERENT DOMAIN FROM THE LOOKBOOKHQ SCRIPT

The only permanent solution to the above is if we get the developers to change

if(window.self===window.top||"overlay"===e||"preview"===e) 
to 
if(window.Cypress||window.self===window.top||"overlay"===e||"preview"===e) 

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

Since Cypress runs each cy.get command asynchronously, that means you can't save the returned element into a variable to be used later.
You have to work within the callback function. 
You can do a synchronous version of get by using Cypress.$('selector')
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



Annoying Cypress Bugs to be aware of
------------------------------------
Any click event in the after block fails if one of the tests in an it block fails.



