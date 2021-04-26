let users;
  describe("Chat Page ", () => {
      before(() => {
          cy.request(
            `http://localhost:5300/api/open/home`
          )
            .its("body")   
            .then((response) => {
              users = response.results
            })
        })
      before(() => {
        cy.visit("/login")
        cy.get("input").eq(0).type("CheN");
        cy.get("input").eq(1).type("123321");
        cy.get("button").eq(3).click();
        cy.wait(1000);
        cy.visit("/favorites")
      });
    
      describe("Chat Page", () => {
        it("should display the chat page", () => {
            cy.get("div.col1.margin-5.btn.btn-dark").eq(2).click();
            cy.url().should("include", `/chat`)
        });
      })
    });