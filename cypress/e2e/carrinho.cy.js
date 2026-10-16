describe('Carrinho', () => {

  it('deve adicionar um produto e atualizar sua quantidade', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    // Verifica quantidade inicial
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    // Aumenta a quantidade para 2
    cy.get('button[aria-label^="Aumente a quantidade"]')
      .click();

    // Verifica quantidade
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '2');

    // Verifica o total atualizado
    cy.contains('span.wc-block-components-totals-item__label', 'Total estimado')
      .parent()
      .find('.wc-block-formatted-money-amount')
      .should('contain.text', 'R$ 33,98');

    

  });

  it('deve mudar o valor do frete após mudar a quantidade de produtos', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    // Verifica a quantidade inicial
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    // Aumenta a quantidade para 2
    cy.get('button[aria-label^="Aumente a quantidade"]')
      .click();

        // Verifica se a quantidade foi atualizada
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '2');
  });


  it('CT-003: não deve permitir quantidade menor que 1', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    cy.get('button.wc-block-components-quantity-selector__button--minus')
      .should('be.disabled');

    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');
  });

  it('CT-004: deve permitir alterar a quantidade diretamente pelo campo', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-block-components-quantity-selector__input')
      .focus()
      .type('{selectall}')
      .type('3')
      .should('have.value', '3');
  });

  it('CT-005: deve atualizar o total ao alterar a quantidade', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.contains('span.wc-block-components-totals-item__label', 'Total estimado')
      .parent()
      .find('.wc-block-formatted-money-amount')
      .should('contain.text', 'R$ 16,99');

    cy.get('input.wc-block-components-quantity-selector__input')
      .focus()
      .type('{selectall}')
      .type('2')
      .should('have.value', '2');

    cy.contains('span.wc-block-components-totals-item__label', 'Total estimado')
      .parent()
      .find('.wc-block-formatted-money-amount')
      .should('contain.text', 'R$ 33,98');
  });

  it('CT-006: deve remover um produto do carrinho', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-block-components-quantity-selector__input')
      .should('exist');

    cy.get('button.wc-block-cart-item__remove-link').click();

    cy.get('input.wc-block-components-quantity-selector__input')
      .should('not.exist');
  });

  it('CT-007: deve manter o carrinho atualizado após remover um produto', () => {

    cy.visit('/loja');

    cy.contains('Adicionar ao carrinho').click();

    cy.visit('/carrinho');

    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    cy.get('button.wc-block-cart-item__remove-link').click();

    cy.get('h2.wc-block-cart__empty-cart__title')
      .should('contain.text', 'Seu carrinho está vazio no momento!');
  });

});