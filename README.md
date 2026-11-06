# Rede AV — protótipo do novo site

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
