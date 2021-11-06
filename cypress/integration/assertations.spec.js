import login from "../fixtures/login.json";
import navigation from "../fixtures/navigation.json";
import newBoard from "../fixtures/newBoard.json";

describe("Assertations", () => {
  beforeEach(() => {
    cy.intercept("/login").as("login");
    cy.visit("/");
    cy.request("DELETE", "api/boards");
    cy.get(navigation.loginButton).click();
    cy.get(login.emailInput).type(Cypress.env("username"));
    cy.get(login.password).type(Cypress.env("password"));
    cy.get(login.loginButton).click();
    cy.wait("@login");
    cy.get(login.loginMessage).should("contain", "User is logged in");
    cy.get(navigation.loggedUser).should("contain", Cypress.env("username"));

    // cy.get('elementKojiIspitujemo').should(($elem) => {
    //     expect($elem).to.contain('text')
    //})
  });

  afterEach(() => {
    cy.get(navigation.loggedUser).click();
    cy.get(login.logoutButton).click();
  });

  it("Create board, make it favorite", () => {
    cy.get(newBoard.newBoard).click();
    cy.get(newBoard.newBoardInput).type("My board{enter}");
    cy.url().then((url) => {
      const id = url.match(/\/(\d+?)$/);

      cy.url().should("eq", `${Cypress.config("baseUrl")}/board/${id[1]}`);
    });

    cy.go("back");
    cy.get(newBoard.createdBoard).trigger("mouseover");
    cy.get(newBoard.star).should("be.visible").click();

    cy.get(newBoard.favoriteBoards).children().should("have.length", 1);
  });

  it("Add lists", () => {
    cy.get(newBoard.newBoard).click();
    cy.get(newBoard.newBoardInput).type("Board sa listama{enter}");
    cy.visit("/");
    cy.get('[data-cy="Board sa listama"]').click();
  });

  it("Do assertions over a task item + CRUD actions/assertions", () => {
    // register the tasks update route, it might come in handy while working
    cy.intercept("PATCH", "/api/tasks/*").as("updateTasks");

    cy.get("[data-cy=create-board]").click();
    cy.get("[data-cy=new-board-input]").type("My board{enter}");

    // adding a new list
    cy.get("[data-cy=add-list]").click();

    cy.get("[data-cy=add-list-input]").type("New list{enter}");

    cy.get("[data-cy=new-task]").click();

    cy.get("[data-cy=task-input]").type(`Task 1{enter}`);

    cy.get("[data-cy=task]").click();

    // since this is an input field, we need to assert its value
    cy.get("[data-cy=task-module-name]").should("have.value", "Task 1");

    cy.get(".TaskModule_list").should("have.text", "in list New list");

    // change task name, asser it, change back, assert it (do it in the list too, once you close the modal)
    cy.get("[data-cy=task-module-name]")
      .click()
      .clear()
      .type("Something completely different{enter}");

    cy.wait("@updateTasks");

    cy.get("[data-cy=task-module-name]").should(
      "have.value",
      "Something completely different"
    );

    // close the modal, assert the changed task name in the list
    cy.get("[data-cy=task-module-close] > .options").click({ force: true });

    cy.get("[data-cy=task-dropdown] > :nth-child(1)").click({ force: true });

    cy.get("[data-cy=task-title]").should(
      "contain",
      "Something completely different"
    );

    // complete the task and asser that it has been done
    cy.get("[data-cy=task-done]").click();
    cy.get(".Task_title").should(
      "have.css",
      "text-decoration",
      "line-through solid rgb(77, 77, 77)"
    );

    // re-enable the task, asser that it is re-enabled
    cy.get("[data-cy=task-done]").click();
    cy.get(".Task_title").should(
      "not.have.css",
      "text-decoration",
      "line-through solid rgb(77, 77, 77)"
    );

    // add new task, this time we click the "Add" button
    cy.get("[data-cy=new-task]").click();
    cy.get("[data-cy=task-input]").type("A new task");
    cy.get("[data-cy=add-task]").click();

    // select the newly created task
    cy.get("[data-cy=tasks-list]").children().eq(1).click();

    // edit the task title again
    cy.get("[data-cy=task-module-name]")
      .click()
      .clear()
      .type("Change the title again{enter}");

    cy.get("[data-cy=task-module-name]").should(
      "have.value",
      "Change the title again"
    );

    // add the task description
    cy.get("[data-cy=task-description]").click();

    cy.get("[data-cy=task-description-input]").type("Aww yiss, a description");

    cy.get("[data-cy=task-description-save]").click();

    cy.get(".TaskModule_description").should(
      "contain",
      "Aww yiss, a description"
    );

    // change task deadline to a past date
    cy.get("[data-cy=task-deadline]").focus().type("2021-01-01").blur();

    cy.get("[data-cy=task-deadline]")
      .should("have.class", "overDue")
      .and("have.css", "background-color", "rgb(231, 116, 141)");

    // close the modal and assert that it's not visible
    cy.get("[data-cy=task-module-close]").click();

    cy.get("[data-cy=task-dropdown] > :nth-child(1)").click();

    cy.get("[data-cy=task-module]").should("not.be.visible");

    // find overdue task(s) in the list using the `find()` method, assert them, and log their number using `cy.log()`
    cy.get("[data-cy=tasks-list]")
      .find(".overDue")
      .should("have.class", "overDue")
      .and("have.css", "background-color", "rgb(231, 116, 141)")
      .then((el) => {
        cy.log(
          `There is a total of ${el.length} overdue tasks in the backlog.`
        );
      });
  });
});
