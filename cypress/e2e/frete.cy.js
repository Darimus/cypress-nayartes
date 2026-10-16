describe('Simulador de frete', () => {

  it('deve calcular o frete com um CEP válido', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    // Informa o CEP
    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');

    // Calcula o frete
    cy.get('button.wc-shipping-simulator-button-current-style')
      .click();

  });

  it('deve impedir o cálculo com o CEP vazio', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.wait(2000);

    cy.contains('.wc-block-components-totals-item__label','Total estimado')
      .parent()
      .find('bdi')
      .should('contain.text', 'R$ 16,99');
  });

  it('deve validar um CEP incompleto', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124')

    cy.on('window:alert', (texto) => {
      expect(texto).to.equal('Por favor, insira um CEP válido no formato XXXXX-XXX.');
    });
      
    cy.get('button.wc-shipping-simulator-button-current-style')
      .click();
 
  });

  it('deve aplicar corretamente a máscara do CEP', () => {

    cy.visit('/loja');
    
    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');
  });

  it('deve permitir alterar o CEP e calcular novamente', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07184000')
      .should('have.value', '07184-000');
  });

  it('deve mudar o valor do frete após mudar a quantidade de produtos', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');

    // Verifica a quantidade inicial
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    // Captura o valor inicial do frete
    cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
      .invoke('text')
      .then((freteInicial) => {

        // Aumenta a quantidade para 2
        cy.get('button[aria-label^="Aumente a quantidade"]')
          .click();

        // Verifica se a quantidade foi atualizada
        cy.get('input.wc-block-components-quantity-selector__input')
          .should('have.value', '2');

        // Aguarda o frete atualizar e compara os valores
        cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
          .should(($frete) => {
            const freteAtual = $frete.text().trim();

            expect(freteAtual).not.to.equal(freteInicial.trim());
          });
      });
  });

  it('deve atualizar o frete ao remover o produto', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');

    // Verifica a quantidade inicial
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    // Captura o valor inicial do frete
    cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
      .invoke('text')
      .then((freteInicial) => {

        // Aumenta a quantidade para 2
        cy.get('button[aria-label^="Aumente a quantidade"]')
          .click();

        // Verifica se a quantidade foi atualizada
        cy.get('input.wc-block-components-quantity-selector__input')
          .should('have.value', '2');

        // Aguarda o frete atualizar e compara os valores
        cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
          .should(($frete) => {
            const freteAtual = $frete.text().trim();

            expect(freteAtual).not.to.equal(freteInicial.trim());
          });
      });
  });

  it('deve atualizar o frete ao aumentar e diminuir a quantidade', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-shipping-simulator-input-current-style')
      .clear()
      .type('07124000')
      .should('have.value', '07124-000');

    // Captura o frete inicial com 1 produto
    cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
      .invoke('text')
      .then((freteInicial) => {

        // Aumenta a quantidade para 2
        cy.get('button[aria-label^="Aumente a quantidade"]')
          .click();

        cy.get('input.wc-block-components-quantity-selector__input')
          .should('have.value', '2');

        // Verifica se o frete mudou após aumentar
        cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
          .should(($frete) => {
            expect($frete.text().trim()).not.to.equal(freteInicial.trim());
          })
          .invoke('text')
          .then((freteAumentado) => {

            // Diminui a quantidade para 1
            cy.get('button[aria-label^="Diminua a quantidade"]')
              .click();

            cy.get('input.wc-block-components-quantity-selector__input')
              .should('have.value', '1');

            // Verifica se o frete mudou após diminuir
            cy.get('.wc-block-components-totals-shipping .wc-block-components-totals-item__value')
              .should(($frete) => {
                expect($frete.text().trim()).not.to.equal(freteAumentado.trim());
              });
          });
      });
  });
});