# Nay Artes — Testes E2E

Suíte de testes automatizados end-to-end (E2E) para validar os principais fluxos da loja virtual Nay Artes. Os testes usam [Cypress](https://www.cypress.io/) para interagir com a loja como uma pessoa usuária faria.

## O que é testado

- **Carrinho:** inclusão de produtos, alteração de quantidade, totais e remoção de itens.
- **Frete:** máscara e validação de CEP, recálculo do frete e alterações relacionadas à quantidade dos produtos.
- **Checkout:** campos obrigatórios de cobrança, resumo do pedido e interface de pagamento.
- **Cadastro e login:** fluxos disponíveis na página Minha Conta.

Os campos seguros de cartão do Mercado Pago são apresentados em iframes. Os testes atuais verificam a interface relacionada, mas não preenchem os dados seguros do cartão.

## Tecnologias

- Node.js e npm
- Cypress

## Pré-requisitos

- Node.js e npm instalados.
- Acesso à loja configurada em `cypress.config.js`.

## Instalação

Na raiz do projeto, instale as dependências:

```bash
npm ci
```

## Executar os testes

Abrir a interface do Cypress:

```bash
npx cypress open
```

Executar todos os testes em modo headless:

```bash
npx cypress run
```

Executar apenas um arquivo:

```bash
npx cypress run --spec "cypress/e2e/carrinho.cy.js"
```

Arquivos de teste disponíveis em `cypress/e2e/`:

```text
cadastro.cy.js
carrinho.cy.js
checkout.cy.js
frete.cy.js
```

## Configuração

A URL base dos testes está definida em `cypress.config.js`. No momento, aponta para:

```text
https://nayartes.com.br
```

Antes de executar os testes em outro ambiente, atualize a configuração para a URL desejada.

## Atenção ao ambiente de execução

Os testes podem interagir com o site configurado, alterar o carrinho, tentar enviar o checkout e realizar ações de cadastro ou login. **Não execute a suíte contra produção sem autorização e sem avaliar os efeitos dos testes.** Sempre que possível, use um ambiente de homologação com dados próprios para testes.

O arquivo `cadastro.cy.js` contém atualmente um teste com `it.only`, que limita a execução aos testes focados desse arquivo. Remova o `.only` quando quiser executar todos os casos de cadastro/login.

## Estrutura do projeto

```text
.
├── cypress/
│   ├── e2e/              # Casos de teste E2E
│   ├── fixtures/         # Dados de apoio
│   └── support/          # Configuração e comandos compartilhados
├── cypress.config.js     # Configuração do Cypress e URL base
├── package.json          # Dependências do projeto
└── package-lock.json     # Versões travadas das dependências
```
