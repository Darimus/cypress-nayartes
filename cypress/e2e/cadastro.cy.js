describe('Cadastro', () => {

  it('deve acessar a página de login e realizar o login', () => {
    cy.visit('/minha-conta/');

    cy.get('#username')
      .clear()
      .type('bruno.passos@outlook.com.br')
      .should('have.value', 'bruno.passos@outlook.com.br');

    cy.get('#password')
      .clear()
      .type('SenhaTeste123'); // Não é a senha original, apenas para fins de teste

    cy.get('button[name="login"]')
      .click();
  });

  // Usar o only faz com que apenas esse teste seja executado, ignorando os outros testes no mesmo arquivo.
  it('deve acessar a página de cadastro e realizar o cadastro', () => {
    cy.visit('/minha-conta/');

    cy.get('#reg_email')
      .clear()
      .type('bruno.passos@outlook.com.br')
      .should('have.value', 'bruno.passos@outlook.com.br');

    cy.get('button[name="register"]')
      .click();
  });

  it.only('deve acessar a página de login e colocar email não formatado', () => {
    cy.visit('/minha-conta/');

    cy.get('#username')
      .clear()
      .type('bruno.passosoutlook.com.br') // Email sem o @
      .should('have.value', 'bruno.passosoutlook.com.br')

  })

});