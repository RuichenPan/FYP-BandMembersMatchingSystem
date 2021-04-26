let searchString = 'james'; 
let users;
  describe("Home Page ", () => {
    before(() => {
        cy.request(
          `http://localhost:5300/api/open/home`
        )
          .its("body")   
          .then((response) => {
            users = response.results
          })
      })
    beforeEach(() => {
      cy.visit("/login")
      cy.get("input").eq(0).type("CheN");
      cy.get("input").eq(1).type("123321");
      cy.get("button").eq(3).click();
      cy.wait(1000);
      cy.visit("/")
    });
  
    describe("Filtering", () => {
      describe("Search By user name" ,() => {
        it("should display users with 'James Hetfield' in the username", () => {
          cy.get("input").clear().type(searchString) ;
          cy.get("button").eq(3).click();
          cy.get("div").find("div.col0.handle").eq(0).should("have.text","James Hetfield");
        })
        it("should display no users with 'jskd' in the username", () => {
            cy.get("input").clear().type("jskd") ;
            cy.get("button").eq(3).click();
            cy.get("div").find("div.col0.handle").should("not.exist");
          })
      });
      describe("Search By Type" ,() => {
        it("should display users with 'Guitarist' in the type", () => {
          cy.get("select").eq(0).select("Guitarist");
          cy.get("div").find("div.col0.handle").eq(0).should("exist");
        })
        });
      describe("Search By Music Style" ,() => {
        it("should display users with 'Thrash Metal' in the type", () => {
            cy.get("select").eq(1).select("Thrash Metal");
            cy.get("div").find("div.col0.handle").eq(0).should("exist");
        })
        })
    })
    describe("Swith Page", () => {
        describe("switch page by clicking user card" ,() => {
          it("should display users information", () => {
            cy.get("div").get("div.img.img-cover").eq(0).click();
            cy.url().should("include", `/person`)
          })
          it("should display users information by clicking user name", () => {
            cy.get("div").get("div.col0.handle").eq(0).click();
            cy.url().should("include", `/person`)
          })
        });
        describe("switch page by clicking buttons" ,() => {
          it("should display album page", () => {
            cy.get("button").get("div.col1.margin-5.btn.btn-dark").eq(0).click();
            cy.url().should("include", `/album`)
          })
          });
        describe("switch page by clicking buttons" ,() => {
          it("should display video page", () => {
            cy.get("button").get("div.col1.margin-5.btn.btn-dark").eq(1).click();
            cy.url().should("include", `/video`)
          })
          });
      })
  });