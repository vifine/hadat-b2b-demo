/* HADAT B2B Портал — демо. Данные: тестовая база Airtable «Hadat B2B Portal — MVP (тест)». */
"use strict";

const BASE = "appPQgOZVe1hIwsXm";
const T = {
  prod:{id:"tblJQ3MXYQab4vqSM", name:"fldw5sNze44RGHSPG", sku:"fldx6e7SB8BCJdDTe", ean:"fldM3gEaVOboNeSng", line:"fldKAkNfqIaF0HEM7", type:"fldYULjv2pkyL1ZSl", vol:"fldfOeJbWYb8Qbp35", rrp:"fldDt3mzNjDEklE3I", status:"fldYxpw6bRtdsPT2r", stock:"fld62wvggvuFwZWV2", photo:"fldZx9y1AkdnTYURt"},
  grp:{id:"tblgq9AuVkPiP3Sfg", name:"flddU1UkDigpxUb4C", disc:"fldDD6JXnuhO2NySM"},
  cli:{id:"tblRpgqpDdeuscyVZ", company:"fldJBNgfbJR1MhG9p", inn:"fldJgTuVEf7AkqtjG", city:"fldvWWJj3G2JwSE6w", contact:"fld91jd7DgD2ni3Of", email:"fldzMfWAu0FlJsCe7", phone:"fldlp39UtoHsIIt2i", access:"fldsjtHOYHeQ3W1z2", group:"fldcL04Rs7IAUGSZE"},
  ord:{id:"tblMNpw0BBjoCVqSR", num:"fldds6c0SzpmpHdnR", date:"fldvsyzhAlwA4sqks", status:"fldMvk5Qx4DIBNpBd", comment:"fldCULT7c5x8wBuVo", client:"fldiGVjmdZRQWX6wE", lines:"fldt33LgK8IenWCmk", total:"fldwKpI8ggCeh70D9"},
  user:{id:"tblC7P6ECGHUjNOV6", login:"fldxxQ2TI82jKlEx4", pass:"fldwjYgp7JpYrP3l7", client:"fldNszV5nWOSVuXdk", active:"fldPZNK15kX7A7FfM"},
  line:{id:"tbloOj0cv4gLXTTOV", title:"fldUIPqRFjoLGz9t5", qty:"fld2b7t1FEJ8QoZQY", price:"fldWI4xhpcGWcWCJx", order:"fld54aZZUEmVAPQiT", product:"fldbdz5MkczxtFebM", sum:"fldxGZvcL6UaF9JEM"}
};
const VAT = 0.22;

/* Статусы заказа: в базе — Новый / Подтверждён / Собирается / Отгружен / Доставлен / Отменён.
   В портале показываем четыре: заказ отгружается только из наличия. */
const STATUS = {
  "Новый":{t:"На согласовании", c:"wait", stripe:"var(--st-wait-bg)", active:true, pay:"Не оплачен"},
  "Подтверждён":{t:"Подтверждён", c:"ok", stripe:"var(--st-ok-bg)", active:true, pay:"Не оплачен"},
  "Собирается":{t:"Подтверждён", c:"ok", stripe:"var(--st-ok-bg)", active:true, pay:"Не оплачен"},
  "Отгружен":{t:"Подтверждён", c:"ok", stripe:"var(--st-ok-bg)", active:true, pay:"Оплачен"},
  "Доставлен":{t:"Доставлен", c:"done", stripe:"var(--st-done-bg)", active:false, pay:"Оплачен"},
  "Отменён":{t:"Отменён", c:"off", stripe:"var(--st-off-bg)", active:false, pay:"—"}
};

/* ---------- иконки (из дизайн-системы в Figma) ---------- */
const P = {
  home:'<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/>',
  catalog:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  cart:'<path d="M2.5 3h2.6l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7H6"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/>',
  orders:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  shipments:'<path d="M13 16V6H2v10h11zm0 0h8v-3.5L17.5 9H13v7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  claims:'<path d="M4 4v6h6"/><path d="M4.5 10A8 8 0 1 1 6 16.5"/><path d="M12 8v4.5M12 15.5v.5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2A6.5 6.5 0 0 1 21.5 20"/>',
  address:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  media:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15.5L16 11l-9 9"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>',
  logout:'<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"/><path d="M14 7l5 5-5 5M19 12H8"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  collapse:'<path d="M15 6l-6 6 6 6"/>',
  expand:'<path d="M9 6l6 6-6 6"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5V8"/>',
  trash:'<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
  chat:'<path class="fill" d="M12 3.5c-5 0-9 3.4-9 7.7 0 2.2 1 4.1 2.7 5.5L5 20.5l4.2-1.9c.9.2 1.8.3 2.8.3 5 0 9-3.4 9-7.7s-4-7.7-9-7.7z"/><circle class="dot" cx="8.2" cy="11.2" r="1.15"/><circle class="dot" cx="12" cy="11.2" r="1.15"/><circle class="dot" cx="15.8" cy="11.2" r="1.15"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  down:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>'
};
const ico = (n, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* Мессенджеры: WhatsApp, Telegram, Viber — Simple Icons (CC0); MAX — с max.ru */
const MSG = [
  {n:"WhatsApp", href:"https://wa.me/", vb:"0 0 24 24", d:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"},
  {n:"Telegram", href:"https://t.me/", vb:"0 0 24 24", d:"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"},
  {n:"MAX", href:"https://max.ru/", vb:"0 0 100 100", d:"M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"},
  {n:"Viber", href:"viber://chat", vb:"0 0 24 24", d:"M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z"}
];

/* ---------- утилиты ---------- */
const $ = s => document.querySelector(s);
const root = $("#root");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const r2 = n => Math.round((+n || 0) * 100) / 100;
const money = n => { n = r2(n); return n.toLocaleString("ru-RU", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " ₽" };
const sel = v => v && typeof v === "object" && !Array.isArray(v) ? (v.name ?? "") : (v ?? "");
const ids = v => Array.isArray(v) ? v.map(x => typeof x === "string" ? x : x?.id).filter(Boolean) : [];
const store = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c) };
const title = s => String(s || "").toLowerCase().replace(/(^|[\s-])(\S)/g, (m, a, b) => a + b.toUpperCase());
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : "";
const volRu = v => String(v || "").replace(/\bml\b/i, "мл").replace(/\bg\b/i, "г");
const orderNo = n => "HD-" + String(n || 0).padStart(6, "0");
const dateRu = d => d ? new Date(d).toLocaleDateString("ru-RU", {day:"2-digit", month:"2-digit", year:"numeric"}) : "";
function toast(msg){ const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); t.textContent = msg; document.body.append(t); setTimeout(() => t.remove(), 3200) }

/* ---------- состояние ---------- */
const st = {
  products:[], groups:{}, clients:[], client:null,
  cart:{}, orders:null, lines:null,
  f:{q:"", type:"", line:"", inStock:false, isNew:false, sort:"sku"},
  of:{tab:"all", q:""},
  collapsed: !!store.get("hadat_side_collapsed"),
  applied:null
};

/* ---------- Airtable ---------- */
const KEY_STORE = "hadat_b2b_airtable_key";
let KEY = (window.HADAT_DEMO_KEY || "").trim() || store.get(KEY_STORE) || "";
function errText(e){
  switch(e?.code){
    case "no_key": return "Введите ключ доступа к тестовой базе.";
    case "bad_key": return "Ключ не подошёл: Airtable отклонил его. Проверьте ключ или попросите новый.";
    case "forbidden": return "У ключа нет доступа к тестовой базе. Нужен токен с правами data.records:read и data.records:write на базу «Hadat B2B Portal — MVP (тест)».";
    case "rate_limited": return "Airtable просит сделать паузу: слишком много запросов. Повторите через 30 секунд.";
    case "network": return "Нет связи с Airtable. Проверьте интернет и повторите.";
    case "tool_error": return "Airtable вернул ошибку: " + (e.message || "без описания");
    default: return "Не удалось связаться с Airtable" + (e?.code ? " (" + e.code + ")" : "") + ".";
  }
}
async function api(path, opts = {}){
  if (!KEY) throw {code:"no_key"};
  let r;
  try { r = await fetch("https://api.airtable.com/v0/" + BASE + "/" + path, {...opts, headers:{"Authorization":"Bearer " + KEY, "Content-Type":"application/json"}}) }
  catch(e){ throw {code:"network"} }
  if (r.status === 401) throw {code:"bad_key"};
  if (r.status === 403 || r.status === 404) throw {code:"forbidden"};
  if (r.status === 429) throw {code:"rate_limited"};
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw {code:"tool_error", message:j?.error?.message || j?.error?.type || ("HTTP " + r.status)};
  return j;
}
async function listAll(tableId, fieldIds){
  let out = [], offset;
  for (let i = 0; i < 30; i++){
    const q = new URLSearchParams({returnFieldsByFieldId:"true", pageSize:"100"});
    fieldIds.forEach(f => q.append("fields[]", f));
    if (offset) q.set("offset", offset);
    const j = await api(tableId + "?" + q);
    out = out.concat(j.records || []);
    offset = j.offset;
    if (!offset) break;
  }
  return out.map(r => ({id:r.id, f:r.fields || {}}));
}
async function create(tableId, records){
  const j = await api(tableId + "?returnFieldsByFieldId=true", {method:"POST", body:JSON.stringify({records, returnFieldsByFieldId:true, typecast:true})});
  return (j.records || []).map(r => ({id:r.id, f:r.fields || {}}));
}

/* ---------- загрузка ---------- */
async function boot(){
  if (!KEY) return renderKey();
  renderLoading();
  try {
    const [p, g, c] = await Promise.all([
      listAll(T.prod.id, Object.values(T.prod).filter(x => x !== T.prod.id)),
      listAll(T.grp.id, [T.grp.name, T.grp.disc]),
      listAll(T.cli.id, [T.cli.company, T.cli.inn, T.cli.city, T.cli.contact, T.cli.email, T.cli.phone, T.cli.access, T.cli.group])
    ]);
    const F = T.prod;
    st.products = p.map(r => {
      const name = r.f[F.name] || "";
      const base = name.split(",")[0].trim();
      const ph = (r.f[F.photo] || [])[0];
      return {
        id:r.id, name, base, sku:String(r.f[F.sku] || ""), ean:r.f[F.ean] || "",
        line:title(r.f[F.line]), type:cap(String(r.f[F.type] || "").trim()), vol:volRu(r.f[F.vol]),
        volNum:parseFloat(r.f[F.vol]) || 0,
        rrp:+r.f[F.rrp] || 0, status:sel(r.f[F.status]), stock:+r.f[F.stock] || 0,
        img:ph?.thumbnails?.large?.url || ph?.url || ""
      };
    }).filter(x => x.name && x.rrp);
    g.forEach(r => st.groups[r.id] = {name:r.f[T.grp.name] || "—", disc:+r.f[T.grp.disc] || 0});
    const C = T.cli;
    st.clients = c.map(r => ({id:r.id, company:r.f[C.company], inn:r.f[C.inn], city:r.f[C.city], contact:r.f[C.contact], email:r.f[C.email], phone:r.f[C.phone], access:sel(r.f[C.access]), group:ids(r.f[C.group])[0]}));
    const saved = store.get("hadat_b2b_client");
    const cl = st.clients.find(x => x.id === saved && x.access === "Одобрен");
    if (cl) setClient(cl);
    window.addEventListener("hashchange", route);
    route();
  } catch(e){
    if (e?.code === "bad_key" || e?.code === "forbidden") return renderKey(errText(e));
    renderFatal(e);
  }
}
function setClient(c){
  st.client = c; store.set("hadat_b2b_client", c.id);
  st.cart = store.get("hadat_b2b_cart_" + c.id) || {};
  st.orders = null; st.lines = null;
}

/* ---------- маршруты ---------- */
function route(){
  const h = location.hash.replace(/^#\/?/, "");
  const [a, b] = h.split("/");
  const pub = ["login", "apply", "applied"];
  if (!st.client){
    if (a === "apply") return renderApply();
    if (a === "applied") return renderApplied();
    return renderLogin();
  }
  if (pub.includes(a) || !a) { location.hash = "#/home"; return }
  closeMenu();
  if (a === "home") return renderHome();
  if (a === "catalog") return renderCatalog();
  if (a === "cart") return renderCart();
  if (a === "orders" && b) return renderOrder(b);
  if (a === "orders") return renderOrders();
  const stub = NAV.find(n => n.k === a);
  if (stub) return renderStub(stub);
  location.hash = "#/catalog";
}
const go = h => { if (location.hash === h) route(); else location.hash = h };

/* ============================================================
   ВХОД / ЗАЯВКА / ЗАЯВКА ПРИНЯТА — экраны 01–03
   ============================================================ */
function authLayout({hero, body, after = ""}){
  root.innerHTML = `
  <div class="auth">
    <section class="auth-hero" aria-label="HADAT B2B">
      <div class="top"><img src="assets/logo-main.svg" alt="HADAT Cosmetics"></div>
      <div class="txt">
        <h1 class="h-display">Кабинет партнёра</h1>
        <p>Для салонов, мастеров и дистрибьюторов</p>
        ${hero ? `<a class="btn btn-brown" href="#auth-card" id="heroBtn">${esc(hero)}</a>` : ""}
      </div>
    </section>
    <header class="auth-head">
      <img class="logo-main" src="assets/logo-main.svg" alt="HADAT Cosmetics">
    </header>
    <img class="auth-products" src="assets/hero-products.png" alt="">
    <div class="auth-body">
      <div class="auth-pitch">
        <h1 class="h-display">Кабинет партнёра</h1>
        <p class="desc">Для салонов, мастеров и дистрибьюторов</p>
        <ul class="benefits">
          <li><span>01</span>Персональные цены</li>
          <li><span>02</span>Актуальное наличие</li>
          <li><span>03</span>Прозрачная история заказов</li>
        </ul>
      </div>
      <div class="auth-right" id="auth-card">
        ${body}
        ${after}
      </div>
    </div>
    <footer class="auth-foot">HADAT COSMETICS · Демонстрационный портал</footer>
  </div>`;
  const hb = $("#heroBtn");
  if (hb) hb.onclick = e => { e.preventDefault(); $("#auth-card").scrollIntoView({behavior:"smooth"}) };
}
function renderLoading(){
  if (store.get("hadat_b2b_client")){
    root.innerHTML = `<div class="boot"><img src="assets/favicon.svg" alt="HADAT"><div class="skel"></div></div>`;
    return;
  }
  authLayout({body:`<div class="card-glass"><div class="eyebrow">Личный кабинет</div><h2 class="h-display">Добро пожаловать</h2><div class="skel" style="height:44px"></div><p class="demo-note">Подключаемся к тестовой базе…</p></div>`});
}
function renderKey(msg){
  authLayout({hero:"Открыть демо", body:`
    <form class="card-glass" id="keyForm">
      <div class="eyebrow">Демо-доступ</div>
      <h2 class="h-display">Ключ к демо</h2>
      <p class="lead">Ключ выдаёт автор демо. Он сохраняется только в этом браузере и открывает лишь тестовую базу с вымышленными данными.</p>
      ${msg ? `<div class="err">${esc(msg)}</div>` : ""}
      <div class="field"><label for="k">Ключ доступа</label><input class="input" id="k" type="password" autocomplete="off" required placeholder="pat…"></div>
      <button class="btn btn-brown" type="submit">Открыть демо</button>
    </form>`});
  $("#keyForm").onsubmit = ev => { ev.preventDefault(); KEY = $("#k").value.trim(); store.set(KEY_STORE, KEY); boot() };
}
function renderFatal(e){
  authLayout({body:`<div class="card-glass"><h2 class="h-display">Нет связи</h2><div class="err">${esc(errText(e))}</div>
    <button class="btn btn-brown" id="retry" type="button">Попробовать снова</button>
    <button class="btn btn-blue" id="resetKey" type="button">Ввести другой ключ</button></div>`});
  $("#retry").onclick = boot;
  $("#resetKey").onclick = () => { KEY = ""; store.set(KEY_STORE, ""); renderKey() };
}

function renderLogin(){
  authLayout({hero:"Войти", body:`
    <form class="card-glass" id="loginForm" novalidate>
      <div class="eyebrow">Личный кабинет</div>
      <h2 class="h-display">Добро пожаловать</h2>
      <p class="lead">Войдите, чтобы увидеть персональные цены и оформить заказ.</p>
      <div class="field"><label for="u_login">Рабочий email</label><input class="input" id="u_login" type="email" autocomplete="username" required placeholder="distr@test.example"><span class="hint">Почта, указанная при регистрации</span></div>
      <div class="field"><label for="u_pass">Пароль</label><div class="pwd"><input class="input" id="u_pass" type="password" autocomplete="current-password" required><button type="button" id="showPass" aria-label="Показать пароль">${ico("eye")}</button></div></div>
      <label class="check"><input type="checkbox" checked> Запомнить меня</label>
      <div class="err" id="loginErr" hidden></div>
      <button class="btn btn-brown" id="enter" type="submit">Войти</button>
      <p class="demo-note">Тестовый вход: <code>distr@test.example</code> / <code>demo-distr</code></p>
      <hr>
      <span class="hint">Ещё не сотрудничаете с нами?</span>
      <a class="btn btn-blue" href="#/apply">Подать заявку на доступ</a>
      <span class="hint">Нужна помощь? <a href="mailto:b2b@hadat.ru">b2b@hadat.ru</a></span>
    </form>`});
  $("#showPass").onclick = () => { const i = $("#u_pass"); i.type = i.type === "password" ? "text" : "password" };
  $("#loginForm").onsubmit = async ev => {
    ev.preventDefault();
    const b = $("#enter"), err = $("#loginErr");
    const lg = $("#u_login").value.trim().toLowerCase(), pw = $("#u_pass").value;
    if (!lg || !pw){ err.textContent = "Введите email и пароль."; err.hidden = false; return }
    b.disabled = true; b.textContent = "Проверяем…"; err.hidden = true;
    try {
      const U = T.user;
      const users = await listAll(U.id, [U.login, U.pass, U.client, U.active]);
      const u = users.find(r => String(r.f[U.login] || "").trim().toLowerCase() === lg && String(r.f[U.pass] || "") === pw);
      if (!u) throw {msg:"Неверный email или пароль."};
      if (!u.f[U.active]) throw {msg:"Учётная запись отключена. Обратитесь к менеджеру Hadat."};
      const c = st.clients.find(x => x.id === ids(u.f[U.client])[0]);
      if (!c || c.access !== "Одобрен") throw {msg:"Доступ компании ещё не одобрен."};
      setClient(c); go("#/home");
    } catch(e){
      b.disabled = false; b.textContent = "Войти";
      err.textContent = e.msg || errText(e); err.hidden = false;
    }
  };
}

function renderApply(){
  authLayout({hero:"Подать заявку", body:`
    <form class="card-glass" id="applyForm">
      <div class="eyebrow">Стать партнёром</div>
      <h2 class="h-display">Заявка на доступ</h2>
      <p class="lead">Расскажите о вашем бизнесе. Менеджер обсудит условия сотрудничества и поможет получить доступ.</p>
      <div class="grid3">
        <div class="field span2"><label for="a_company">Название компании / салона *</label><input class="input" id="a_company" required></div>
        <div class="field"><label for="a_type">Тип бизнеса *</label><select class="input" id="a_type" required><option>Салон красоты</option><option>Частный мастер</option><option>Дистрибьютор</option><option>Магазин / сеть</option></select></div>
        <div class="field"><label for="a_contact">Контактное лицо *</label><input class="input" id="a_contact" required autocomplete="name"></div>
        <div class="field"><label for="a_phone">Телефон *</label><input class="input" id="a_phone" type="tel" required autocomplete="tel"></div>
        <div class="field"><label for="a_email">Рабочий email *</label><input class="input" id="a_email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="a_city">Город *</label><input class="input" id="a_city" required></div>
        <div class="field"><label for="a_inn">ИНН · необязательно</label><input class="input" id="a_inn" inputmode="numeric" pattern="\\d{10}|\\d{12}"></div>
        <div class="field"><label for="a_comment">Комментарий</label><input class="input" id="a_comment"></div>
      </div>
      <label class="check"><input type="checkbox" id="a_agree" required checked> Согласна на обработку персональных данных</label>
      <p class="demo-note">Это демо: заявка запишется в тестовую базу. Не указывайте реальные данные.</p>
      <div class="grid2">
        <button class="btn btn-brown" id="a_submit" type="submit">Отправить заявку</button>
        <a class="btn btn-blue" href="#/login">Уже есть доступ? Войти</a>
      </div>
      <span class="hint">Нужна помощь? <a href="mailto:b2b@hadat.ru">b2b@hadat.ru</a></span>
    </form>`});
  $("#applyForm").onsubmit = async ev => {
    ev.preventDefault();
    const b = $("#a_submit"); b.disabled = true; b.textContent = "Отправляем…";
    const v = id => $("#" + id).value.trim();
    const data = {company:v("a_company"), contact:v("a_contact"), phone:v("a_phone"), email:v("a_email"), city:v("a_city"), type:v("a_type"), inn:v("a_inn"), comment:v("a_comment")};
    const C = T.cli;
    try {
      const f = {[C.company]:data.company, [C.city]:data.city, [C.contact]:data.contact, [C.email]:data.email, [C.phone]:data.phone, [C.access]:"Заявка"};
      if (data.inn) f[C.inn] = data.inn;
      await create(C.id, [{fields:f}]);
      st.applied = data; go("#/applied");
    } catch(e){
      b.disabled = false; b.textContent = "Отправить заявку";
      toast(e?.code === "network" ? "Ответ не получен. Заявка могла сохраниться — проверьте перед повтором." : errText(e));
    }
  };
}

function renderApplied(){
  const d = st.applied;
  if (!d) return go("#/apply");
  const kv = (k, v, w) => `<div class="kvv${w ? " wide" : ""}"><b>${k}</b><span>${esc(v || "—")}</span></div>`;
  authLayout({hero:"Моя заявка", body:`
    <div class="card-glass">
      <div class="eyebrow">Заявка отправлена</div>
      <h2 class="h-display">Заявка принята</h2>
      <p class="lead">Спасибо за интерес к HADAT COSMETICS. Менеджер свяжется с вами по указанным контактам и расскажет о следующих шагах.</p>
      <div class="summary-box">
        ${kv("Название компании / салона", d.company)}${kv("Контактное лицо", d.contact)}
        ${kv("Телефон", d.phone)}${kv("Рабочий email", d.email)}
        ${kv("Город", d.city)}${kv("Тип бизнеса", d.type)}
        ${kv("ИНН", d.inn)}
        ${d.comment ? kv("Комментарий", d.comment, true) : ""}
      </div>
    </div>`,
    after:`<div class="messengers"><span class="lbl">Быстрая связь с менеджером</span>${MSG.map(m => `<a class="msg" href="${m.href}" target="_blank" rel="noopener" aria-label="${m.n}" title="${m.n}"><svg viewBox="${m.vb}" aria-hidden="true"><path fill-rule="evenodd" d="${m.d}"/></svg></a>`).join("")}</div>`});
}

/* ============================================================
   ОБОЛОЧКА ПРИЛОЖЕНИЯ
   ============================================================ */
const NAV = [
  {k:"home", t:"Главная", i:"home"},
  {k:"catalog", t:"Каталог", i:"catalog"},
  {k:"orders", t:"Заказы", i:"orders"},
  {k:"shipments", t:"Отгрузки", i:"shipments"},
  {k:"claims", t:"Рекламации", i:"claims"},
  {k:"users", t:"Пользователи", i:"users"},
  {k:"addresses", t:"Адреса доставки", i:"address"},
  {k:"media", t:"Медиа", i:"media"},
  {k:"help", t:"Справка", i:"help"}
];
const grp = () => st.groups[st.client?.group] || {name:"—", disc:0};
const priceOf = p => r2(p.rrp * (1 - grp().disc));
const netOf = p => r2(priceOf(p) / (1 + VAT));
function cartLines(){ return Object.entries(st.cart).map(([id, q]) => ({p:st.products.find(x => x.id === id), q})).filter(x => x.p && x.q > 0) }
function cartTotal(){ return cartLines().reduce((s, x) => s + priceOf(x.p) * x.q, 0) }
function saveCart(){ store.set("hadat_b2b_cart_" + st.client.id, st.cart) }
function initials(s){ return String(s || "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase() }
function clientNo(){ const d = String(st.client?.inn || "").replace(/\D/g, ""); return d ? d.slice(-6) : "100245" }

function shell(active, crumbs, html, opts = {}){
  const L = cartLines(), n = L.reduce((s, x) => s + x.q, 0);
  const c = st.client;
  const showCat = active !== "catalog", showCart = active !== "cart";
  root.innerHTML = `
  <div class="shell" id="shell">
    <aside class="side" aria-label="Меню">
      <div class="side-top">
        <a href="#/home" aria-label="На главную"><img class="logo-b2b" src="assets/logo-b2b.svg" alt="HADAT B2B-портал"><img class="logo-sq" src="assets/favicon.svg" alt="HADAT"></a>
        <button class="close-btn" id="closeMenu" type="button" aria-label="Закрыть меню">${ico("close")}</button>
      </div>
      <nav class="nav">${NAV.map(i => `<a href="#/${i.k}" ${i.k === active ? 'aria-current="page"' : ""} title="${i.t}">${ico(i.i)}<span>${i.t}</span></a>`).join("")}</nav>
      <div class="spacer"></div>
      <nav class="nav"><a href="#" id="logout" title="Выйти">${ico("logout")}<span>Выйти</span></a></nav>
    </aside>
    <div class="scrim" id="scrim"></div>
    <div class="main">
      <header class="topbar">
        <a class="tb-logo" href="#/home"><img src="assets/favicon.svg" alt="HADAT"></a>
        <nav class="crumbs" aria-label="Навигация">${crumbs.map((x, i) => i < crumbs.length - 1 ? `<a href="${x[1]}">${esc(x[0])}</a><span>/</span>` : `<b>${esc(x[0])}</b>`).join("")}</nav>
        ${showCat ? `<a class="tb-link" href="#/catalog">${ico("catalog")}<span class="t">Каталог</span></a>` : ""}
        ${showCart ? `<a class="tb-link" href="#/cart">${ico("cart")}<span class="t">Корзина</span>${n ? `<span class="count num">${n}</span><span class="tb-sum num">${money(cartTotal())}</span>` : ""}</a>` : ""}
        <div class="ntf-wrap"><button class="ntf-btn" id="ntfBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Уведомления">${ico("bell")}${unreadCount() ? `<span class="ntf-dot" aria-hidden="true"></span>` : ""}</button>
          <div class="ntf-pop" id="ntfPop" role="dialog" aria-label="Уведомления" hidden></div></div>
        <div class="who-wrap"><button class="who" id="who" type="button" aria-haspopup="menu" aria-expanded="false"><span class="n"><b>${esc(c.company)}</b><span>№ ${esc(clientNo())} · ${esc(c.contact || "")}</span></span><span class="avatar">${esc(initials(c.contact || c.company))}</span></button>
          <div class="who-menu" id="whoMenu" role="menu" hidden>
            <div class="wm-head"><b>${esc(c.company)}</b><span>${esc(c.contact || "")}${c.email ? " · " + esc(c.email) : ""}</span><span>${esc(grp().name)} · скидка ${Math.round(grp().disc * 100)}%</span></div>
            <button type="button" role="menuitem" id="whoLogout">${ico("logout")} Выйти</button>
          </div></div>
        <button class="burger" id="burger" type="button" aria-label="Открыть меню">${ico("menu")}</button>
      </header>
      <main class="content" id="content">${html}</main>
      <div class="chat-fab" id="chatFab">
        <div class="chat-list" id="chatList" hidden>${MSG.map(m => `<button type="button" class="msg" aria-label="${m.n}" title="${m.n}"><svg viewBox="${m.vb}" aria-hidden="true"><path fill-rule="evenodd" d="${m.d}"/></svg></button>`).join("")}</div>
        <button type="button" class="chat-btn" id="chatBtn" aria-label="Написать менеджеру" aria-expanded="false">${ico("chat")}</button>
      </div>
    </div>
  </div>`;
  $("#burger").onclick = () => $("#shell").classList.add("menu-open");
  $("#closeMenu").onclick = closeMenu; $("#scrim").onclick = closeMenu;
  $("#ntfBtn").onclick = e => { e.stopPropagation(); const pop = $("#ntfPop"); if (!pop.hidden){ pop.hidden = true; return } drawNtf(); pop.hidden = false; $("#ntfBtn").setAttribute("aria-expanded","true");
    setTimeout(() => document.addEventListener("click", function h(ev){ if (!pop.contains(ev.target)){ pop.hidden = true; $("#ntfBtn")?.setAttribute("aria-expanded","false"); document.removeEventListener("click", h) } }), 0) };
  const bounce = () => { const b = $("#chatBtn"); if (!b || !$("#chatList").hidden) return; b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce") };
  clearTimeout(window._cbT); clearInterval(window._cbI);
  window._cbT = setTimeout(() => { bounce(); window._cbI = setInterval(bounce, 10000) }, 3000);
  $("#chatBtn").onclick = e => { e.stopPropagation(); const l = $("#chatList"); l.hidden = !l.hidden; $("#chatBtn").setAttribute("aria-expanded", !l.hidden); $("#chatBtn").innerHTML = ico(l.hidden ? "chat" : "close");
    if (!l.hidden) setTimeout(() => document.addEventListener("click", function h(ev){ if (!$("#chatFab")?.contains(ev.target)){ l.hidden = true; $("#chatBtn") && ($("#chatBtn").innerHTML = ico("chat")); document.removeEventListener("click", h) } }), 0) };
  const doLogout = e => { e.preventDefault(); st.client = null; store.set("hadat_b2b_client", null); go("#/login") };
  $("#logout").onclick = doLogout; $("#whoLogout").onclick = doLogout;
  $("#who").onclick = e => { e.stopPropagation(); const m = $("#whoMenu"); m.hidden = !m.hidden; $("#who").setAttribute("aria-expanded", !m.hidden);
    if (!m.hidden) setTimeout(() => document.addEventListener("click", function h(ev){ if (!m.contains(ev.target)){ m.hidden = true; $("#who")?.setAttribute("aria-expanded","false"); document.removeEventListener("click", h) } }), 0) };
  if (!opts.keepScroll) window.scrollTo({top:0});
}
/* ---------- уведомления (демо, фиктивные) ---------- */
const NTF = [
  {id:"n5", kind:"ship", title:"Заказ отгружен", text:"HD-002470 передан в службу доставки. Трек-номер появится в карточке заказа.", time:"Сегодня, 10:24", num:2470},
  {id:"n4", kind:"ok", title:"Заказ подтверждён", text:"HD-002476 подтверждён менеджером. Счёт на оплату готов.", time:"Вчера, 17:05", num:2476},
  {id:"n3", kind:"new", title:"Новинки в каталоге", text:"Линия Detox Therapy: шампунь, скраб, пилинг и тоник для кожи головы.", time:"14 октября", href:"#/catalog", filter:{line:"Detox Therapy"}},
  {id:"n2", kind:"done", title:"Заказ доставлен", text:"HD-002455 доставлен. Спасибо за заказ!", time:"14 октября", num:2455},
  {id:"n1", kind:"off", title:"Заказ отменён", text:"HD-002398 отменён по вашей просьбе. Резерв снят.", time:"8 сентября", num:2398}
];
const NTF_IC = {ship:"shipments", ok:"orders", new:"catalog", done:"orders", off:"close"};
const readSet = () => new Set(store.get("hadat_ntf_read_" + (st.client?.id || "")) || []);
const unreadCount = () => { const r = readSet(); return NTF.filter(n => !r.has(n.id)).length };
function markRead(ids){ const r = readSet(); ids.forEach(i => r.add(i)); store.set("hadat_ntf_read_" + st.client.id, [...r]); if (!unreadCount()) document.querySelector(".ntf-dot")?.remove() }
function drawNtf(){
  const r = readSet(), pop = $("#ntfPop");
  pop.innerHTML = `<div class="ntf-h"><b>Уведомления</b>${unreadCount() ? `<button type="button" id="ntfAll">Прочитать все</button>` : ""}</div>
    <div class="ntf-list">${NTF.map(n => `<button type="button" class="ntf-i k-${n.kind}${r.has(n.id) ? "" : " unread"}" data-ntf="${n.id}">
      <span class="ntf-ic">${ico(NTF_IC[n.kind])}</span>
      <span class="ntf-t"><b>${esc(n.title)}</b><span>${esc(n.text)}</span><small>${esc(n.time)}</small></span></button>`).join("")}</div>`;
  $("#ntfAll") && ($("#ntfAll").onclick = e => { e.stopPropagation(); markRead(NTF.map(n => n.id)); drawNtf() });
  pop.querySelectorAll("[data-ntf]").forEach(b => b.onclick = async () => {
    const n = NTF.find(x => x.id === b.dataset.ntf); markRead([n.id]); pop.hidden = true;
    if (n.filter){ st.f = {...st.f, q:"", type:"", line:"", inStock:false, isNew:false, ...n.filter}; return go("#/catalog") }
    try { await loadOrders() } catch(e){}
    const o = (st.orders || []).find(x => x.num === n.num);
    go(o ? "#/orders/" + o.id : "#/orders");
  });
}
function closeMenu(){ const s = $("#shell"); if (s) s.classList.remove("menu-open") }
function updateTopCart(){
  const L = cartLines(), n = L.reduce((s, x) => s + x.q, 0);
  const a = document.querySelector('.tb-link[href="#/cart"]'); if (!a) return;
  a.innerHTML = `${ico("cart")}<span class="t">Корзина</span>${n ? `<span class="count num">${n}</span><span class="tb-sum num">${money(cartTotal())}</span>` : ""}`;
}

/* ---------- Главная ---------- */
function renderHome(){
  const L = cartLines(), n = L.reduce((s, x) => s + x.q, 0);
  shell("home", [["Главная"]], `<div class="home">
    <div class="page-head"><h1 class="h-display">Здравствуйте, ${esc((st.client.contact || "").split(" ")[0] || "партнёр")}</h1></div>
    <p style="margin:0 0 8px;color:var(--text-2)">${esc(st.client.company)} · ценовая группа «${esc(grp().name)}», скидка ${Math.round(grp().disc * 100)}% от РРЦ</p>
    <div class="home-grid">
      <a class="tile" href="#/catalog"><span class="tile-ic">${ico("catalog")}</span><span class="tile-go">${ico("arrow")}</span><span class="eyebrow">Каталог</span><b class="num">${new Set(st.products.map(p => p.base)).size} товаров</b><span>${st.products.length} вариаций · ${st.products.filter(p => p.stock > 0).length} в наличии</span></a>
      <a class="tile" href="#/cart"><span class="tile-ic">${ico("cart")}</span><span class="tile-go">${ico("arrow")}</span><span class="eyebrow">Корзина</span><b class="num">${n ? money(cartTotal()) : "Пусто"}</b><span>${n ? `${L.length} ${plural(L.length, "позиция", "позиции", "позиций")} · ${n} ед.` : "Добавьте товары из каталога"}</span></a>
      <a class="tile" href="#/orders"><span class="tile-ic">${ico("orders")}</span><span class="tile-go">${ico("arrow")}</span><span class="eyebrow">Заказы</span><b>История</b><span>Статусы, суммы и состав заказов</span></a>
    </div>
    <section class="promos" aria-label="Новинки и линии" aria-roledescription="карусель">
      <div class="promos-track" id="promoTrack">${PROMOS.map((x, i) => `
        <article class="promo-card" style="--pos:${x.pos || "center"}" aria-label="${i + 1} из ${PROMOS.length}">
          <div class="promo-img"><img src="${x.img}" alt="${esc(x.alt)}" loading="${i ? "lazy" : "eager"}"></div>
          <div class="promo-txt">
            <span class="promo-eyebrow">${esc(x.eyebrow)}</span>
            <h2 class="h-display">${esc(x.title)}</h2>
            <p>${esc(x.text)}</p>
            <div class="promo-cta"><a class="btn promo-btn" href="#/catalog" data-promo="${i}">${esc(x.cta)}</a>${x.note ? `<span class="promo-soon">${esc(x.note)}</span>` : ""}</div>
          </div>
        </article>`).join("")}
      </div>
      <div class="promo-dots" id="promoDots">${PROMOS.map((x, i) => `<button type="button" aria-label="Баннер ${i + 1}" data-dot="${i}"></button>`).join("")}</div>
    </section></div>`);
  document.querySelectorAll("[data-promo]").forEach(a => a.onclick = e => { e.preventDefault(); const x = PROMOS[+a.dataset.promo]; st.f = {...st.f, q:"", type:"", line:"", inStock:false, isNew:false, ...x.filter}; go("#/catalog") });
  initPromoSlider();
}
const PROMOS = [
  {img:"assets/promo-primer.jpg", pos:"center 30%", alt:"Hair Discipline Style Primer 5-in-1", bg:"#7b5b63", eyebrow:"Новинка · стайлинг", title:"Style Primer 5-in-1", text:"Праймер для укладки: термозащита до 180 °C, контроль пушистости, эластичная фиксация, блеск и уход.", cta:"Смотреть новинки", note:"Праймер — скоро в каталоге", filter:{isNew:true}},
  {img:"assets/promo-detox.jpg", alt:"Линия Detox Therapy", bg:"#2f3b31", eyebrow:"Новая линия · кожа головы", title:"Detox Therapy", text:"Глубокое очищение и баланс кожи головы: шампунь, скраб, пилинг и тоник.", cta:"Смотреть линию", filter:{line:"Detox Therapy"}},
  {img:"assets/promo-calm.jpg", alt:"Уход за телом Calm", bg:"#3b2e27", eyebrow:"Уход за телом", title:"Calm Body Care", text:"Очищение, увлажнение и комфорт кожи тела и рук с премиальной ароматикой.", cta:"Смотреть уход за телом", filter:{line:"Body"}}
];
let promoTimer = null;
/* товары из баннеров на главной помечаем «Новинка» */
const isPromo = p => p.line === "Detox Therapy" || /^(Calm|Hair Discipline)\b/i.test(p.base);
const newBadge = p => isPromo(p) ? `<span class="new-b">Новинка</span>` : "";
function initPromoSlider(){
  clearInterval(promoTimer);
  const tr = $("#promoTrack"), dots = [...document.querySelectorAll("[data-dot]")];
  if (!tr) return;
  const cards = [...tr.children];
  const cur = () => Math.round(tr.scrollLeft / (cards[0].offsetWidth || 1));
  const mark = () => dots.forEach((d, i) => d.setAttribute("aria-current", i === cur()));
  const goTo = i => tr.scrollTo({left: cards[i % cards.length].offsetLeft - tr.offsetLeft, behavior: "smooth"});
  dots.forEach(d => d.onclick = () => goTo(+d.dataset.dot));
  tr.onscroll = () => mark(); mark();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paused = false;
  tr.onpointerdown = tr.onmouseenter = () => paused = true;
  tr.onmouseleave = () => paused = false;
  tr.ontouchend = () => setTimeout(() => paused = false, 4000);
  promoTimer = setInterval(() => {
    if (!document.body.contains(tr)) return clearInterval(promoTimer);
    if (paused || reduce || tr.scrollWidth <= tr.clientWidth + 4) return;
    goTo(cur() + 1);
  }, 5000);
}
function newCount(){ return new Set(st.products.filter(p => p.status === "Новинка").map(p => p.base)).size }
function renderStub(n){
  shell(n.k, [["Главная", "#/home"], [n.t]], `
    <div class="page-head"><h1 class="h-display">${esc(n.t)}</h1></div>
    <div class="empty">${ico(n.i)}<h2 class="h-display">Раздел в разработке</h2><p>В демо-версии портала работают каталог, корзина и заказы.</p><a class="btn btn-line" href="#/catalog">Перейти в каталог</a></div>`);
}

/* ============================================================
   КАТАЛОГ
   ============================================================ */
function stockPill(p){
  if (p.stock <= 0) return `<span class="pill off">Нет в наличии</span>`;
  if (p.stock < 60) return `<span class="pill low">Мало</span>`;
  return `<span class="pill ok">В наличии</span>`;
}
function filtered(){
  const f = st.f, q = f.q.trim().toLowerCase();
  return st.products.filter(p => (!f.type || p.type === f.type) && (!f.line || p.line === f.line) && (!f.inStock || p.stock > 0) && (!f.isNew || p.status === "Новинка") &&
    (!q || (p.name + " " + p.sku + " " + p.ean).toLowerCase().includes(q)));
}
function groupsOf(list){
  const m = new Map();
  for (const p of list){ if (!m.has(p.base)) m.set(p.base, []); m.get(p.base).push(p) }
  const arr = [...m.entries()].map(([base, vs]) => ({base, vs:vs.sort((a, b) => a.volNum - b.volNum), type:vs[0].type, line:vs[0].line, sku:Math.min(...vs.map(v => +v.sku || 0))}));
  return arr.sort((a, b) => st.f.sort === "name" ? a.base.localeCompare(b.base) : a.sku - b.sku);
}
function renderCatalog(){
  const types = [...new Set(st.products.map(p => p.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
  const lines = [...new Set(st.products.map(p => p.line).filter(Boolean))].sort();
  const chips = (k, arr, all) => [["", all], ...arr.map(x => [x, x])].map(([v, t]) => `<button type="button" class="chip" data-${k}="${esc(v)}" aria-pressed="${st.f[k] === v}">${esc(t)}</button>`).join("");
  shell("catalog", [["Главная", "#/home"], ["Каталог"]], `
    <div class="toolbar">
      <div class="search">${ico("search")}<input class="input" type="search" id="q" placeholder="Название или артикул" value="${esc(st.f.q)}" aria-label="Поиск по каталогу"></div>
      <label class="check"><input type="checkbox" id="inStock" ${st.f.inStock ? "checked" : ""}> Только в наличии</label>
      <label class="check"><input type="checkbox" id="isNew" ${st.f.isNew ? "checked" : ""}> Новинки</label>
      <button class="btn btn-blue btn-sm reset-f" id="resetF" type="button" hidden>${ico("close")} Сбросить фильтры</button>
      <div class="meta"><span>${esc(grp().name)} · скидка <b class="num">${Math.round(grp().disc * 100)}%</b></span><span id="cnt" class="num"></span>
        <select class="input" id="sort" style="height:32px;width:auto;font-size:13px" aria-label="Сортировка"><option value="sku" ${st.f.sort === "sku" ? "selected" : ""}>По артикулу</option><option value="name" ${st.f.sort === "name" ? "selected" : ""}>По названию</option></select></div>
    </div>
    <div class="chiprow" role="group" aria-label="Категория"><span class="lbl">Категория</span>${chips("type", types, "Все")}</div>
    <div class="chiprow" role="group" aria-label="Линия"><span class="lbl">Линия</span>${chips("line", lines, "Все линии")}</div>
    <div class="cols"><span>Объём</span><span>Оптовая цена</span><span>Наличие</span><span>Количество · Сумма</span></div>
    <div id="cards"></div>`);
  $("#q").oninput = e => { st.f.q = e.target.value; drawCards() };
  $("#inStock").onchange = e => { st.f.inStock = e.target.checked; drawCards() };
  $("#isNew").onchange = e => { st.f.isNew = e.target.checked; drawCards() };
  $("#sort").onchange = e => { st.f.sort = e.target.value; drawCards() };
  document.querySelectorAll("[data-type],[data-line]").forEach(b => b.onclick = () => {
    const k = b.dataset.type !== undefined ? "type" : "line";
    st.f[k] = b.dataset[k];
    document.querySelectorAll(`[data-${k}]`).forEach(x => x.setAttribute("aria-pressed", x === b));
    drawCards();
  });
  drawCards();
}
function vrowHtml(p){
  const q = st.cart[p.id] || 0, off = p.stock <= 0;
  return `<div class="vrow${q ? " incart" : ""}${off ? " off" : ""}" data-row="${p.id}">
    <button type="button" class="im" data-open="${p.id}" aria-label="Карточка товара">${p.img ? `<span class="thumb"><img src="${esc(p.img)}" alt="" loading="lazy"></span>` : `<div class="thumb-ph"></div>`}</button>
    <div class="vol"><b class="num">${esc(p.vol)}</b><span class="sku num">${esc(p.sku)}</span>${q ? `<span class="incart-b">✓ в корзине</span>` : ""}</div>
    <div class="pr num"><b>${money(priceOf(p))}</b> <small>с НДС</small><button type="button" class="tip" data-tip="${p.id}" aria-label="Подробнее о цене">${ico("info")}</button>
      <div class="sub">${money(netOf(p))} без НДС · РРЦ ${money(p.rrp)}</div></div>
    <div class="st">${stockPill(p)}</div>
    <div class="stw">${stepper(p, q, "c")}</div>
    <div class="vsum num${q ? "" : " zero"}">${q ? money(priceOf(p) * q) : "—"}</div>
  </div>`;
}
function stepper(p, q, pfx){
  const off = p.stock <= 0;
  return `<div class="stepper${off ? " dis" : ""}"><button type="button" data-${pfx}m="${p.id}" aria-label="Меньше" ${off ? "disabled" : ""}>−</button><input class="num" type="number" inputmode="numeric" min="0" max="${p.stock}" value="${q}" data-${pfx}i="${p.id}" aria-label="Количество" ${off ? "disabled" : ""}><button type="button" data-${pfx}p="${p.id}" aria-label="Больше" ${off ? "disabled" : ""}>+</button></div>`;
}
function setQty(p, q){
  q = Math.max(0, Math.floor(+q || 0));
  if (q > p.stock){ q = p.stock; toast(`В наличии ${p.stock} шт. — заказ отгружается только со склада`) }
  if (q) st.cart[p.id] = q; else delete st.cart[p.id];
  saveCart();
}
function drawCards(){
  const list = filtered(), G = groupsOf(list);
  const rf = $("#resetF"); if (rf){ const f = st.f; rf.hidden = !(f.q.trim() || f.type || f.line || f.inStock || f.isNew); rf.onclick = () => { st.f = {...st.f, q:"", type:"", line:"", inStock:false, isNew:false}; renderCatalog() } }
  const units = cartLines().reduce((s, x) => s + x.q, 0);
  $("#cnt").textContent = `${G.length} ${plural(G.length, "товар", "товара", "товаров")} · ${list.length} ${plural(list.length, "вариация", "вариации", "вариаций")}${units ? ` · ${units} ед. в корзине` : ""}`;
  const box = $("#cards");
  if (!G.length){ box.innerHTML = `<div class="empty">${ico("search")}<h2 class="h-display">Ничего не найдено</h2><p>Измените поиск или сбросьте фильтры.</p><button class="btn btn-line" id="reset" type="button">Сбросить фильтры</button></div>`;
    $("#reset").onclick = () => { st.f = {...st.f, q:"", type:"", line:"", inStock:false, isNew:false}; renderCatalog() }; return }
  box.innerHTML = G.map(g => `<section class="pcard">
    <div class="pcard-h"><h3><button type="button" class="open-link" data-open="${g.vs[0].id}">${esc(g.base)}</button>${newBadge(g.vs[0])}</h3><span class="ptot num" data-ptot="${esc(g.base)}">${ptotHtml(g.base)}</span></div>
    ${g.vs.map(vrowHtml).join("")}</section>`).join("");
  bindSteppers(box, "c", p => refreshRow(p));
  box.querySelectorAll("[data-tip]").forEach(b => b.onclick = e => { e.stopPropagation(); showTip(b, st.products.find(x => x.id === b.dataset.tip)) });
}
function ptotHtml(base){
  const L = cartLines().filter(x => x.p.base === base);
  if (!L.length) return "";
  const q = L.reduce((s, x) => s + x.q, 0), sum = L.reduce((s, x) => s + priceOf(x.p) * x.q, 0);
  return `<span>${q} шт.</span><b>${money(sum)}</b>`;
}
function refreshRow(p){
  const pt = [...document.querySelectorAll("[data-ptot]")].find(x => x.dataset.ptot === p.base); if (pt) pt.innerHTML = ptotHtml(p.base);
  const old = document.querySelector(`[data-row="${p.id}"]`); if (!old) return;
  const t = document.createElement("div"); t.innerHTML = vrowHtml(p); const nw = t.firstElementChild;
  old.replaceWith(nw);
  bindSteppers(nw, "c", refreshRow);
  nw.querySelectorAll("[data-tip]").forEach(b => b.onclick = e => { e.stopPropagation(); showTip(b, p) });
  const list = filtered(), G = groupsOf(list), units = cartLines().reduce((s, x) => s + x.q, 0);
  $("#cnt").textContent = `${G.length} ${plural(G.length, "товар", "товара", "товаров")} · ${list.length} ${plural(list.length, "вариация", "вариации", "вариаций")}${units ? ` · ${units} ед. в корзине` : ""}`;
  updateTopCart();
}
function bindSteppers(box, pfx, after){
  const P = id => st.products.find(x => x.id === id);
  box.querySelectorAll(`[data-${pfx}m]`).forEach(b => b.onclick = () => { const p = P(b.getAttribute(`data-${pfx}m`)); setQty(p, (st.cart[p.id] || 0) - 1); after(p) });
  box.querySelectorAll(`[data-${pfx}p]`).forEach(b => b.onclick = () => { const p = P(b.getAttribute(`data-${pfx}p`)); setQty(p, (st.cart[p.id] || 0) + 1); after(p) });
  box.querySelectorAll(`[data-${pfx}i]`).forEach(i => { i.onchange = () => { const p = P(i.getAttribute(`data-${pfx}i`)); setQty(p, i.value); after(p) }; i.onfocus = () => i.select() });
}
function showTip(btn, p){
  document.querySelectorAll(".tipbox").forEach(x => x.remove());
  const r = btn.getBoundingClientRect();
  const t = document.createElement("div"); t.className = "tipbox num";
  t.innerHTML = `<b>Цена указана с НДС 22%</b><div><span>Без НДС</span><span>${money(netOf(p))}</span></div><div><span>РРЦ</span><span>${money(p.rrp)}</span></div><div><span>Ваша выгода</span><span>${money(p.rrp - priceOf(p))} · ${Math.round(grp().disc * 100)}%</span></div>`;
  document.body.append(t);
  t.style.left = Math.max(8, Math.min(window.innerWidth - 228, r.left + window.scrollX - 100)) + "px";
  t.style.top = (r.top + window.scrollY - t.offsetHeight - 8) + "px";
  setTimeout(() => document.addEventListener("click", () => t.remove(), {once:true}), 0);
}


/* ============================================================
   КАРТОЧКА ТОВАРА — попап (экран 15 в Figma)
   Характеристики на русском — снимок полей Hadat PIM: assets/products-ru.json
   ============================================================ */
let RU = null;
async function loadRu(){ if (RU) return RU; try { RU = await (await fetch("assets/products-ru.json")).json() } catch(e){ RU = {} } return RU }
const DASH = "—";
function fmtVol(r, p){ return r.vol ? `${r.vol} ${r.volUnit === "g" ? "г" : "мл"}` : p.vol }
function cardSections(p, r){
  const n = v => v === undefined || v === null || v === "" ? DASH : String(v);
  const mo = v => v ? `${v} мес.` : DASH;
  const dims = r.L && r.W && r.H ? `${r.L} × ${r.W} × ${r.H} мм` : DASH;
  const wt = r.net || r.gross ? `${r.net ? r.net + " г" : DASH} / ${r.gross ? r.gross + " г" : DASH}` : DASH;
  return [
    ["Описание", [["Описание товара", r.desc, 1], ["Какую проблему решает", r.problem], ["Результат", r.result], ["Назначение", r.purpose]]],
    ["Для кого", [["Тип волос", r.hair], ["Тип кожи головы", r.scalp], ["Зона применения", r.zone], ["Тип кожи тела и рук", r.skin]]],
    ["Компоненты", [["Ключевые компоненты", r.keyIngr], ["Активные компоненты и технология", r.actives], ["Состав (INCI)", r.inci, 1]]],
    ["Способ применения", [["Способ применения", r.usage, 1]]],
    ["Аромат", [["Группа аромата", r.aromaGroup], ["Описание аромата (короткое)", r.aromaShort], ["Описание аромата (развернутое)", r.aromaLong, 1], ["Ноты (верхние)", r.notesTop], ["Ноты (сердце)", r.notesHeart], ["Ноты (база)", r.notesBase]]],
    ["Хранение и безопасность", [["Срок годности", mo(r.shelf)], ["После вскрытия", mo(r.pao)], ["Условия хранения", r.storage, 1], ["Предупреждения", r.warnings]]],
    ["Упаковка и логистика", [["Объём", fmtVol(r, p)], ["Тип упаковки", r.packType], ["Комплектация упаковки", r.packKit], ["Вес нетто / брутто", wt], ["Габариты (Д × Ш × В)", dims], ["Кол-во в мастер-боксе", r.masterBox ? r.masterBox + " шт." : ""], ["Кол-во в транспортном коробе", r.transportBox ? r.transportBox + " шт." : ""], ["Кол-во в наборе", r.setQty ? r.setQty + " шт." : ""], ["Страна производства", r.country], ["Альтернативная страна производства", r.countryAlt]]]
  ].map(([t, items]) => `<section class="pm-sec"><h3>${t}</h3><div class="pm-grid">${items.map(([k, v, w]) => { const val = n(v); return `<div class="pm-f${w ? " wide" : ""}"><span>${k}</span><p class="${val === DASH ? "nil" : ""}">${esc(val)}</p></div>` }).join("")}</div></section>`).join("");
}
async function openProduct(id){
  const ru = await loadRu();
  let p = st.products.find(x => x.id === id); if (!p) return;
  document.querySelectorAll(".pm-bg").forEach(x => x.remove());
  const bg = document.createElement("div"); bg.className = "pm-bg";
  bg.innerHTML = `<div class="pm" role="dialog" aria-modal="true" aria-labelledby="pmTitle"><div class="pm-handle"></div><div id="pmBody"></div></div>`;
  document.body.append(bg); document.body.style.overflow = "hidden";
  const close = () => { bg.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); afterModal() };
  const onKey = e => { if (e.key === "Escape") close() };
  document.addEventListener("keydown", onKey);
  bg.onclick = e => { if (e.target === bg) close() };
  const draw = () => {
    const r = ru[p.sku] || {}, q = st.cart[p.id] || 0;
    const vars = st.products.filter(x => x.base === p.base).sort((a, b) => a.volNum - b.volNum);
    const lead = String(r.desc || "").split("\n")[0];
    $("#pmBody").innerHTML = `
      <div class="pm-head">
        <div class="pm-photo">${p.img ? `<img src="${esc(p.img)}" alt="">` : ""}</div>
        <div class="pm-main">
          <div class="pm-top"><span class="pm-eyebrow">${esc(p.line)} · ${esc(p.type)}</span><button class="pm-x" type="button" aria-label="Закрыть">${ico("close")}</button></div>
          <h2 id="pmTitle">${esc(p.base)}${newBadge(p)}</h2>
          ${lead ? `<p class="pm-lead">${esc(lead)}</p>` : ""}
          <p class="pm-meta num">SKU ${esc(p.sku)}${p.status ? " · " + esc(p.status) : ""}${r.country ? " · Страна производства: " + esc(r.country) : ""}</p>
          <div class="pm-vols">${vars.map(v => `<button type="button" class="chip" data-var="${v.id}" aria-pressed="${v.id === p.id}">${esc(v.vol)}</button>`).join("")}${stockPill(p)}</div>
          <div class="pm-buy${q ? " incart" : ""}">
            <div class="pr num"><b>${money(priceOf(p))}</b> <small>с НДС</small><div class="sub">${money(netOf(p))} без НДС · РРЦ ${money(p.rrp)}</div></div>
            <div class="pm-qs">${stepper(p, q, "m")}<div class="vsum num${q ? "" : " zero"}">${q ? money(priceOf(p) * q) : "—"}</div></div>
          </div>
        </div>
      </div>
      <div class="pm-body">${cardSections(p, r)}</div>`;
    bg.querySelector(".pm-x").onclick = close;
    bg.querySelectorAll("[data-var]").forEach(b => b.onclick = () => { p = st.products.find(x => x.id === b.dataset.var); draw() });
    bindSteppers($("#pmBody"), "m", () => { updateTopCart(); const keep = $("#pmBody").parentElement.scrollTop; draw(); $("#pmBody").parentElement.scrollTop = keep });
  };
  draw();
  bg.querySelector(".pm-x")?.focus();
}
function afterModal(){
  const h = location.hash;
  if (h.startsWith("#/catalog") && $("#cards")) drawCards();
  else if (h.startsWith("#/cart")) renderCart();
  updateTopCart();
}

/* ============================================================
   КОРЗИНА
   ============================================================ */
function renderCart(){
  const L = cartLines();
  if (!L.length){
    shell("cart", [["Главная", "#/home"], ["Корзина"]], `<div class="empty">${ico("cart")}<h2 class="h-display">Ваша корзина пуста</h2><p>Добавьте товары из каталога. Здесь появятся состав заказа и персональные цены.</p><a class="btn btn-line" href="#/catalog">Перейти в каталог</a></div>`);
    return;
  }
  const g = grp();
  const total = L.reduce((s, x) => s + priceOf(x.p) * x.q, 0);
  const rrpT = L.reduce((s, x) => s + x.p.rrp * x.q, 0);
  const net = r2(total / (1 + VAT)), units = L.reduce((s, x) => s + x.q, 0);
  shell("cart", [["Главная", "#/home"], ["Корзина"]], `
    <div class="page-head"><h1 class="h-display">Корзина</h1><button class="btn btn-line btn-sm" id="clear" type="button">${ico("trash")} Очистить корзину</button></div>
    <div class="cart-layout">
      <div class="tbl">
        <div class="tbl-h"><span>Товар</span><span>Количество</span><span>Сумма</span><span></span></div>
        <div id="clines">${L.map(x => clineHtml(x.p, x.q)).join("")}</div>
      </div>
      <aside class="totals">
        <h2 class="h-display">Ваш заказ</h2>
        <div class="meta num">${units} ед. · ${L.length} ${plural(L.length, "позиция", "позиции", "позиций")}</div>
        <hr>
        <div class="kv big"><span>Итого с НДС</span><b class="num">${money(total)}</b></div>
        <div class="kv"><span>Без НДС</span><b class="num">${money(net)}</b></div>
        <div class="kv"><span>В том числе НДС 22%</span><b class="num">${money(total - net)}</b></div>
        <div class="kv small"><span>Сумма по РРЦ</span><span class="num">${money(rrpT)}</span></div>
        <div class="kv"><span>Ваша выгода</span><b class="num">${money(rrpT - total)}</b></div>
        <p class="note">Скидка ${Math.round(g.disc * 100)}% уже учтена в ценах.</p>
        <div class="field" style="margin-top:8px"><label for="comment">Комментарий к заказу</label><textarea class="input" id="comment" rows="3" placeholder="Адрес доставки, пожелания по отгрузке">${esc(store.get("hadat_b2b_comment") || "")}</textarea></div>
        <button class="btn btn-green" id="send" type="button">Оформить заказ</button>
        <p class="note">После оформления менеджер подтвердит наличие и условия доставки.</p>
      </aside>
    </div>`, {keepScroll:true});
  bindSteppers($("#clines"), "k", () => renderCart());
  document.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { delete st.cart[b.dataset.rm]; saveCart(); renderCart() });
  $("#comment").oninput = e => store.set("hadat_b2b_comment", e.target.value);
  $("#send").onclick = () => sendOrder(cartLines());
  $("#clear").onclick = () => confirmDialog("Очистить корзину?", `Из корзины будут удалены все ${L.length} ${plural(L.length, "позиция", "позиции", "позиций")}. Это действие нельзя отменить.`, "Очистить", () => { st.cart = {}; saveCart(); renderCart() });
}
function clineHtml(p, q){
  return `<div class="cline">
    <button type="button" class="im" data-open="${p.id}" aria-label="Карточка товара">${p.img ? `<span class="thumb"><img src="${esc(p.img)}" alt="" loading="lazy"></span>` : `<div class="thumb-ph"></div>`}</button>
    <div class="tx"><button type="button" class="nm open-link" data-open="${p.id}">${esc(p.base)}, ${esc(p.vol)}</button><div class="sk num">${esc(p.sku)} · <b>${money(priceOf(p))}</b> за шт.</div></div>
    <div class="stw">${stepper(p, q, "k")}</div>
    <div class="s num">${money(priceOf(p) * q)}</div>
    <button class="rm" type="button" data-rm="${p.id}" aria-label="Удалить позицию">${ico("close")}</button>
  </div>`;
}
function confirmDialog(h, text, ok, fn){
  const d = document.createElement("div"); d.className = "dialog-bg";
  d.innerHTML = `<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlgH"><h2 class="h-display" id="dlgH">${esc(h)}</h2><p>${esc(text)}</p><div class="acts"><button class="btn btn-line" type="button" data-x>Отмена</button><button class="btn btn-green" type="button" data-ok>${esc(ok)}</button></div></div>`;
  document.body.append(d);
  const close = () => d.remove();
  d.onclick = e => { if (e.target === d) close() };
  d.querySelector("[data-x]").onclick = close;
  d.querySelector("[data-ok]").onclick = () => { close(); fn() };
  d.querySelector("[data-ok]").focus();
}
async function sendOrder(L){
  const b = $("#send"); b.disabled = true; b.textContent = "Отправляем…";
  const O = T.ord, LN = T.line;
  try {
    const [o] = await create(O.id, [{fields:{[O.client]:[st.client.id], [O.date]:new Date().toISOString(), [O.status]:"Новый", [O.comment]:$("#comment").value.trim()}}]);
    if (!o?.id) throw {code:"tool_error", message:"заказ не вернул ID"};
    const recs = L.map(x => ({fields:{[LN.title]:`${x.p.sku} · ${x.p.name}`, [LN.order]:[o.id], [LN.product]:[x.p.id], [LN.qty]:x.q, [LN.price]:priceOf(x.p)}}));
    for (let i = 0; i < recs.length; i += 10) await create(LN.id, recs.slice(i, i + 10));
    st.cart = {}; saveCart(); store.set("hadat_b2b_comment", ""); st.orders = null; st.lines = null;
    toast(`Заказ ${o.f?.[O.num] ? orderNo(o.f[O.num]) + " " : ""}отправлен на согласование`);
    go("#/orders/" + o.id);
  } catch(e){
    b.disabled = false; b.textContent = "Оформить заказ";
    toast(e?.code === "network" ? "Ответ от Airtable не пришёл. Заказ мог создаться — проверьте «Заказы» перед повтором." : errText(e));
  }
}

/* ============================================================
   ЗАКАЗЫ
   ============================================================ */
async function loadOrders(force){
  if (st.orders && st.lines && !force) return;
  const O = T.ord, LN = T.line;
  const [all, lines] = await Promise.all([
    listAll(O.id, [O.num, O.date, O.status, O.comment, O.client, O.lines, O.total]),
    listAll(LN.id, [LN.title, LN.qty, LN.price, LN.order, LN.product, LN.sum])
  ]);
  st.lines = {};
  for (const r of lines){
    const oid = ids(r.f[LN.order])[0]; if (!oid) continue;
    const qty = +r.f[LN.qty] || 0, price = +r.f[LN.price] || 0;
    (st.lines[oid] ||= []).push({title:r.f[LN.title] || "", qty, price, sum:+r.f[LN.sum] || qty * price, pid:ids(r.f[LN.product])[0]});
  }
  st.orders = all.filter(r => ids(r.f[O.client]).includes(st.client.id)).map(r => {
    const L = st.lines[r.id] || [];
    const total = +r.f[O.total] || L.reduce((s, l) => s + l.sum, 0);
    return {id:r.id, num:r.f[O.num], date:r.f[O.date], status:sel(r.f[O.status]) || "Новый", comment:r.f[O.comment] || "", lines:L, total};
  }).sort((a, b) => (b.num || 0) - (a.num || 0));
}
const S = o => STATUS[o.status] || STATUS["Новый"];
const prodOf = id => st.products.find(p => p.id === id);
function fitThumbs(){
  document.querySelectorAll(".thumbs").forEach(box => {
    const items = [...box.querySelectorAll(".tm")], more = box.querySelector(".more");
    items.forEach(i => i.hidden = false); more.hidden = true;
    const W = box.clientWidth, step = 36, moreW = 40;
    if (items.length * step <= W) return;
    const cap = Math.max(1, Math.floor((W - moreW) / step));
    items.forEach((i, k) => i.hidden = k >= cap);
    more.textContent = "+" + (items.length - cap); more.hidden = false;
  });
}
window.addEventListener("resize", () => { clearTimeout(window._ft); window._ft = setTimeout(fitThumbs, 100) });
document.addEventListener("transitionend", e => { if (e.target.id === "shell") fitThumbs() });
function thumbsHtml(o){
  const imgs = o.lines.map(l => prodOf(l.pid)?.img).filter(Boolean);
  return `<div class="thumbs">${imgs.map(u => `<span class="tm"><img src="${esc(u)}" alt="" loading="lazy"></span>`).join("")}<span class="more" hidden></span></div>`;
}
const units = o => o.lines.reduce((s, l) => s + l.qty, 0);
async function renderOrders(){
  shell("orders", [["Главная", "#/home"], ["Заказы"]], `
    <div class="page-head"><h1 class="h-display">Заказы</h1><span class="orders-sum num" id="osum"></span></div>
    <div class="chiprow" role="group" aria-label="Статус" id="otabs"></div>
    <div class="toolbar" style="margin-top:6px"><div class="search">${ico("search")}<input class="input" type="search" id="oq" placeholder="№ заказа, артикул или название товара" value="${esc(st.of.q)}" aria-label="Поиск заказов"></div>
      <button class="link-btn" id="oreload" type="button">Обновить</button></div>
    <div id="olist"><div class="skel" style="height:60px;margin-bottom:8px"></div><div class="skel" style="height:60px;margin-bottom:8px"></div><div class="skel" style="height:60px"></div></div>`);
  $("#oreload").onclick = async () => { st.orders = null; renderOrders() };
  try { await loadOrders() } catch(e){ $("#olist").innerHTML = `<div class="err">${esc(errText(e))}</div>`; return }
  if (!$("#olist")) return;
  const tabs = [["all","Все"],["active","Активные"],["На согласовании","На согласовании"],["Подтверждён","Подтверждён"],["Доставлен","Доставлен"],["Отменён","Отменён"]];
  $("#otabs").innerHTML = tabs.map(([k, t]) => `<button type="button" class="chip" data-ot="${k}" aria-pressed="${st.of.tab === k}">${t}</button>`).join("");
  document.querySelectorAll("[data-ot]").forEach(b => b.onclick = () => { st.of.tab = b.dataset.ot; document.querySelectorAll("[data-ot]").forEach(x => x.setAttribute("aria-pressed", x === b)); drawOrders() });
  $("#oq").oninput = e => { st.of.q = e.target.value; drawOrders() };
  const act = st.orders.filter(o => S(o).active);
  $("#osum").textContent = act.length ? `Активных: ${act.length} на ${money(act.reduce((s, o) => s + o.total, 0))}` : "";
  drawOrders();
}
function drawOrders(){
  const box = $("#olist"); if (!box) return;
  if (!st.orders.length){
    box.innerHTML = `<div class="empty">${ico("orders")}<h2 class="h-display">Заказов пока нет</h2><p>Соберите корзину в каталоге и оформите первый заказ — он появится здесь со статусом и суммой.</p><a class="btn btn-line" href="#/catalog">Перейти в каталог</a></div>`;
    return;
  }
  const q = st.of.q.trim().toLowerCase(), tab = st.of.tab;
  const list = st.orders.filter(o => (tab === "all" || (tab === "active" ? S(o).active : S(o).t === tab)) &&
    (!q || (orderNo(o.num) + " " + o.lines.map(l => l.title).join(" ")).toLowerCase().includes(q)));
  if (!list.length){ box.innerHTML = `<div class="empty">${ico("search")}<h2 class="h-display">Ничего не найдено</h2><p>Измените поиск или фильтр по статусу.</p></div>`; return }
  const addr = st.client.city || "—";
  box.innerHTML = `<div class="otbl">
    <div class="otbl-h"><span>№ и дата</span><span>Статус и оплата</span><span>Состав</span><span>Сумма с НДС</span><span>Доставка</span><span></span></div>
    ${list.map(o => `<a class="orow${o.status === "Отменён" ? " cancel" : ""}" href="#/orders/${o.id}" style="--stripe:${S(o).stripe}">
      <div class="no"><b class="num">${orderNo(o.num)}</b><span class="num">${dateRu(o.date)}</span></div>
      <div class="stt"><span class="pill ${S(o).c}">${S(o).t}</span><span class="pay">${S(o).pay}</span></div>
      <div class="comp">${thumbsHtml(o)}<div class="cnt num">${o.lines.length} поз. · ${units(o)} ед.</div></div>
      <div class="sum num">${money(o.total)}</div>
      <div class="addr">${esc(addr)}</div>
      <span class="chev">${ico("expand")}</span>
    </a>`).join("")}
  </div>
  <p class="hint" style="margin-top:12px">Показано ${list.length} из ${st.orders.length}</p>`;
  fitThumbs();
}
async function renderOrder(id){
  shell("orders", [["Главная", "#/home"], ["Заказы", "#/orders"], ["…"]], `<div class="skel" style="height:44px;width:320px;margin-bottom:16px"></div><div class="skel" style="height:160px"></div>`);
  try { await loadOrders(!st.orders || !st.orders.find(o => o.id === id)) } catch(e){ $("#content").innerHTML = `<div class="err">${esc(errText(e))}</div>`; return }
  const o = st.orders.find(x => x.id === id);
  if (!o){ shell("orders", [["Главная", "#/home"], ["Заказы", "#/orders"], ["Не найден"]], `<div class="empty">${ico("orders")}<h2 class="h-display">Заказ не найден</h2><a class="btn btn-line" href="#/orders">К списку заказов</a></div>`); return }
  const s = S(o), net = r2(o.total / (1 + VAT));
  const rrpT = o.lines.reduce((sum, l) => sum + (prodOf(l.pid)?.rrp || l.price) * l.qty, 0);
  const paid = s.pay === "Оплачен" ? o.total : 0;
  const kv = (k, v, w) => `<div class="kvv${w ? " wide" : ""}"><b>${k}</b><span>${esc(v)}</span></div>`;
  shell("orders", [["Главная", "#/home"], ["Заказы", "#/orders"], [orderNo(o.num)]], `
    <div class="ohead">
      <a class="back" href="#/orders" aria-label="К списку заказов">${ico("collapse")}</a>
      <h1 class="num">${orderNo(o.num)}</h1>
      <span class="pill ${s.c}">${s.t}</span>
      <span class="date num">от ${dateRu(o.date)}</span>
      <div class="acts">
        <button class="link-btn" type="button" data-doc="Счёт">${ico("down", "ico")} Счёт</button>
        <button class="link-btn" type="button" data-doc="Накладная">${ico("down", "ico")} Накладная</button>
        <button class="btn btn-green" id="repeat" type="button">Повторить заказ</button>
      </div>
    </div>
    <div class="osum">
      <div class="oinfo">
        ${kv("Оплата", s.pay)}${kv("Доставка", st.client.city || "—")}${kv("Трек-номер", o.status === "Доставлен" || o.status === "Отгружен" ? "Передан в службу доставки" : "Появится после отправки")}
        ${kv("Комментарий", o.comment || "—", true)}
      </div>
      <div class="ototals">
        <div class="kv big"><span>Итого с НДС</span><b class="num">${money(o.total)}</b></div>
        <div class="kv"><span>Без НДС</span><b class="num">${money(net)}</b></div>
        <div class="kv"><span>НДС 22%</span><b class="num">${money(o.total - net)}</b></div>
        <div class="kv"><span>Сумма по РРЦ</span><b class="num">${money(rrpT)}</b></div>
        <div class="kv"><span>Ваша выгода</span><b class="num">${money(Math.max(0, rrpT - o.total))}</b></div>
        <hr>
        <div class="kv"><span>Оплачено</span><b class="num">${money(paid)}</b></div>
        <div class="kv big"><span>К оплате</span><b class="num">${money(o.status === "Отменён" ? 0 : o.total - paid)}</b></div>
      </div>
    </div>
    <div class="tbl otable">
      <div class="tbl-h"><span class="num">${o.lines.length} ${plural(o.lines.length, "позиция", "позиции", "позиций")} · ${units(o)} ед.</span><span style="text-align:right">Количество × цена</span><span>Сумма</span></div>
      ${o.lines.map(l => { const p = prodOf(l.pid); return `<div class="oline"${p ? ` data-row="${p.id}"` : ""}>
        <div class="im">${p?.img ? `<button type="button" data-open="${p.id}" aria-label="Карточка товара"><span class="thumb"><img src="${esc(p.img)}" alt="" loading="lazy"></span></button>` : ""}</div>
        <div class="nm">${p ? `<button type="button" class="open-link" data-open="${p.id}">${esc(p.base)}, ${esc(p.vol)}</button>` : esc(l.title)}<span class="num">${esc(p?.sku || "")}</span></div>
        <div class="q num">${l.qty} × ${money(l.price)}</div>
        <div class="s num">${money(l.sum)}</div></div>` }).join("") || `<div class="oline"><div></div><div class="hint">Позиции не найдены</div></div>`}
    </div>`);
  document.querySelectorAll("[data-doc]").forEach(b => b.onclick = () => toast(`${b.dataset.doc}: в демо-версии документы не формируются`));
  $("#repeat").onclick = () => {
    let added = 0, skipped = 0;
    for (const l of o.lines){ const p = prodOf(l.pid); if (!p || p.stock <= 0){ skipped++; continue }
      const q = Math.min(p.stock, (st.cart[p.id] || 0) + l.qty); st.cart[p.id] = q; added++ }
    saveCart();
    toast(skipped ? `В корзину добавлено ${added} поз. Нет в наличии: ${skipped}` : `В корзину добавлено ${added} поз.`);
    go("#/cart");
  };
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-open]"); if (b){ e.preventDefault(); return openProduct(b.dataset.open) }
  if (e.target.closest(".stw,.vsum,[data-tip],.ptot")) return;
  const row = e.target.closest(".vrow[data-row],.oline[data-row]"); if (row) return openProduct(row.dataset.row);
  const hd = e.target.closest(".pcard-h"); if (hd){ const l = hd.querySelector("[data-open]"); if (l) openProduct(l.dataset.open) }
});
boot();
