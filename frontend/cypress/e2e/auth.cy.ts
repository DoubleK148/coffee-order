describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user', () => {
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/register');

    cy.get('[data-testid="fullName"]').type('Test User');
    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="register-button"]').click();

    cy.url().should('include', '/login');
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should login with correct credentials', () => {
    cy.get('[data-testid="login-link"]').click();
    cy.url().should('include', '/login');

    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/menu');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error with incorrect credentials', () => {
    cy.get('[data-testid="login-link"]').click();
    cy.url().should('include', '/login');

    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="password"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
}); 