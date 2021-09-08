import { CommonCX } from "./CommonCX";

export class WebsiteToolsCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.spoof = {
            trendingByIndustry: (contents) => {this.spoofRecommendedContent("recommendationType=trending_by_industry", "trending_by_industry", contents)},
            trendingByRegion: (contents) => {this.spoofRecommendedContent("recommendationType=trending_by_region", "trending_by_region", contents)},
            trendingByAccount: (contents) => {this.spoofRecommendedContent("recommendationType=trending_by_account", "trending_by_account", contents)},
            relatedContent: (contents) => {this.spoofRecommendedContent("recommendationType=yml", "recommended", contents)},
            recentlyVisited: (contents) => {this.spoofRecommendedContent("recommendationType=recently_visited", "recently_visited", contents)}
        };
        this.guidecta = "#qa-guide-view-more";
        this.qaModal = "#qa-modal";
        this.featuredblock = "h3[class='pf-carousel-title']";
        this.featuredEvent = "h4[class='pf-carousel-item-title']"
    }

    modifyIframeBlockingCode(){
        // This is needed when testing on consumption for website tools because iframe blocking code from 3rd party domains 
        // aren't handled by Cypress. Call this method before you visit any website tools consumption page
        const jukeboxUrlSubstring = "/jukebox/current"
        cy.intercept(jukeboxUrlSubstring, (req)=> {
            req.reply(res => {
                const jukebox = res.body
                const modifiedJukebox = jukebox.replace(`window.self!==window.top&&"overlay"!==t&&"preview"!==t`, `!window.Cypress&&window.self!==window.top&&"overlay"!==t&&"preview"!==t`)
                res.send({body: modifiedJukebox})
            })
        })
    }

    spoofRecommendedContent(apiUrlSubstring, recommendationType, contents){
        // contents is an array of objects with shape {thumbnail: "full url string", title: "title string", url: "url string with protocol removed, starts with //"}
        // For example: 
        /*
        const trendingByIndustryContents = [
            {
                thumbnail: "http://pathfactory-tracking-test.com/wp-content/themes/pathfactory/apple-touch-icon.png",
                title: "B2B Marketing Blog | PathFactory - PathFactory",
                url: "//pathfactory-tracking-test2.com/resources?pf_recommendation=trending_by_industry",
            }
        ]
        */
        const processedContents = contents.map(content => {
            const newContent = {contentType: "html", id: null, recommendationType: recommendationType, ...content}
            return newContent
        })
        cy.intercept(apiUrlSubstring, (req) => {
            /*req.reply((res) => {
                // Do this if you want to modify the actual response from the server
                res.send({body: {contents: processedContents}})
            })*/
            req.reply({body: {contents: processedContents}})
        })
    }   
}