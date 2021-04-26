let users;
  describe("I Want You Page ", () => {
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
      cy.visit("/")
      cy.wait(1000);
    });
  
    describe("Add and Delete", () => {
        it("should display empty page on i want you page", () => {
          cy.get("button").eq(1).click();
          cy.get("div").find("div.col0.handle").should("not.exist");
        })
        it("should display users added into i want you page", () => {
            cy.visit("/")
            cy.wait(1000);
            cy.get("div").get("div.handle.margin-left-5.icon.icon-collection").eq(0).click();
            cy.get("button").eq(1).click();
            cy.get("div").find("div.col0.handle").should("exist");
        })
        it("should display empty page on i want you page after deleting one", () => {
            cy.get("div").get("div.handle.margin-left-5.icon.icon-collection-select").eq(0).click();
            cy.url().should("include", `/favorites`)
            cy.get("div").find("div.col0.handle").should("not.exist");
      });
    })
  });