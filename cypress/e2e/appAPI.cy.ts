describe("API tests", () => {

    beforeEach(() => {
        cy.intercept("*", (req) => {
            delete req.headers["if-none-match"];
            delete req.headers["if-modified-since"];
            req.headers["cache-control"] = "no-cache";
        });
    });

    it("TC_API_1_Returns 200 for valid metric", () => {
        cy.request("/api/metrics?metric=download")
            .its("status").should("eq", 200);
    });

    it("TC_API_2_Returns error for invalid metric", () => {
        cy.request({ url: "/api/metrics?metric=invalid", failOnStatusCode: false })
            .its("status").should("eq", 400);
    });

    it("TC_API_3_Returns data for valid metric", () => {
        cy.request("POST", "/graphql", { query: "{ kpi(metric:\"download\"){t v} }" })
            .its("body.data.kpi").should("exist");
    });

    it("TC_API_4_Returns error for invalid metric", () => {
        cy.request("POST", "/graphql", { query: "{ kpi(metric:\"invalid\"){t v} }" })
            .its("body.errors").should("exist");
    });

    it("TC_API_5_Returns 200 for valid metric - UPLOAD", () => {
        cy.request("/api/metrics?metric=download")
            .its("status").should("eq", 200);
    });

});
