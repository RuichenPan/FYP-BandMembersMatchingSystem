let users;
  describe("Profile Page ", () => {
    before(() => {
        cy.request(
          `http://localhost:5300/api/open/home`
        )
          .its("body")   
          .then((response) => {
            users = response.results
          })
      })
  
    describe("Show Profile Page", () => {
        it("should display profile page", () => {
            cy.visit("/login")
            cy.get("input").eq(0).type("Qiang");
            cy.get("input").eq(1).type("123321");
            cy.get("button").eq(3).click();
            cy.wait(1000);
            cy.url().should("include", `/profile`)
      });
    })
  });