import { createAuthoringInstance } from '../support/pageObject.js';
import { constants } from '../support/constants.js';

const authoring = createAuthoringInstance(); 

describe('Switch domain to lookbookhq because Cypress will show blank page/fail to show promoters on consumption side on pathfactory domain', function() {
    it('Stupid cypress...', function(){
        authoring.common.login();
        authoring.clientHQ.switchDomain(constants.lookbookhqDomain)
    })
})