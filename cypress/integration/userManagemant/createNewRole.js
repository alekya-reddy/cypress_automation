import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

//const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const authoring = createAuthoringInstance()

cy.request({
    url: '/dashboard',
    followRedirect: false, // turn off following redirects
  }).then((resp) => {
    // redirect status code is 302
    expect(resp.status).to.eq(302)
    expect(resp.redirectedToUrl).to.eq('http://localhost:8082/unauthorized')
  })

  