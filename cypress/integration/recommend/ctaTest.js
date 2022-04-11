import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const recommend = {
    name: 'ctaTest.js',
    slug: 'ctatest-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },

}

const ctas =[
        {
            ctaNumber: "CTA 1",
            ctaName: "formCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        }, 
        {
            ctaNumber: "CTA 2",
            ctaName: "linkCTA",
            location: "After assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        },
        {
            ctaNumber: "CTA 3",
            ctaName: "dynamicFieldMergeRecommend.js",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        }
    ]

describe("Explore CTA buttons", () => {
it.only("Add and delete CTA buttons", () => {
    authoring.common.login()
    authoring.recommend.visit()
    //authoring.recommend.goToTrack(recommend.name)
    authoring.recommend.deleteTrack(recommend.name)
    authoring.recommend.addTrack(recommend)

    // turn CTA toggle ON
    authoring.common.toggle(authoring.recommend.pageSidebar.sidebarToggle, 'ON')    
    ctas.forEach((cta)=>{

    authoring.recommend.configureSidebarwithCtas(cta)

    
    })

})
})