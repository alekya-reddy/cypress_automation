


describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{
    it("should always pass", ()=>{
        cy.request({
            url: "https://api.pipedream.com/v1/sources/dc_L3u1qN/events",
            headers: {"Authorization": "Bearer 391dbfbac8627689b173cabc4506b667"},
            log: false
        }).then((response)=>{
            const events = response.body.data.map((data)=>{
                return data.e.body
            })

            const checkedEvents = [];
            let match = false;

            events.forEach(event => {
                match = checkedEvents.find(ce => {

                    return JSON.stringify(ce) === JSON.stringify(event);
                });
                if (!match) {
                    checkedEvents.push(event)
                }
                expect(match).not.to.exist;
            });
        });
    })
})