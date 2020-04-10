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

