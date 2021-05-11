import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance(); 

describe('Make sure that all toggles required for governance are ON', function() {
    it('Make sure that all toggles required for governance are ON', function() {
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod
            authoring.common.login();
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.formsStrategyToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetExploreToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendExploreToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.topicSidebarToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentTrackLabelsToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.segmentsToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.routesToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.queryStringPassThroughToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.publicAPIToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.crmIntegrationToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.accountAnalyticsToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.sixSenseToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteJourneyTrackingToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, 'on'); 
        }
    })
})