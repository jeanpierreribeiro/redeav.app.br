# Rede AV — protótipo do novo site

## Acesso por código (Vercel)
O site publicado fica atrás de uma tela de código, como no protótipo da AV Brasil Proteção.
- `middleware.js` roda na borda da Vercel **antes** de entregar qualquer arquivo. Sem o cookie `rav_acesso`, nada do site é servido: tudo vai para `/acesso/`.
- Código certo → cookie HttpOnly de 7 dias → site. `/sair` apaga o cookie.
- O código **não está em texto** no repositório, só o hash SHA-256. Para trocar sem mexer no código, crie na Vercel a variável `ACCESS_CODE` (Settings → Environment Variables); ela tem prioridade sobre o hash.
- Tudo o que é publicado fica em `site/` (`vercel.json` define `outputDirectory`). `docs/` e `README.md` não vão ao ar.
- Fora dos buscadores: `robots.txt`, cabeçalho `X-Robots-Tag: noindex` (`vercel.json`) e `<meta name="robots">` na tela de acesso.
- Testes: `TEST_CODE='<código>' node test/gate.test.mjs`.
- **Para lançar de verdade** (domínio público): remover `middleware.js`, o `noindex` do `vercel.json` e o `Disallow` do `robots.txt`.

> Os caminhos abaixo agora ficam dentro de `site/`.

Protótipo estático (HTML + CSS + JS), sem build. Abra `index.html` direto no navegador
ou rode um servidor local na pasta (ex.: `python -m http.server 8000` ou `npx serve`).

## Estrutura
- `index.html` — página única (hero, clube, scroll horizontal fixo, cashback, simulador, números, depoimentos, passos, família AV Brasil, FAQ, CTA, rodapé)
- `css/styles.css` — tokens da marca no topo (`:root`) + componentes
- `js/config.js` — **dados editáveis**: WhatsApp, links e taxas do simulador (itens marcados [CONFIRMAR])
- `js/app.js` — interações (GSAP + ScrollTrigger + Lenis, simulador, FAQ, menu)
- `assets/img/` — logo da RedeAV extraída do manual (SVG vetorial: colorida, sobre fundo escuro, branca, símbolo) e fotos do "Estilo de imagem" do manual
- `assets/vendor/` — gsap 3.12.5, ScrollTrigger 3.12.5, lenis 1.1.13 (self-hosted)
- `assets/fonts/` — Sora (fonte de sistema do manual). Para usar a **Magistral**, veja o bloco comentado no topo de `styles.css`
- `docs/estrategia-de-copy-redeav.md` — estratégia de copywriting e copy final por seção

## Paleta (Manual de Marca RedeAV 2026)
Amarelo `#f6a613` · Azul profundo `#01497c` · Azul vibrante `#3881c3` · Cinza suave `#ecedef`
(tons derivados para profundidade: `#03233b`, `#013a63`)

## Antes de publicar
Veja a seção "Pendências para validar" em `docs/estrategia-de-copy-redeav.md`.
