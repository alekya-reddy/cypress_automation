import { createAuthoringInstance } from '../support/pageObject.js';

const defaultOrg = createAuthoringInstance({env: 'pathfactory-staging', org: 'default', username: 'Bobman', password: 'Password123', customBaseUrl: 'https://default.staging2.lookbookhq.com'}); 

const domain = `${Cypress.env('TEST_ENV')}-wp.com`
const domain_inactive_message = "To activate the promoter, contact your administrator to enable the domain" 

describe('Various proof of concept tests', function() {
    it('should successfully do stuff in a different org than automation-org', function(){
        defaultOrg.common.login();
        defaultOrg.vex.addVirtualEvent('Test 2');
    })
})