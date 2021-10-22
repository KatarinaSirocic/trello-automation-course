describe("Create boards + assert data", () => {
    it("Create 4 boards", () => {
        cy.intercept('GET', '/api/boards', {fixture: 'boards.json'} ).as('create4boards');
        cy.visit('/')
        //assertations - get elements trough UI
        cy.get("div:nth-of-type(1) > .board_item > .board_title").should('contain','IN PROGRESS')
        cy.get("div:nth-of-type(2) > div:nth-of-type(1) > .board_title").should('contain','TO DO')
        cy.get("div:nth-of-type(3) > .board_title").should('contain','QA')
        cy.get("div:nth-of-type(4) > .board_title").should('contain','DONE')

        //asseratations - get elements trough response
        cy.get('@create4boards').then((res) => {
        expect(res.response.body[0].name).to.eq('TO DO')
        expect(res.response.body[0].starred).to.eq(false)
        expect(res.response.body[1].name).to.eq('IN PROGRESS')
        expect(res.response.body[1].starred).to.eq(true)
        expect(res.response.body[2].name).to.eq('QA')
        expect(res.response.body[2].starred).to.eq(false)
        expect(res.response.body[3].name).to.eq('DONE')
        expect(res.response.body[3].starred).to.eq(false)
        })
    })

    it("Assert QA Board", () => {
        cy.intercept('GET', '/api/boards/40950404759', {fixture: 'qaBoard.json'}).as('qaBoard');
        cy.visit('/')
        cy.get("div:nth-of-type(3) > .board_title").contains('QA').click()
        cy.get('@qaBoard').then((res) => {
            expect(res.response.body.name).to.eq('QA')
            expect(res.response.body.lists[0].title).to.eq('Homework list')
            expect(res.response.body.tasks[0].title).to.eq('Stubbing network responses')
            expect(res.response.body.tasks[1].title).to.eq('Changing parts of response data')
            expect(res.response.body.tasks[2].title).to.eq('Intercepting')
            })       
    })
})
