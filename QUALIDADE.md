# Qualidade · XV Ana Luísa

Análise do front contra o `PADRAO-QUALIDADE-SITES.md` do estúdio, em 27/10/2026 (ajustes de design aplicados no mesmo dia), no branch `texto/momentos-inesqueciveis`.
Legenda: `[x]` feito · `[~]` parcial · `[ ]` pendente · `n/a` não se aplica (com o motivo).

O backend do Richard entrou em `backend/` em 30/10/2026. A seção 3 (Backend) ainda não foi auditada; os pontos já vistos na integração estão no README, em "Pontos para o backend".

## Lighthouse (celular, servidor local)

| Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|
| **81** (meta ≥ 90) | **100** | **100** | 60 (de propósito, ver SEO) |

LCP 3,9 s (meta < 2,5 s) · CLS 0,006 · TBT 0 ms.

O que pesa na nota de performance:
1. **Fontes do Google bloqueiam a primeira pintura** (~2,3 s estimados). São 3 famílias com 6 pesos.
2. **`decoracao.jpg` (145 KB) baixa logo na abertura** porque está no `<img>` escondido da câmera simulada e no fundo do botão do rolo. Ele só aparece depois de entrar (é a primeira foto da galeria e o visor simulado), não na abertura.
3. JPG em vez de WebP/AVIF (~45 KB a economizar).
4. Compressão e cache: o servidor local não comprime. No GitHub Pages ou em outra hospedagem isso melhora sozinho, mas precisa ser medido de novo lá.

## 1. Design e referências

- [x] Direção visual a partir de referências anotadas no README (seção "Direção visual": Enrolados, cores e papel de cada fonte).
- [x] Tokens definidos antes das telas (variáveis em `:root`: cores, fontes, margens).
- [~] No máximo 2 famílias de fonte. São 3 (Great Vibes, Cormorant Garamond e Jost), e ficaram como **exceção registrada no README**, com o papel de cada uma e qual sai primeiro se a performance apertar.
- [x] Contraste AA. Lilás 9,5:1, ouro 13,7:1, botão 9:1 e o placeholder "Seu nome" subiu de 3,7:1 para 5,6:1.
- [x] Animações respeitam `prefers-reduced-motion` (lanternas, brilhos, sol, saída da abertura).
- [x] Efeitos pesados. Os canvas não têm WebGL, o TBT é 0, e os brilhos agora param enquanto a câmera ou a foto ampliada cobrem a tela.
- [x] Efeito decorativo não atrapalha leitura nem botão.
- n/a Modelos 3D: o site não tem.

## 2. Frontend

### Layout e responsividade
- [~] Testado em 375 px (celular) e no desktop do navegador. Faltam 360, 768, 1280 e 1920 px.
- [x] Sem rolagem horizontal (medido em 375 px).
- [x] Áreas de toque de 44 px. Barra, "+", botões da câmera, setas e "Fechar ✕" da foto ampliada (este tinha 43 px e passou para 44).
- n/a Tema claro/escuro: a noite escura é a identidade da festa.

### Conversão
- n/a CTA, WhatsApp flutuante e prova social: não é site de negócio. O "CTA" é o **+**, que fica sempre visível na barra.
- [x] Estados de carregando, sucesso e erro no envio: progresso em %, botões travados durante o envio, mensagem do servidor ou de falta de internet, e "Tentar de novo" sem perder a foto. A galeria também tem estados de carregando, vazio e erro.

### Performance
- [ ] Lighthouse mobile ≥ 90 (está em 81, ver acima).
- [ ] LCP < 2,5 s (3,9 s). [x] CLS < 0,1. [x] INP/TBT.
- [~] Imagens. Já têm `width`/`height` e `decoding="async"`. Faltam WebP/AVIF, `loading="lazy"` na galeria e `srcset`.
- [~] Fontes com `display=swap` [x], mas sem pré-carregar só a principal e com 3 famílias.
- n/a Scripts de terceiros: não há analytics nem pixel.

### Acessibilidade
- [~] HTML semântico. Tem `header`, `main`, `nav`, um `h1` na abertura e agora o título "Momentos inesquecíveis" (`h1`) na galeria; como só uma tela aparece por vez, há um `h1` visível de cada vez. Não tem `footer` (entra junto com o aviso de LGPD).
- [~] Teclado e foco visível. O foco é visível e volta para o lugar certo ao fechar. **Falta prender o foco dentro dos diálogos** (câmera, foto ampliada, "Como usar"): com Tab, o foco sai para a galeria que está por trás.
- [x] `alt` nas fotos ("Foto de Marina"); decorativas com `aria-hidden`.
- [x] Label no campo de nome.

### SEO
- n/a Indexação: o `noindex` é de propósito, porque é a galeria privada de uma festa. Por isso o SEO dá 60 no Lighthouse, e está certo assim. `sitemap.xml`, JSON-LD, Search Console e GA4 também não se aplicam.
- [x] `title` e `description`.
- [~] Open Graph e Twitter Card [x], mas o `og:image` ainda é caminho relativo. O WhatsApp só mostra a prévia com endereço completo, que depende do domínio.
- [ ] `robots.txt` com `Disallow: /`. Reforça o `noindex` para as fotos em `assets/` e as que virão do backend.

## 4. Compliance e LGPD

Aqui está o ponto mais sério: o site recolhe **nome e fotos de convidados, muitos deles menores de idade** (é uma festa de 15 anos). A LGPD (art. 14) pede cuidado extra com dados de crianças e adolescentes.

- [ ] Aviso curto na tela de boas-vindas: para que servem nome e fotos, quem vê a galeria e até quando ela fica no ar.
- [ ] Forma de pedir para tirar uma foto da galeria (um contato da família ou do estúdio).
- [ ] Política de privacidade curta (pode ser uma folha dentro do próprio site).
- n/a Banner de cookies: não há analytics nem pixel. O nome fica no `localStorage` só para não perguntar de novo.
- [ ] Dados do controlador (quem responde pelas fotos: a família ou o estúdio). **Pendente com a cliente**, não vou inventar.

## 5. Entrega

- [~] README com stack, como rodar e estrutura [x]. Faltam as referências visuais e as variáveis de ambiente (quando o backend chegar).
- [~] Textos e fotos reais. A galeria agora vem do backend e os exemplos saíram. Faltam a data e o local da festa.
- [ ] Testado em Chrome, Safari (iOS) e Samsung Internet. Só foi testado no navegador do computador. **O Safari do iPhone é o mais importante**: a gravação de vídeo (`MediaRecorder`) e a câmera se comportam diferente lá.
- [x] Favicon, ícone do iPhone e imagem de compartilhamento.
- [x] Página 404.
- n/a Painel: não há.

## Qualidade de código

O que está bom:
- Nomes em português, consistentes com o tema (`lanternas`, `abrirFolha`, `meuNome`), e comentários que explicam o porquê.
- Sem dependências nem build: abre direto no GitHub Pages.
- Nomes de convidados passam por `esc()` antes de entrar no HTML, então um nome com `<script>` não quebra a página.
- `try/catch` no `localStorage` (navegação anônima no iPhone não derruba o site).

O que melhorar:
- [ ] **Arquivo único com ~860 linhas** (CSS + HTML + JS). Separar em `estilos.css` e `app.js` facilita revisar e deixa o navegador guardar em cache.
- [ ] **Várias instruções por linha** (ex.: `abrir()`, `pararGravacao()`, `fotografar()`). Fica difícil ler um diff e achar um erro. Um formatador (Prettier) resolve de uma vez.
- [ ] Dois blocos `<style>`, um no `<head>` e outro no `<body>`. O primeiro põe `padding` de área segura no `:root`, que se soma ao `body::before` e aos `env()` da barra. Juntar num só bloco e conferir no iPhone com notch.
- [x] Memória: as prévias descartadas e os vídeos abertos na foto ampliada agora são liberados com `revokeObjectURL`.
- [ ] Ao girar o celular, as lanternas são recriadas e a lanterna da pessoa some no meio da animação.
- [x] Dados vindos do servidor (id, nome de quem enviou, endereço da foto) passam por `esc()` antes de entrar no HTML.
- [ ] `qr.html` carrega a biblioteca do cdnjs sem `integrity` (SRI). Se o CDN for comprometido, o QR pode apontar para outro site.
- [ ] Sem lint, sem testes e sem CI. Para um site deste tamanho, basta um `npx prettier --check` e um `npx html-validate` no GitHub Actions.

## Prioridade sugerida

1. **LGPD:** aviso nas boas-vindas e forma de tirar uma foto da galeria (depende de a cliente dizer quem responde).
2. **Testar no iPhone e no Samsung** com o site publicado em HTTPS (câmera e gravação).
3. **Performance:** carregar `decoracao.jpg` só depois de sair da abertura, reduzir as fontes e converter para WebP. Isso deve levar a nota para perto de 90.
4. **Acessibilidade:** foco preso nos diálogos (título da galeria e contraste já foram feitos).
5. ~~Bateria: pausar os brilhos atrás da câmera e da foto ampliada.~~ Feito.
6. **Código:** separar CSS/JS, formatar, liberar os `objectURL` e adicionar SRI no `qr.html`.
7. **Com o backend:** estados de envio, escapar URLs, tirar os exemplos e trocar o `og:image` pelo endereço completo.
