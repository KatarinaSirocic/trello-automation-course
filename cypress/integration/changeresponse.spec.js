describe("Network stubbing", () => {
    it("I can change the network response", () => {
        cy.intercept('/api/boards', { fixture: 'board.json'}).as('fakeBoard');
        cy.visit('/')
        cy.get(':nth-child(4) > :nth-child(1) > .board_title').should('contain','Test board Kaca')

        cy.get('@fakeBoard').its('response').then((res) => {
            console.log(res);
            expect(res.body[0].name).to.eq('Test board Kaca')
            expect(res.body[0].starred).to.eq(true)
            expect(res.statusCode).to.eq(200);
        })
    })

    // it('Dynamically change parts of the response data', () => {

    //     cy.intercept({
    //       method: 'GET',
    //       url: 'http://localhost:3000/api/boards'
    //     }, (req) => {
    //       req.reply((res) => {
    //         res.body[0].name = 'Kaca  dsfs'
    //         res.body[0].starred = false
    //         //res.body[1].name = 'Something else'
      
    //         return res
    //       })
    //     })
      
    //     cy.visit('/')
    //   })

})