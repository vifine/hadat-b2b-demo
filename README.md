# Hadat B2B Portal — demo

Interface demo for the Hadat B2B partner portal (MVP). This is not a production tool.

- One page, `index.html`, served via GitHub Pages at https://hadat-b2b.vifine.tech
- Data: test Airtable base "Hadat B2B Portal — MVP (тест)", with tables for products, price groups, clients, orders and order lines. All clients are fictitious; stock levels and discounts are test values.
- Access: on first open the page asks for an Airtable key (a token scoped to the test base only, `data.records:read` and `data.records:write`). The key is stored only in the viewer's browser. It is not in the code or the repository.

What the demo covers:
- access request
- demo login as a client
- catalog with the price group's prices, case-pack multiples and stock
- cart with minimum order amount
- order submission
- order history with statuses

In the production version, data lives on a server in Russia and clients and orders live in Bitrix24.
