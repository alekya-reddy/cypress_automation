import { createAuthoringInstance } from '../support/pageObject.js';
import { constants } from '../support/constants.js';

const authoring = createAuthoringInstance({customBaseUrl: `https://automation.${constants.lookbookhqDomain}`}); 

describe('Switch domain back to pathfactory or else some of our Capybara tests will fail', function() {
    it("Shouldn't have to do this, but that's Cypress for ya...", function(){
        authoring.common.login();
        authoring.clientHQ.switchDomain(constants.pathfactoryDomain)
    })
})