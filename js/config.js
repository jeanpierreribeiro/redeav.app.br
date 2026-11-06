/* ==========================================================================
   Rede AV — configuração do protótipo
   Tudo o que depende de dado real do negócio fica aqui, em um só lugar.
   Itens marcados [CONFIRMAR] são placeholders e precisam de validação.
   ========================================================================== */
window.REDEAV = {
  /* [CONFIRMAR] WhatsApp oficial da Rede AV, formato internacional sem símbolos (ex.: 5531999999999) */
  whatsapp: "5500000000000",

  /* [CONFIRMAR] Links reais. Enquanto estiverem como "#", os botões não navegam. */
  links: {
    acessarRede: "#",   // área/app "Acessar Rede"
    appStore: "#",
    playStore: "#",
    instagram: "#",
    email: "#",         // ex.: "mailto:contato@..."
    avBrasil: "https://avbrasilprotecao.vercel.app/prototipo-02/variacao-v2/"
  },

  /* [CONFIRMAR] Simulador: as taxas abaixo são ILUSTRATIVAS (não são as taxas reais da Rede AV).
     Substitua por médias reais antes de publicar. `taxa` = fração do gasto que volta (0.03 = 3%). */
  simulador: [
    { id: "combustivel", label: "Combustível",              icon: "i-fuel",      min: 0, max: 2000, step: 50, valor: 400, taxa: 0.015, cor: "#f6a613" },
    { id: "farmacia",    label: "Farmácia",                  icon: "i-pharmacy",  min: 0, max: 1500, step: 25, valor: 200, taxa: 0.03, cor: "#3881c3" },
    { id: "mercado",     label: "Mercado e alimentação",     icon: "i-utensils",  min: 0, max: 3000, step: 50, valor: 800, taxa: 0.015, cor: "#ffffff" },
    { id: "online",      label: "Compras online",            icon: "i-bag",       min: 0, max: 3000, step: 50, valor: 300, taxa: 0.03, cor: "#9fc4e8" },
    { id: "bemestar",    label: "Beleza, academia e lazer",  icon: "i-sparkles",  min: 0, max: 1500, step: 25, valor: 150, taxa: 0.025, cor: "#ffd37a" }
  ]
};
