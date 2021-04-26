let users;
  describe("Comment Page ", () => {
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
        cy.get("input").eq(0).type("Qiang");
        cy.get("input").eq(1).type("123321");
        cy.get("button").eq(3).click();
        cy.wait(1000);
      });
    
      describe("Comment Page", () => {
        it("should display the comment page", () => {
            cy.get("div.btn.btn-dark").eq(0).click();
            cy.url().should("include", `/person`)
        });
      })
    });