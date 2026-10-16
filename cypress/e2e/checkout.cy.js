const CART_ITEM_REMOVE = 'button.wc-block-cart-item__remove-link';
const EMPTY_CART_TITLE = 'h2.wc-block-cart__empty-cart__title';
const PRODUCT_NAME = 'Cortador de Biscoito Biscuit Pasta Americana Religioso';
const PRODUCT_ADD_BUTTON =
  'a.add_to_cart_button[aria-label^="Adicione ao carrinho: “Cortador de Biscoito Biscuit Pasta Americana Religioso"]';

function clearCart() {
  cy.get('body')
    .should(($body) => {
      expect(
        $body.find(CART_ITEM_REMOVE).length > 0 ||
        $body.find(EMPTY_CART_TITLE).length > 0
      ).to.be.true;
    })
    .then(($body) => {
      const itemsBefore = $body.find(CART_ITEM_REMOVE).length;

      if (itemsBefore === 0) {
        return;
      }

      cy.wrap($body.find(CART_ITEM_REMOVE).first()).click();

      cy.get('body')
        .should(($updatedBody) => {
          expect($updatedBody.find(CART_ITEM_REMOVE).length).to.be.lessThan(itemsBefore);
        })
        .then(() => clearCart());
    });
}

function fillBillingFields() {
  const fields = {
    '#billing_phone': '11987654321',
    '#billing_first_name': 'Joao',
    '#billing_last_name': 'Silva',
    '#billing_document': '12345678909',
    '#billing_postcode': '07124000',
    '#billing_address_1': 'Avenida Benjamin Harris Hunnicutt',
    '#billing_number': '100',
    '#billing_neighborhood': 'Centro',
    '#billing_city': 'Guarulhos',
    '#billing_email': 'joao.silva@example.com',
  };

  Object.entries(fields).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value);
  });

  cy.get('#billing_state').select('SP', { force: true });
}

describe('Checkout', () => {
  beforeEach(() => {
    cy.visit('/carrinho');
    clearCart();

    cy.visit('/loja');
    cy.get(PRODUCT_ADD_BUTTON)
      .should('be.visible')
      .click()
      .should('have.class', 'added');

    cy.visit('/carrinho');
    cy.get('.wc-block-cart-items__row')
      .should('have.length', 1)
      .should('be.visible');
    cy.get('.wc-block-cart-items__row')
      .should('contain.text', PRODUCT_NAME);
    cy.get('input.wc-block-components-quantity-selector__input')
      .should('have.value', '1');

    cy.visit('/finalizar-compra/');
    cy.location('pathname').should('eq', '/finalizar-compra/');

    cy.get('#billing_first_name').should('be.visible');
  });

  it('CT-001: deve acessar a página de finalização da compra', () => {
    cy.contains('h3', 'Detalhes de Cobrança').should('be.visible');
    cy.get('#place_order').should('be.visible').and('be.enabled');
  });

  it('CT-002: deve exibir os campos obrigatórios de cobrança', () => {
    [
      'billing_phone',
      'billing_first_name',
      'billing_last_name',
      'billing_document',
      'billing_postcode',
      'billing_address_1',
      'billing_number',
      'billing_neighborhood',
      'billing_city',
      'billing_state',
      'billing_email',
    ].forEach((field) => {
      cy.get(`#${field}_field label span.required`).should('exist');
    });
  });

  it('CT-003: deve permitir preencher nome e sobrenome', () => {
    cy.get('#billing_first_name').clear().type('Joao').should('have.value', 'Joao');
    cy.get('#billing_last_name').clear().type('Silva').should('have.value', 'Silva');
  });

  it('CT-004: deve permitir preencher o CEP', () => {
    cy.get('#billing_postcode')
      .clear()
      .type('07124000')
      .should(($input) => {
        expect($input.val().replace(/\D/g, '')).to.equal('07124000');
      });
  });

  it('CT-005: deve permitir preencher o endereço', () => {
    cy.get('#billing_address_1')
      .clear()
      .type('Avenida Benjamin Harris Hunnicutt')
      .should('have.value', 'Avenida Benjamin Harris Hunnicutt');
  });

  it('CT-006: deve permitir preencher o número do endereço', () => {
    cy.get('#billing_number').clear().type('100').should('have.value', '100');
  });

  it('CT-007: deve permitir preencher o bairro', () => {
    cy.get('#billing_neighborhood').clear().type('Centro').should('have.value', 'Centro');
  });

  it('CT-008: deve permitir preencher cidade e estado', () => {
    cy.get('#billing_city').clear().type('Guarulhos').should('have.value', 'Guarulhos');
    cy.get('#billing_state').select('SP', { force: true }).should('have.value', 'SP');
  });

  it('CT-009: deve permitir marcar S/N no campo de número', () => {
    cy.get('#lkn_billing_checkbox').check().should('be.checked');
  });

  it('CT-010: deve exibir o botão para finalizar o pedido', () => {
    cy.get('#place_order').should('be.visible').and('be.enabled');
  });

  it('CT-011: não deve finalizar o pedido sem preencher os campos obrigatórios', () => {
    cy.get('#billing_first_name').should('have.value', '');

    cy.get('#place_order').click();

    cy.location('pathname').should('include', 'finalizar-compra');
    cy.get('#billing_first_name').should('have.value', '');
  });

  it('CT-012: deve apresentar o produto e os valores no resumo do pedido', () => {
    cy.get('.woocommerce-checkout-review-order-table .cart_item')
      .should('contain.text', 'Cortador de Biscoito');

    cy.get('.woocommerce-checkout-review-order-table .product-quantity')
      .invoke('text')
      .should((quantity) => {
        expect(quantity.replace(/\s/g, '')).to.match(/×1/);
      });

    cy.get('.woocommerce-checkout-review-order-table tfoot .cart-subtotal')
      .should('contain.text', 'R$')
      .and('contain.text', '16,99');
  });

  it('CT-013: deve permitir selecionar a forma de pagamento com cartão', () => {
    cy.get('#payment_method_woo-mercado-pago-pix').check({ force: true });
    cy.get('#payment_method_woo-mercado-pago-pix').should('be.checked');

    cy.get('#payment_method_woo-mercado-pago-custom').check({ force: true });
    cy.get('#payment_method_woo-mercado-pago-custom').should('be.checked');
  });

  it('CT-014: deve apresentar os campos de cartão e documento do titular', () => {
    cy.get('iframe[name="cardNumber"]').should('exist');
    cy.get('iframe[name="expirationDate"]').should('exist');
    cy.get('iframe[name="securityCode"]').should('exist');
    cy.get('#form-checkout__cardholderName').should('be.visible');
    cy.get('[data-cy="input-document"]').should('exist');
  });

  it('CT-015: deve apresentar as propriedades do campo de documento do titular', () => {
    cy.get('[data-cy="input-document"]')
      .should('exist')
      .and('have.attr', 'aria-required', 'true')
      .and('have.attr', 'maxlength', '14')
      .and('have.attr', 'placeholder', '999.999.999-99');
  });

  it('CT-016: deve apresentar o seletor de parcelas sem preencher o cartão', () => {
    cy.get('#form-checkout__installments').should('exist');
  });

  it('CT-017: deve permanecer no checkout ao tentar finalizar sem os dados do cartão', () => {
    fillBillingFields();

    cy.get('#payment_method_woo-mercado-pago-custom').should('be.checked');
    cy.get('#place_order').click();

    cy.location('pathname').should('include', 'finalizar-compra');
    cy.get('#place_order').should('be.visible');
  });
});
