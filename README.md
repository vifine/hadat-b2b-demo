# Hadat B2B Portal — demo

Interface demo for the Hadat B2B partner portal (MVP), built from the Figma mockups "Hadat B2B портал". This is not a production tool.

- Served via GitHub Pages at https://hadat-b2b.vifine.tech
- Files: `index.html` (shell), `styles.css`, `app.js`, `assets/` (logos, login photo), `config.js` (Airtable key)
- Data: test Airtable base "Hadat B2B Portal — MVP (тест)" — products, price groups, clients, portal users, orders and order lines. All clients are fictitious; stock levels and discounts are test values.
- Access: put an Airtable token scoped to the test base (`data.records:read`, `data.records:write`) into `config.js`. If it is empty, the page asks for the key on first open and keeps it only in that browser. Test login: distr@test.example / demo-distr (ООО «Дистрибуция Тест», Алексей Семенов).

Screens:
- login, access request, "request received" (desktop: photo background; mobile: first screen with photo and a button that scrolls to the form)
- catalog grouped by product with variants: partner price with VAT (net and RRP below), stock (В наличии / Мало / Нет в наличии), quantity stepper limited by stock, category and line filters
- cart with clear-cart confirmation, VAT breakdown, savings vs RRP, comment, order submission
- orders journal with status stripes, thumbnails and filters; separate order page with totals and "repeat order"
- collapsible side menu; on mobile it slides in from the right

Order statuses shown: На согласовании (Новый in the base), Подтверждён (Подтверждён / Собирается / Отгружен), Доставлен, Отменён. Orders ship only from stock, so there is no multiplicity or minimum order.

In the production version, data lives on a server in Russia and clients and orders live in Bitrix24.
