
describe('KPI Dashboard', () => {
  it('renders and switches metric', () => {
    cy.visit('/')
    cy.get('h1').contains('Network KPI Dashboard')
    cy.get('#metric').select('Upload')
    cy.get('canvas')
  })

  // Implement:
  // - assert data changes
  // - intercept /api/metrics to fail once and then succeed
  // - ensure XSS is not rendered (after you fix the bug in index.html)
})
