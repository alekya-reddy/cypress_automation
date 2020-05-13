To open debugger while you are writing/editing test files, navigate to the Cypress folder (or just open termina in Visual Code), then type into command line: 

npx cypress open 

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






Plans for how to organize cypress test repo: 

-Use classes to represent the organization of our app
-These classes will contain the links to various parts of the app (content library, settings, target etc)
-These classes will contain the locators to various elements in the app
-These classes will contain any text that we need to check against (like the page titles)
-These classes will contain helper functions

-To use these classes in a test file, build a new page object from that class at beginning of each test file --> a single line at the top

-There will be an authoring class to represent locators, links and helper functions that are accessible or present in all parts of the application
-For example, the navigation links, the top menu to access org settings, common generic elements such as toggles and checkboxes - these would be part of the authoring class
-The authoring class will have children classes representing each different aspect of the app. Example, target, recommend, website tools, web ex, settings, clienthq etc
-Children classes will inherit all properties from the parent authoring class, so all children classes will have access to the same locators as the parent authoring class, just like in the actual application
-Any part of the app that is accessible via the same url is considered part of the same class.
-For example, anything only accessible from https://newqa.pathfactory-qa.com/authoring/content-library/content is considered as part of the content-library class
-On consumption side, these classes can follow the same organization
