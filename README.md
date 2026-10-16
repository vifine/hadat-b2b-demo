# Hadat B2B Portal — demo

Interface demo for the Hadat B2B partner portal (MVP). This is not a production tool.

- One page, `index.html`, served via GitHub Pages at https://hadat-b2b.vifine.tech
- Data: test Airtable base "Hadat B2B Portal — MVP (тест)", with tables for products, price groups, clients, orders and order lines. All clients are fictitious; stock levels and discounts are test values.
- Access: the Airtable key (a token scoped to the test base, `data.records:read` and `data.records:write`) goes into `config.js`. If `config.js` is empty, the page asks for the key on first open. Login uses the test users from the "Пользователи портала" table, for example salon@test.example / demo-salon. All data in the base is test data.

What the demo covers:
- access request
- demo login as a client
- catalog with the price group's prices, case-pack multiples and stock
- cart with minimum order amount
- order submission
- order history with statuses

In the production version, data lives on a server in Russia and clients and orders live in Bitrix24.
