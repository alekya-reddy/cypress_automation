import { createAuthoringInstance } from '../support/pageObject.js';

const defaultOrg = createAuthoringInstance({env: 'pathfactory-staging', org: 'default', username: 'Bobman', password: 'Password123', customBaseUrl: 'https://default.staging2.lookbookhq.com'}); 
const automation = createAuthoringInstance(); 

describe('Various proof of concept tests', function() {
    it('should do stuff in automation org', function(){
        automation.common.login(); 
    })

    it('should successfully do stuff in a different org than automation-org', function(){
        defaultOrg.common.login();
        defaultOrg.vex.addVirtualEvent('Test 2');
        defaultOrg.vex.configureEvent(
            {
                event: 'Hello world', 
                manageSessions: function(){defaultOrg.vex.addSession("hiya", 'Live')}
            }
        );
    })
})