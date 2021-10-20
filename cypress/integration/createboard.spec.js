describe("Network stubbing", () => {
    // it("create board", () => {
    //     cy.intercept('/api/boards', 'POST', { fixture: 'newboard.json'}).as('createBoard');
    //     cy.visit('/')
    // })

    // it('create board', () => {

    //     cy.intercept({
    //       method: 'POST',
    //       url: '/api/boards'
    //     }, (req) => {
    //       req.reply((res) => {
    //         res.body.name = 'neki board'
    //         res.body[0].user = 0,
    //         res.body[0].id = 8602465781,
    //         res.body[0].starred = true,
    //         res.body[0].created = '2021-10-16'
    //       })
    //       return res;
    //     })
      
    //     cy.visit('/')
    //   })

    it("create board", () => {
        cy.request('POST', 'http://localhost:3000/api/boards',{
            
            name: "heyheyhey"
            
        })
        cy.visit('/')
})

// it('Dinamically change parts of the response data', () => {
//     cy.intercept('/api/boards', [
//       {
//         name: 'Board',
//       },
//     ]);
//     cy.visit('/');
//   });

//   it('Delete board', () => {
//     cy.request('DELETE', '/api/boards/5940827060', {
//         statusCode: 200
//       })
// });
})